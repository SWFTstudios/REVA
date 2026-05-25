// ListFast — main Cloudflare Worker
// Routes:
//   GET  /                          → landing page
//   GET  /onboard                   → upload wizard
//   GET  /preview/:id               → property page (with REVA widget)
//   GET  /dashboard/:id?t=token     → landlord dashboard
//   GET  /thanks?listing=:id        → post-checkout confirmation
//
//   POST /api/listings              → create draft listing
//   GET  /api/listings/:id          → fetch listing JSON
//   PATCH /api/listings/:id         → update listing (edit_token required)
//   POST /api/listings/:id/upload   → multipart image upload → R2
//   POST /api/listings/:id/checkout → create Stripe Checkout Session
//   POST /api/listings/:id/inquiries → submit inquiry from prospect
//   POST /api/listings/:id/showings  → request showing
//   POST /api/reva/:listingId        → REVA chatbot turn
//   POST /api/stripe/webhook         → Stripe webhook
//
//   GET  /uploads/:listingId/:filename → serve image from R2

import { renderSwftHome } from "./templates/swft-home.js";
import { renderSwftProperties } from "./templates/swft-properties.js";
import { renderSwftDetail, renderSwftDetailNotFound } from "./templates/swft-detail.js";
import { getDemoBySlug } from "./data/demo-listings.js";
import { renderPreview, renderThanks, renderNotFound } from "./templates/preview.js";
import { renderDashboard } from "./templates/dashboard.js";
import { createCheckoutSession, verifyStripeSignature, parseStripeEvent } from "./stripe.js";
import { revaTurn } from "./reva.js";
import { generateListingDescription, buildDescriptionFallback } from "./description.js";
import { syncInquiryToAirtable, syncListingToAirtable } from "./airtable.js";
import { getNotificationEmail, shouldEmailOwner } from "./intake-routing.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });

const html = (body, init = {}) =>
  new Response(body, {
    status: init.status ?? 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });

const bad = (msg, status = 400) => json({ error: msg }, { status });

const uid = (len = 10) => {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => alphabet[b % alphabet.length]).join("");
};

const safeJSON = (v, fallback = null) => {
  try { return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};

const PLAN_PRICES = (env) => ({
  quick: {
    setup: env.STRIPE_PRICE_QUICK_SETUP,
    monthly: env.STRIPE_PRICE_QUICK_MONTHLY,
    label: "Quick List",
    setup_amount: 79,
    monthly_amount: 29,
  },
  pro: {
    setup: env.STRIPE_PRICE_PRO_SETUP,
    monthly: env.STRIPE_PRICE_PRO_MONTHLY,
    label: "Pro List",
    setup_amount: 149,
    monthly_amount: 49,
  },
  portfolio: {
    setup: null,
    monthly: env.STRIPE_PRICE_PORTFOLIO,
    label: "Portfolio",
    setup_amount: 0,
    monthly_amount: 299,
  },
});

async function getListing(env, id) {
  return await env.DB.prepare("SELECT * FROM listings WHERE id = ?").bind(id).first();
}

function requireEditToken(req, listing) {
  const url = new URL(req.url);
  const headerToken = req.headers.get("x-edit-token");
  const queryToken = url.searchParams.get("t") || url.searchParams.get("token");
  const token = headerToken || queryToken;
  return !!token && listing && token === listing.edit_token;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main fetch handler
// ─────────────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // ── Static page routes ──────────────────────────────────────────────
      if (method === "GET" && path === "/") {
        return html(renderSwftHome({ appUrl: env.APP_URL || url.origin }));
      }

      if (method === "GET" && path === "/properties") {
        return html(renderSwftProperties({ appUrl: env.APP_URL || url.origin }));
      }

      if (method === "GET" && path.startsWith("/properties/")) {
        const slug = path.split("/")[2];
        const demo = getDemoBySlug(slug);
        if (!demo) return html(renderSwftDetailNotFound(), { status: 404 });
        return html(renderSwftDetail({ listing: demo, appUrl: env.APP_URL || url.origin }));
      }

      if (method === "GET" && path.startsWith("/assets/") && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      if (method === "GET" && path === "/onboard") {
        const dest = new URL("/#intake", env.APP_URL || url.origin);
        url.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
        return Response.redirect(dest.toString(), 302);
      }

      if (method === "GET" && path.startsWith("/preview/")) {
        const id = path.split("/")[2];
        let listing = await getListing(env, id);
        if (!listing) return html(renderNotFound(), { status: 404 });
        listing = await ensureListingDescription(env, listing, ctx);
        const isOwner = requireEditToken(request, listing);
        return html(renderPreview({
          listing: hydrateListing(listing),
          appUrl: env.APP_URL || url.origin,
          isOwner,
          editToken: isOwner ? listing.edit_token : null,
        }));
      }

      if (method === "GET" && path.startsWith("/dashboard/")) {
        const id = path.split("/")[2];
        const listing = await getListing(env, id);
        if (!listing) return html(renderNotFound(), { status: 404 });
        if (!requireEditToken(request, listing)) {
          return html(renderNotFound("This dashboard link is invalid or expired."), { status: 403 });
        }
        const inquiries = await env.DB.prepare(
          "SELECT * FROM inquiries WHERE listing_id = ? ORDER BY created_at DESC"
        ).bind(id).all();
        const showings = await env.DB.prepare(
          "SELECT * FROM showings WHERE listing_id = ? ORDER BY created_at DESC"
        ).bind(id).all();
        return html(renderDashboard({
          listing: hydrateListing(listing),
          inquiries: inquiries.results || [],
          showings: showings.results || [],
          appUrl: env.APP_URL || url.origin,
          env,
        }));
      }

      if (method === "GET" && path === "/thanks") {
        const id = url.searchParams.get("listing");
        const listing = id ? await getListing(env, id) : null;
        return html(renderThanks({
          listing: listing ? hydrateListing(listing) : null,
          appUrl: env.APP_URL || url.origin,
        }));
      }

      // ── R2 image serving ────────────────────────────────────────────────
      if (method === "GET" && path.startsWith("/uploads/")) {
        const parts = path.split("/").slice(2); // listingId/filename...
        const key = parts.join("/");
        if (!env.UPLOADS) return new Response("R2 not configured", { status: 503 });
        const obj = await env.UPLOADS.get(key);
        if (!obj) return new Response("Not found", { status: 404 });
        return new Response(obj.body, {
          headers: {
            "content-type": obj.httpMetadata?.contentType || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
            "etag": obj.httpEtag,
          },
        });
      }

      // ── API ─────────────────────────────────────────────────────────────
      if (path.startsWith("/api/")) {
        return await handleApi(request, env, ctx, url);
      }

      // 404
      return html(renderNotFound(), { status: 404 });
    } catch (err) {
      console.error("Worker error", err);
      return json({ error: err.message || "internal error" }, { status: 500 });
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// API handler
// ─────────────────────────────────────────────────────────────────────────────

async function handleApi(request, env, ctx, url) {
  const path = url.pathname;
  const method = request.method;

  // POST /api/listings — create draft
  if (method === "POST" && path === "/api/listings") {
    const body = await request.json().catch(() => ({}));
    const id = uid(8);
    const editToken = uid(20);
    const now = new Date().toISOString();
    const data = sanitizeListing(body);
    await env.DB.prepare(`
      INSERT INTO listings (
        id, edit_token, status, plan, template, goal,
        property_name, address_line, city, state, zip,
        price_cents, price_unit, bedrooms, bathrooms, sqft, property_type,
        description, features_json, schedule_json,
        contact_name, contact_email, contact_phone,
        images_json, files_json, features_options_json, intake_options_json,
        created_at, updated_at
      ) VALUES (${Array(29).fill("?").join(",")})
    `).bind(
      id, editToken, "draft", data.plan, data.template || "swft", data.goal,
      data.property_name, data.address_line, data.city, data.state, data.zip,
      data.price_cents, data.price_unit || "monthly", data.bedrooms, data.bathrooms, data.sqft, data.property_type,
      data.description, JSON.stringify(data.features || []), JSON.stringify(data.schedule || {}),
      data.contact_name, data.contact_email, data.contact_phone,
      JSON.stringify(data.images || []), JSON.stringify(data.files || []), JSON.stringify(data.features_options || {}),
      JSON.stringify(data.intake_options || {}),
      now, now
    ).run();
    const created = await getListing(env, id);
    if (created) {
      ctx.waitUntil(syncListingToAirtable(env, hydrateListing(created), env.APP_URL || url.origin));
    }
    return json({ id, edit_token: editToken, preview_url: `${env.APP_URL || url.origin}/preview/${id}` });
  }

  // GET /api/listings/:id
  const listingMatch = path.match(/^\/api\/listings\/([^/]+)$/);
  if (method === "GET" && listingMatch) {
    const listing = await getListing(env, listingMatch[1]);
    if (!listing) return bad("not found", 404);
    return json(publicListing(listing));
  }

  // PATCH /api/listings/:id (owner-only)
  if (method === "PATCH" && listingMatch) {
    const id = listingMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    if (!requireEditToken(request, listing)) return bad("forbidden", 403);
    const patch = sanitizeListing(await request.json().catch(() => ({})));
    const fields = [];
    const values = [];
    const map = {
      plan: patch.plan, template: patch.template, goal: patch.goal,
      property_name: patch.property_name, address_line: patch.address_line, city: patch.city, state: patch.state, zip: patch.zip,
      price_cents: patch.price_cents, price_unit: patch.price_unit,
      bedrooms: patch.bedrooms, bathrooms: patch.bathrooms, sqft: patch.sqft, property_type: patch.property_type,
      description: patch.description,
      features_json: patch.features ? JSON.stringify(patch.features) : undefined,
      schedule_json: patch.schedule ? JSON.stringify(patch.schedule) : undefined,
      contact_name: patch.contact_name, contact_email: patch.contact_email, contact_phone: patch.contact_phone,
      images_json: Array.isArray(patch.images) && patch.images.length
        ? JSON.stringify(patch.images)
        : undefined,
      files_json: Array.isArray(patch.files) && patch.files.length
        ? JSON.stringify(patch.files)
        : undefined,
      features_options_json: patch.features_options ? JSON.stringify(patch.features_options) : undefined,
      intake_options_json: patch.intake_options ? JSON.stringify(patch.intake_options) : undefined,
    };
    for (const [k, v] of Object.entries(map)) {
      if (v !== undefined && v !== null && v !== "") {
        fields.push(`${k} = ?`);
        values.push(v);
      }
    }
    if (!fields.length) return json({ ok: true, updated: 0 });
    fields.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);
    await env.DB.prepare(`UPDATE listings SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
    return json({ ok: true, updated: fields.length });
  }

  // POST /api/listings/:id/upload — multipart upload to R2 (kind=image|file)
  const uploadMatch = path.match(/^\/api\/listings\/([^/]+)\/upload$/);
  if (method === "POST" && uploadMatch) {
    const id = uploadMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    if (!requireEditToken(request, listing)) return bad("forbidden", 403);
    if (!env.UPLOADS) {
      return bad("R2 storage not yet enabled on this Cloudflare account. Enable R2 in the dashboard and create a bucket named 'listfast-uploads'.", 503);
    }
    const form = await request.formData();
    const kind = (form.get("kind") || url.searchParams.get("kind") || "image").toString();
    const files = form.getAll("files");
    if (!files.length) return bad("no files");
    const maxSize = kind === "file" ? 25 * 1024 * 1024 : 12 * 1024 * 1024;
    const stored = [];
    for (const f of files) {
      if (typeof f === "string") continue;
      const isBlob = typeof Blob !== "undefined" && f instanceof Blob;
      const isFile = typeof File !== "undefined" && f instanceof File;
      if (!isBlob && !isFile) continue;
      const name = (isFile && f.name) || "upload";
      const size = f.size || 0;
      const type = (isFile && f.type) || (kind === "image" ? "image/jpeg" : "application/octet-stream");
      if (size > maxSize) return bad(`file ${name} too large (max ${kind === "file" ? "25" : "12"}MB each)`);
      const ext = (name.split(".").pop() || (kind === "image" ? "jpg" : "bin")).toLowerCase().replace(/[^a-z0-9]/g, "");
      const key = `${id}/${kind}/${Date.now()}-${uid(6)}.${ext}`;
      await env.UPLOADS.put(key, f.stream(), {
        httpMetadata: { contentType: type },
      });
      stored.push({
        url: `/uploads/${key}`,
        name,
        size,
        type,
      });
    }
    if (!stored.length) return bad("no valid files received");
    if (kind === "file") {
      const existing = safeJSON(listing.files_json, []) || [];
      const merged = [...existing, ...stored];
      await env.DB.prepare("UPDATE listings SET files_json = ?, updated_at = ? WHERE id = ?")
        .bind(JSON.stringify(merged), new Date().toISOString(), id).run();
      return json({ ok: true, files: merged });
    }
    const existing = safeJSON(listing.images_json, []) || [];
    const merged = [...existing, ...stored];
    await env.DB.prepare("UPDATE listings SET images_json = ?, updated_at = ? WHERE id = ?")
      .bind(JSON.stringify(merged), new Date().toISOString(), id).run();
    return json({ ok: true, images: merged });
  }

  // POST /api/listings/:id/generate-description
  const genDescMatch = path.match(/^\/api\/listings\/([^/]+)\/generate-description$/);
  if (method === "POST" && genDescMatch) {
    const id = genDescMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    if (!requireEditToken(request, listing)) return bad("forbidden", 403);
    const hydrated = hydrateListing(listing);
    const text = await generateListingDescription(hydrated, env.ANTHROPIC_API_KEY);
    await env.DB.prepare("UPDATE listings SET description = ?, updated_at = ? WHERE id = ?")
      .bind(text, new Date().toISOString(), id).run();
    return json({ ok: true, description: text });
  }

  // GET /api/listings/:id/inquiries/export.csv
  const csvMatch = path.match(/^\/api\/listings\/([^/]+)\/inquiries\/export\.csv$/);
  if (method === "GET" && csvMatch) {
    const id = csvMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    if (!requireEditToken(request, listing)) return bad("forbidden", 403);
    const inquiries = await env.DB.prepare(
      "SELECT * FROM inquiries WHERE listing_id = ? ORDER BY created_at DESC"
    ).bind(id).all();
    const showings = await env.DB.prepare(
      "SELECT * FROM showings WHERE listing_id = ? ORDER BY created_at DESC"
    ).bind(id).all();
    const csv = buildInquiriesCsv(inquiries.results || [], showings.results || []);
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="listing-${id}-leads.csv"`,
      },
    });
  }

  // POST /api/listings/:id/checkout — Stripe Checkout Session
  const checkoutMatch = path.match(/^\/api\/listings\/([^/]+)\/checkout$/);
  if (method === "POST" && checkoutMatch) {
    const id = checkoutMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    if (!env.STRIPE_SECRET_KEY) return bad("Stripe not configured (missing STRIPE_SECRET_KEY)", 503);
    const body = await request.json().catch(() => ({}));
    const plan = (body.plan || listing.plan || "quick").toLowerCase();
    const prices = PLAN_PRICES(env)[plan];
    if (!prices) return bad("invalid plan");
    const session = await createCheckoutSession({
      secretKey: env.STRIPE_SECRET_KEY,
      lineItems: [
        prices.setup ? { price: prices.setup, quantity: 1 } : null,
        prices.monthly ? { price: prices.monthly, quantity: 1 } : null,
      ].filter(Boolean),
      mode: prices.setup ? "subscription" : (prices.monthly ? "subscription" : "payment"),
      customerEmail: listing.contact_email,
      successUrl: `${env.APP_URL || url.origin}/thanks?listing=${id}`,
      cancelUrl: `${env.APP_URL || url.origin}/preview/${id}`,
      metadata: { listing_id: id, plan },
    });
    await env.DB.prepare("UPDATE listings SET plan = ?, stripe_session_id = ?, updated_at = ? WHERE id = ?")
      .bind(plan, session.id, new Date().toISOString(), id).run();
    return json({ url: session.url, id: session.id });
  }

  // POST /api/listings/:id/inquiries
  const inqMatch = path.match(/^\/api\/listings\/([^/]+)\/inquiries$/);
  if (method === "POST" && inqMatch) {
    const id = inqMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    const body = await request.json().catch(() => ({}));
    const inqId = uid(10);
    await env.DB.prepare(`
      INSERT INTO inquiries (id, listing_id, source, prospect_name, prospect_email, prospect_phone, message, preferred_showing, reva_transcript)
      VALUES (?,?,?,?,?,?,?,?,?)
    `).bind(
      inqId, id, body.source || "form",
      body.name || null, body.email || null, body.phone || null,
      body.message || null, body.preferred_showing || null,
      body.reva_transcript ? JSON.stringify(body.reva_transcript).slice(0, 8000) : null,
    ).run();
    const hydrated = hydrateListing(listing);
    ctx.waitUntil(handleLeadNotification(env, hydrated, { kind: "inquiry", payload: { id: inqId, source: body.source || "form", ...body } }));
    return json({ ok: true, id: inqId });
  }

  // POST /api/listings/:id/showings
  const showingMatch = path.match(/^\/api\/listings\/([^/]+)\/showings$/);
  if (method === "POST" && showingMatch) {
    const id = showingMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    const body = await request.json().catch(() => ({}));
    const sId = uid(10);
    await env.DB.prepare(`
      INSERT INTO showings (id, listing_id, prospect_name, prospect_email, prospect_phone, scheduled_for, notes)
      VALUES (?,?,?,?,?,?,?)
    `).bind(
      sId, id,
      body.name || null, body.email || null, body.phone || null,
      body.scheduled_for || null, body.notes || null,
    ).run();
    const hydrated = hydrateListing(listing);
    ctx.waitUntil(handleLeadNotification(env, hydrated, { kind: "showing", payload: { id: sId, source: "form", ...body } }));
    return json({ ok: true, id: sId });
  }

  // POST /api/reva/:listingId — chatbot turn
  const revaMatch = path.match(/^\/api\/reva\/([^/]+)$/);
  if (method === "POST" && revaMatch) {
    const id = revaMatch[1];
    const listing = await getListing(env, id);
    if (!listing) return bad("not found", 404);
    const { messages = [] } = await request.json().catch(() => ({}));
    const reply = await revaTurn({
      listing: hydrateListing(listing),
      messages,
      apiKey: env.ANTHROPIC_API_KEY,
    });
    return json(reply);
  }

  // POST /api/stripe/webhook
  if (method === "POST" && path === "/api/stripe/webhook") {
    const sig = request.headers.get("stripe-signature");
    const raw = await request.text();
    if (env.STRIPE_WEBHOOK_SECRET) {
      const ok = await verifyStripeSignature(raw, sig, env.STRIPE_WEBHOOK_SECRET);
      if (!ok) return bad("invalid signature", 400);
    }
    const event = parseStripeEvent(raw);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const listingId = session.metadata?.listing_id;
      if (listingId) {
        await env.DB.prepare(`
          UPDATE listings
          SET status = 'published',
              published_at = ?,
              stripe_customer_id = ?,
              updated_at = ?
          WHERE id = ?
        `).bind(
          new Date().toISOString(),
          session.customer || null,
          new Date().toISOString(),
          listingId,
        ).run();
      }
    }
    return json({ received: true });
  }

  return bad("not found", 404);
}

// ─────────────────────────────────────────────────────────────────────────────
// Data helpers
// ─────────────────────────────────────────────────────────────────────────────

function sanitizeListing(input) {
  const trim = (s) => (typeof s === "string" ? s.trim() : s);
  const num = (n) => {
    if (n === null || n === undefined || n === "") return null;
    const v = Number(n);
    return Number.isFinite(v) ? v : null;
  };
  return {
    plan: input.plan || null,
    template: input.template || "swft",
    goal: trim(input.goal) || null,
    property_name: trim(input.property_name) || null,
    address_line: trim(input.address_line) || null,
    city: trim(input.city) || null,
    state: trim(input.state) || null,
    zip: trim(input.zip) || null,
    price_cents: input.price_cents != null
      ? num(input.price_cents)
      : (input.price ? Math.round(Number(input.price) * 100) : null),
    price_unit: input.price_unit || "monthly",
    bedrooms: num(input.bedrooms),
    bathrooms: num(input.bathrooms),
    sqft: num(input.sqft),
    property_type: trim(input.property_type) || null,
    description: trim(input.description) || null,
    features: Array.isArray(input.features) ? input.features.map(trim).filter(Boolean) : [],
    features_options: typeof input.features_options === "object" ? input.features_options : {},
    schedule: typeof input.schedule === "object" ? input.schedule : {},
    contact_name: trim(input.contact_name) || null,
    contact_email: trim(input.contact_email) || null,
    contact_phone: trim(input.contact_phone) || null,
    images: Array.isArray(input.images) ? input.images : [],
    files: Array.isArray(input.files) ? input.files : [],
    intake_options: sanitizeIntakeOptions(input.intake_options),
  };
}

function sanitizeIntakeOptions(raw) {
  if (!raw || typeof raw !== "object") return {};
  const o = raw;
  return {
    showing_management: o.showing_management || "self",
    listing_management: o.listing_management || "self",
    inquiry_delivery: o.inquiry_delivery || "email",
    point_person: o.point_person && typeof o.point_person === "object"
      ? {
          name: o.point_person.name || "",
          email: o.point_person.email || "",
          phone: o.point_person.phone || "",
          role: o.point_person.role || "",
        }
      : null,
  };
}

function hydrateListing(row) {
  return {
    ...row,
    features: safeJSON(row.features_json, []) || [],
    features_options: safeJSON(row.features_options_json, {}) || {},
    schedule: safeJSON(row.schedule_json, {}) || {},
    images: safeJSON(row.images_json, []) || [],
    files: safeJSON(row.files_json, []) || [],
    intake_options: safeJSON(row.intake_options_json, {}) || {},
  };
}

async function ensureListingDescription(env, listing, ctx) {
  if (listing.description && listing.description.trim()) return listing;
  const hydrated = hydrateListing(listing);
  const text = await generateListingDescription(hydrated, env.ANTHROPIC_API_KEY);
  const desc = text || buildDescriptionFallback(hydrated);
  ctx.waitUntil(
    env.DB.prepare("UPDATE listings SET description = ?, updated_at = ? WHERE id = ?")
      .bind(desc, new Date().toISOString(), listing.id).run()
  );
  return { ...listing, description: desc };
}

function buildInquiriesCsv(inquiries, showings) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["type", "id", "created_at", "name", "email", "phone", "message", "preferred_time", "source"].join(","),
  ];
  for (const i of inquiries) {
    rows.push(
      ["inquiry", i.id, i.created_at, i.prospect_name, i.prospect_email, i.prospect_phone, i.message, i.preferred_showing, i.source]
        .map(esc).join(",")
    );
  }
  for (const s of showings) {
    rows.push(
      ["showing", s.id, s.created_at, s.prospect_name, s.prospect_email, s.prospect_phone, s.notes, s.scheduled_for, "form"]
        .map(esc).join(",")
    );
  }
  return rows.join("\n");
}

async function handleLeadNotification(env, listing, evt) {
  await syncInquiryToAirtable(env, listing, evt);
  if (shouldEmailOwner(listing)) {
    await notifyLandlord(env, listing, evt);
  } else if (env.RESEND_API_KEY && env.ADMIN_EMAIL) {
    await notifyLandlord(env, { ...listing, contact_email: env.ADMIN_EMAIL }, evt);
  }
}

function publicListing(row) {
  const h = hydrateListing(row);
  // Strip secrets from public view
  const { edit_token, ...safe } = h;
  return safe;
}

async function notifyLandlord(env, listing, evt) {
  if (!env.RESEND_API_KEY) {
    console.log("New", evt.kind, "for listing", listing.id, evt.payload);
    return;
  }
  const hydrated = hydrateListing(listing);
  const to = getNotificationEmail(hydrated) || env.ADMIN_EMAIL;
  if (!to) return;
  const subject = evt.kind === "showing"
    ? `New showing request — ${listing.property_name || listing.address_line}`
    : `New inquiry — ${listing.property_name || listing.address_line}`;
  const lines = [
    `<h2>${subject}</h2>`,
    `<p><b>Name:</b> ${evt.payload.name || "—"}</p>`,
    `<p><b>Email:</b> ${evt.payload.email || "—"}</p>`,
    `<p><b>Phone:</b> ${evt.payload.phone || "—"}</p>`,
    evt.payload.preferred_showing ? `<p><b>Preferred showing:</b> ${evt.payload.preferred_showing}</p>` : "",
    evt.payload.scheduled_for ? `<p><b>Requested time:</b> ${evt.payload.scheduled_for}</p>` : "",
    evt.payload.message ? `<p><b>Message:</b><br>${(evt.payload.message + "").replace(/\n/g, "<br>")}</p>` : "",
    `<hr><p>Listing dashboard: ${env.APP_URL}/dashboard/${listing.id}?t=${listing.edit_token}</p>`,
  ].filter(Boolean).join("\n");
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "ListFast <hello@listfast.co>",
        to: [to],
        bcc: env.ADMIN_EMAIL ? [env.ADMIN_EMAIL] : undefined,
        subject,
        html: lines,
      }),
    });
  } catch (e) {
    console.error("notify error", e);
  }
}
