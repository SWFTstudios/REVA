// Property page template — the actual hosted listing.
// Includes the REVA AI chat widget as a floating dock.

import { layout, escapeHtml as esc } from "./layout.js";
import {
  assetUrl,
  renderStatusBadge,
  renderSwftFooter,
  renderSwftNav,
  swftCss,
} from "./swft-theme.js";
import { buildDescriptionFallback } from "../description.js";
import { lightboxCss, lightboxScript, renderLightboxHtml } from "./lightbox.js";

export function renderPreview({ listing, appUrl, isOwner, editToken }) {
  const l = listing;
  const fullAddress = [l.address_line, l.city, l.state, l.zip].filter(Boolean).join(", ");
  const price = l.price_cents
    ? "$" + Number(l.price_cents / 100).toLocaleString() + priceUnitSuffix(l.price_unit)
    : "Inquire";
  const images = (l.images || []).filter((im) => im && im.url);
  const mainImg = images[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80";
  const thumbImgs = images.slice(1);
  const mosaicThumbs = thumbImgs.slice(0, 4);
  const goalLabel = goalToLabel(l.goal);
  const marketStatus = goalToMarketStatus(l.goal);
  const isPublished = l.status === "published";
  const isDraft = !isPublished;
  const desc = l.description || buildDescriptionFallback(l);
  const opts = l.intake_options || {};
  const showScheduleBtn = opts.showing_management !== "swft";
  const showingContact =
    opts.showing_management === "swft"
      ? "Showings are coordinated by SWFT Studios — use the contact form below."
      : opts.showing_management === "point_person" && opts.point_person?.name
        ? `Showings handled by ${opts.point_person.name}${opts.point_person.email ? ` (${opts.point_person.email})` : ""}.`
        : null;
  const filesHtml = (l.files || []).length
    ? (l.files || [])
        .map(
          (f) =>
            `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.name || "Document")}</a> <span class="file-meta">${f.size ? Math.round(f.size / 1024) + " KB" : ""}</span></li>`
        )
        .join("")
    : "";
  const amenities = (l.features || []).map((a) => `<div class="amenity-item">${esc(a)}</div>`).join("");

  const body = /* html */ `
${renderSwftNav({ appUrl })}
${isOwner ? renderOwnerBar(l, editToken, isPublished) : ""}
${isDraft ? '<div class="preview-draft-banner">Preview — not published yet. Only you can see this link.</div>' : ""}

<div class="header-dark">
  <div class="property-title-wrap container">
    <div>
      <div style="margin-bottom:12px;">${renderStatusBadge(marketStatus)} ${isDraft ? '<span class="pill pill-draft" style="margin-left:8px;">Draft</span>' : '<span class="pill pill-live" style="margin-left:8px;">Live</span>'}</div>
      <div class="property-detail-text">${esc(l.property_name || fullAddress || "Property")}</div>
      <div class="property-text-light">${esc(fullAddress || "—")} · ${esc(price)}</div>
    </div>
    <div>
      <div class="property-detail-text">${esc(l.property_type || goalLabel.full)}</div>
      <div class="property-text-light">${l.bedrooms ?? "?"} bed · ${l.bathrooms ?? "?"} bath · ${l.sqft ? Number(l.sqft).toLocaleString() + " sqft" : "—"}</div>
    </div>
  </div>
</div>

<div class="property-detail preview-page">
  <div class="detail-gallery container" id="gallery" data-lightbox-group="preview-photos">
    <div class="detail-gallery-main">
      <img src="${esc(mainImg)}" alt="${esc(l.property_name || "")}" loading="eager"
        data-lightbox-group="preview-photos" data-lightbox-src="${esc(mainImg)}" data-lightbox-alt="${esc(l.property_name || "")}" />
    </div>
    <div class="detail-gallery-thumbs">
      ${mosaicThumbs.map((im) => `<img src="${esc(im.url)}" alt="" loading="lazy" data-lightbox-group="preview-photos" data-lightbox-src="${esc(im.url)}" />`).join("")}
      ${thumbImgs.slice(4).map((im) => `<img src="${esc(im.url)}" alt="" class="lightbox-extra" hidden data-lightbox-group="preview-photos" data-lightbox-src="${esc(im.url)}" />`).join("")}
      ${images.length === 0 ? '<p class="gallery-empty-inline">Add photos from your dashboard after publishing.</p>' : ""}
    </div>
  </div>

  <div class="white-block container" id="details">
    <h5>Details</h5>
    <div class="room-features">
      <div class="feature"><img src="${assetUrl("images/Bed.svg")}" alt="" class="feature-icon" />${l.bedrooms ?? "—"} bed</div>
      <div class="feature centre-lines"><img src="${assetUrl("images/Shower.svg")}" alt="" class="feature-icon" />${l.bathrooms ?? "—"} bath</div>
      <div class="feature"><img src="${assetUrl("images/Size.svg")}" alt="" class="feature-icon" />${l.sqft ? Number(l.sqft).toLocaleString() + " sqft" : "—"}</div>
      <div class="feature centre-lines"><img src="${assetUrl("images/Garage.svg")}" alt="" class="feature-icon" />${esc(goalLabel.full)}</div>
    </div>
  </div>

  <div class="white-block container">
    <h5>About this property</h5>
    <p class="detail-desc">${esc(desc)}</p>
  </div>

  ${amenities ? `<div class="white-block container" id="features"><h5>Features &amp; amenities</h5><div class="amenities-grid">${amenities}</div></div>` : ""}

  ${filesHtml ? `<div class="white-block container" id="documents"><h5>Documents</h5><ul class="doc-list">${filesHtml}</ul></div>` : ""}

  <div class="white-block container" id="schedule">
    <h5>Showings</h5>
    ${showingContact ? `<p class="detail-desc">${esc(showingContact)}</p>` : ""}
    ${(l.schedule && (l.schedule.days || []).length) ? `<p><b>Days:</b> ${(l.schedule.days || []).map(esc).join(" · ")}</p>` : ""}
    ${l.schedule?.window ? `<p><b>Hours:</b> ${esc(l.schedule.window)}</p>` : ""}
    ${l.schedule?.notes ? `<p><b>Notes:</b> ${esc(l.schedule.notes)}</p>` : ""}
    ${showScheduleBtn ? `<button type="button" class="button-dark" data-open-schedule style="margin-top:16px;">${esc(goalLabel.cta)} →</button>` : ""}
  </div>

  <div class="white-block container contact-inquiry-section" id="contact">
    <div class="contact-inquiry-grid">
      <div>
        <h5>Inquire about this property</h5>
        <p class="detail-desc">Send a message to ${esc(l.contact_name || "the listing contact")}, or chat with REVA for instant answers and showing requests.</p>
        <button type="button" class="button-outline" data-open-reva style="margin-top:12px;">Ask REVA →</button>
      </div>
      <form class="contact-form inquiry-form" id="inquiryForm">
        <input type="text" name="name" placeholder="Your name" required />
        <input type="email" name="email" placeholder="Email *" required />
        <input type="tel" name="phone" placeholder="Phone (optional)" />
        <textarea name="message" rows="4" placeholder="When are you available? Questions?"></textarea>
        <button type="submit" class="button-dark">Send inquiry</button>
        <div class="form-status" id="inquiryStatus"></div>
      </form>
    </div>
  </div>
</div>

<!-- Showing modal -->
<div class="modal" id="scheduleModal" aria-hidden="true">
  <div class="modal-backdrop" data-close-modal></div>
  <div class="modal-card">
    <button class="modal-close" data-close-modal>×</button>
    <h3>Request a showing</h3>
    <p>${(l.schedule && l.schedule.window) ? esc("Showings: " + (l.schedule.window || "")) : "Pick a time that works — we'll confirm."}</p>
    <form id="showingForm">
      <div class="form-row"><label>Your name</label><input type="text" name="name" required /></div>
      <div class="form-row"><label>Email</label><input type="email" name="email" required /></div>
      <div class="form-row"><label>Phone</label><input type="tel" name="phone" /></div>
      <div class="form-row">
        <label>Preferred time</label>
        <input type="text" name="scheduled_for" placeholder="e.g. Sat May 30, 2 PM" required />
      </div>
      <div class="form-row"><label>Notes <span class="hint">— optional</span></label><textarea name="notes" placeholder="Anything else we should know?"></textarea></div>
      <button type="submit" class="btn btn-dark btn-block btn-lg">Request showing</button>
      <div class="form-status" id="showingStatus"></div>
    </form>
  </div>
</div>

${renderSwftFooter()}
${renderLightboxHtml()}

<!-- REVA chat dock -->
<div class="reva-dock" id="revaDock">
  <button class="reva-fab" id="revaFab" aria-label="Chat with REVA">
    <span class="reva-fab-pulse"></span>
    <span class="reva-fab-icon">💬</span>
    <span class="reva-fab-label">Ask REVA</span>
  </button>
  <div class="reva-panel" id="revaPanel" aria-hidden="true">
    <div class="reva-head">
      <div>
        <div class="reva-name"><span class="reva-status-dot"></span> REVA</div>
        <div class="reva-sub">AI assistant · ${esc(l.property_name || "this listing")}</div>
      </div>
      <button class="reva-close" id="revaClose" aria-label="Close">×</button>
    </div>
    <div class="reva-body" id="revaBody">
      <div class="reva-msg reva-msg-bot">Hi! I'm REVA. I can answer questions about ${esc(l.property_name || "this property")}, share availability, or book you a showing. What would you like to know?</div>
    </div>
    <form class="reva-input" id="revaForm">
      <input type="text" id="revaInput" placeholder="Ask anything…" autocomplete="off" />
      <button type="submit" class="btn btn-dark">Send</button>
    </form>
  </div>
</div>
  `;

  return layout({
    title: `${l.property_name || fullAddress || "Property listing"} · SWFT`,
    description: l.description ? l.description.slice(0, 160) : `${fullAddress} — ${price}`,
    body,
    appUrl,
    bodyClass: "swft-body",
    extraHead: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />`,
    extraCss: swftCss() + previewCss() + lightboxCss(),
    extraScript: previewScript({ listingId: l.id }) + lightboxScript(),
  });
}

function renderOwnerBar(l, editToken, isPublished) {
  return /* html */ `
<div class="owner-bar">
  <div class="owner-bar-left">
    <b>Owner view</b>
    <span class="owner-bar-sep">·</span>
    <span>${isPublished ? "Published" : "Draft — not visible to the public yet"}</span>
  </div>
  <div class="owner-bar-right">
    <a class="btn btn-ghost" href="/dashboard/${l.id}?t=${encodeURIComponent(editToken)}">Dashboard</a>
    <a class="btn btn-ghost" href="/#intake">Edit listing</a>
    ${isPublished ? "" : `<button class="btn btn-accent" id="publishBtn">Publish for $${planBasePrice(l.plan)} →</button>`}
  </div>
</div>
  `;
}

function planBasePrice(plan) {
  if (plan === "pro") return 149;
  if (plan === "portfolio") return 299;
  return 79;
}

function priceUnitSuffix(unit) {
  if (unit === "monthly") return "/mo";
  if (unit === "annual") return "/yr";
  if (unit === "nightly") return "/night";
  return "";
}

function goalToLabel(goal) {
  switch ((goal || "").toLowerCase()) {
    case "sell":     return { full: "For sale",     cta: "Inquire to buy",   priceSub: "asking price" };
    case "sublease": return { full: "Sublease",     cta: "Request showing",  priceSub: "/mo" };
    case "lease":    return { full: "Commercial",   cta: "Inquire to lease", priceSub: "/mo" };
    case "rent":
    default:         return { full: "For rent",     cta: "Request showing",  priceSub: "/mo" };
  }
}

function goalToMarketStatus(goal) {
  if ((goal || "").toLowerCase() === "sell") return "for_sale";
  return "for_rent";
}

// ─── 404 / Thanks ────────────────────────────────────────────────────────────

export function renderNotFound(msg = "Listing not found.") {
  return layout({
    title: "Not found · ListFast",
    body: /* html */ `
      <div style="min-height: 70vh; display: grid; place-items: center; text-align: center; padding: 40px;">
        <div>
          <span class="eyebrow" style="display:block; margin-bottom:14px;">404</span>
          <h1 style="font-family: var(--serif); font-size: clamp(36px, 5vw, 56px); line-height: 1.05; letter-spacing: -0.02em;">${msg}</h1>
          <p style="color: var(--muted); margin: 18px auto 28px; max-width: 460px;">The link may have expired, or this listing isn't published yet.</p>
          <a class="btn btn-dark" href="/">Back to ListFast →</a>
        </div>
      </div>
    `,
    extraCss: `
      .eyebrow { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
      header.nav, .prop-nav { display: none !important; }
    `,
  });
}

export function renderThanks({ listing, appUrl }) {
  const l = listing || {};
  return layout({
    title: "You're live! · ListFast",
    body: /* html */ `
      <div style="min-height: 80vh; display: grid; place-items: center; text-align: center; padding: 60px 24px;">
        <div style="max-width: 560px;">
          <span class="eyebrow" style="display:block; margin-bottom:14px; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); font-weight: 600;">Payment received</span>
          <h1 style="font-family: var(--serif); font-size: clamp(36px, 5vw, 60px); line-height: 1.05; letter-spacing: -0.02em;">You're live — congrats.</h1>
          <p style="color: var(--muted); margin: 22px auto 28px; font-size: 18px; line-height: 1.55;">
            ${l.property_name ? esc(l.property_name) : "Your listing"} is now published. We've emailed you the live link and your dashboard URL.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            ${l.id ? `<a class="btn btn-dark btn-lg" href="/preview/${l.id}">View live listing →</a>` : ""}
            ${l.id ? `<a class="btn btn-ghost btn-lg" href="/dashboard/${l.id}?t=${encodeURIComponent(l.edit_token || "")}">Open dashboard</a>` : ""}
          </div>
          <p style="color: var(--muted); margin-top: 36px; font-size: 13px;">REVA is now answering inquiries 24/7 on your page.</p>
        </div>
      </div>
    `,
    appUrl,
  });
}

// ─── Styles ──────────────────────────────────────────────────────────────────

function previewCss() {
  return /* css */ `
.preview-draft-banner { background: #fff3cd; color: #664d03; text-align: center; padding: 10px 16px; font-size: 14px; font-weight: 600; }
.preview-page { padding-bottom: 48px; }
.gallery-empty-inline { font-size: 14px; color: #666; padding: 12px; }
.doc-list { list-style: none; padding: 0; margin: 0; }
.doc-list li { padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08); display: flex; justify-content: space-between; gap: 12px; }
.doc-list a { color: var(--orange, #b371ad); font-weight: 600; }
.file-meta { color: #888; font-size: 13px; }
.contact-inquiry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
.contact-inquiry-section .inquiry-form input,
.contact-inquiry-section .inquiry-form textarea { width: 100%; padding: 12px; border: 1px solid rgba(0,0,0,0.12); border-radius: 8px; margin-bottom: 12px; font: inherit; }
@media (max-width: 768px) { .contact-inquiry-grid { grid-template-columns: 1fr; } }
.pill { display:inline-block; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding: 6px 12px; border-radius: 999px; }
.pill-draft { background: #fff3cd; color: #664d03; }
.pill-live { background: rgba(33,195,116,0.18); color: #126b3f; }

.owner-bar { position: sticky; top: 0; z-index: 60; background: var(--ink); color: var(--paper); padding: 10px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; flex-wrap: wrap; }
.owner-bar b { color: var(--accent); }
.owner-bar-sep { color: rgba(252,251,248,0.4); margin: 0 6px; }
.owner-bar-right { display: flex; gap: 8px; }
.owner-bar .btn-ghost { color: var(--paper); border-color: rgba(252,251,248,0.2); }
.owner-bar .btn-ghost:hover { background: rgba(252,251,248,0.08); }

.prop-nav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: rgba(252,251,248,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); }
.owner-bar + .prop-nav { top: 44px; }
.prop-nav .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; text-decoration: none; color: var(--ink); font-size: 16px; }
.brand-mark { width: 24px; height: 24px; border-radius: 7px; background: var(--ink); position: relative; }
.brand-mark::after { content:""; position:absolute; inset:6px; border-radius:3px; background: var(--accent); }
.prop-nav-links { display: flex; gap: 28px; }
.prop-nav-links a { color: var(--muted); text-decoration: none; font-size: 14px; font-weight: 500; }
.prop-nav-links a:hover { color: var(--ink); }
@media (max-width: 800px) { .prop-nav-links { display: none; } .prop-nav { padding: 14px 20px; } }

.prop-hero { position: relative; height: 78vh; min-height: 560px; display: grid; place-items: center; color: var(--paper); overflow: hidden; }
.prop-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.prop-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 100%); }
.prop-hero-inner { position: relative; max-width: 1080px; padding: 0 32px; text-align: center; }
.prop-hero-inner h1 { font-family: var(--serif); font-size: clamp(40px, 6vw, 84px); line-height: 1.02; letter-spacing: -0.02em; margin: 18px 0 14px; }
.prop-address { font-size: 18px; opacity: 0.9; margin-bottom: 36px; }
.prop-hero-meta { display: inline-grid; grid-template-columns: repeat(4, 1fr); gap: 40px; padding: 22px 36px; background: rgba(252,251,248,0.1); backdrop-filter: blur(8px); border-radius: 14px; border: 1px solid rgba(252,251,248,0.15); }
.prop-hero-meta > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.prop-hero-meta b { font-family: var(--serif); font-size: 26px; }
.prop-hero-meta span { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
@media (max-width: 700px) { .prop-hero-meta { grid-template-columns: repeat(2, 1fr); gap: 18px; padding: 16px 22px; } }

.prop-section { max-width: 1180px; margin: 0 auto; padding: 96px 32px; }
@media (max-width: 700px) { .prop-section { padding: 64px 20px; } }
.prop-section-head { max-width: 640px; margin: 0 auto 48px; text-align: center; }
.prop-section-head h2 { font-family: var(--serif); font-size: clamp(32px, 4vw, 50px); line-height: 1.08; letter-spacing: -0.02em; }

.gallery { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-auto-rows: 220px; gap: 10px; }
.gallery-item { overflow: hidden; border-radius: 8px; background: var(--paper-2); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.gallery-item:hover img { transform: scale(1.04); }
.gallery-item-lead { grid-row: span 2; grid-column: span 1; }
.gallery-empty { padding: 60px 20px; text-align: center; color: var(--muted); border: 1px dashed var(--line); border-radius: 12px; }
@media (max-width: 700px) { .gallery { grid-template-columns: 1fr 1fr; grid-auto-rows: 160px; } .gallery-item-lead { grid-row: span 2; grid-column: span 2; } }

.details-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 56px; align-items: flex-start; }
@media (max-width: 900px) { .details-grid { grid-template-columns: 1fr; } }
.details-main h2 { font-family: var(--serif); font-size: clamp(28px, 3.4vw, 44px); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 18px; }
.prop-desc { font-size: 17px; line-height: 1.65; color: var(--ink-2); white-space: pre-wrap; }
.details-card { background: var(--paper-2); padding: 28px; border-radius: 18px; position: sticky; top: 88px; }
.details-card-head { border-bottom: 1px solid var(--line); padding-bottom: 16px; margin-bottom: 16px; }
.details-card-head b { font-family: var(--serif); font-size: 36px; letter-spacing: -0.01em; }
.details-card-head span { color: var(--muted); font-size: 14px; margin-left: 6px; }
.details-card-list { list-style: none; margin-bottom: 22px; }
.details-card-list li { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid var(--line); }
.details-card-list li:last-child { border-bottom: none; }
.details-card-list span { color: var(--muted); }

.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 24px; }
@media (max-width: 700px) { .features-grid { grid-template-columns: 1fr; } }
.feature { display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: var(--paper-2); border-radius: 10px; font-size: 15px; }
.feature span { color: var(--accent-ink); background: var(--accent); width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; }

.schedule-card { background: var(--paper-2); border-radius: 18px; padding: 28px; display: flex; flex-direction: column; gap: 12px; max-width: 720px; margin: 0 auto; }
.schedule-card div b { font-family: var(--serif); margin-right: 8px; }
.schedule-card .btn { margin-top: 12px; align-self: flex-start; }

.contact-section { background: var(--ink); color: var(--paper); border-radius: 28px; max-width: none; padding: 88px 40px; }
.contact-section .eyebrow { color: var(--accent); }
.contact-section h2 { font-family: var(--serif); font-size: clamp(32px, 4vw, 48px); line-height: 1.08; letter-spacing: -0.02em; }
.contact-section .prop-desc { color: rgba(252,251,248,0.7); }
.contact-grid { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: flex-start; }
@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }
.contact-form input, .contact-form textarea { background: rgba(252,251,248,0.06); border-color: rgba(252,251,248,0.15); color: var(--paper); }
.contact-form input::placeholder, .contact-form textarea::placeholder { color: rgba(252,251,248,0.4); }
.contact-form label { color: rgba(252,251,248,0.85); }
.form-status { margin-top: 12px; font-size: 13px; color: rgba(252,251,248,0.75); min-height: 18px; }

.prop-foot { max-width: 1180px; margin: 0 auto; padding: 56px 32px 80px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 18px; }
.prop-foot .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; }
.prop-foot-tag { color: var(--muted); font-size: 13px; margin-top: 4px; }
.prop-foot-tag a { color: var(--ink); }
.prop-foot-meta { display: flex; gap: 18px; align-items: center; font-size: 14px; color: var(--muted); }
.prop-foot-meta a { color: var(--ink); text-decoration: none; }

/* Modal */
.modal { position: fixed; inset: 0; z-index: 80; display: none; align-items: center; justify-content: center; padding: 24px; }
.modal.open { display: flex; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
.modal-card { position: relative; background: var(--paper); border-radius: 20px; padding: 36px 32px; max-width: 480px; width: 100%; max-height: 90vh; overflow: auto; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.4); }
.modal-card h3 { font-family: var(--serif); font-size: 28px; margin-bottom: 8px; }
.modal-card p { color: var(--muted); margin-bottom: 18px; font-size: 14px; }
.modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--muted); line-height: 1; }

/* REVA chat dock */
.reva-dock { position: fixed; bottom: 24px; right: 24px; z-index: 70; }
.reva-fab { display: flex; align-items: center; gap: 10px; background: var(--ink); color: var(--paper); border: none; padding: 14px 22px; border-radius: 999px; cursor: pointer; box-shadow: 0 12px 36px rgba(0,0,0,0.25); font-weight: 600; font-size: 14px; position: relative; }
.reva-fab:hover { transform: translateY(-2px); }
.reva-fab-pulse { position: absolute; top: 14px; right: 14px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 0 rgba(233,196,106,0.6); animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(233,196,106,0.6); } 70% { box-shadow: 0 0 0 10px rgba(233,196,106,0); } 100% { box-shadow: 0 0 0 0 rgba(233,196,106,0); } }
.reva-fab-icon { font-size: 18px; }
.reva-panel { position: absolute; bottom: 70px; right: 0; width: 380px; max-width: calc(100vw - 32px); max-height: 600px; background: var(--paper); border-radius: 18px; box-shadow: 0 30px 80px -10px rgba(0,0,0,0.35); display: none; flex-direction: column; overflow: hidden; }
.reva-panel.open { display: flex; }
.reva-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; background: var(--ink); color: var(--paper); }
.reva-name { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; }
.reva-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #21c374; box-shadow: 0 0 0 4px rgba(33,195,116,0.2); }
.reva-sub { font-size: 12px; opacity: 0.65; margin-top: 2px; }
.reva-close { background: none; border: none; color: var(--paper); font-size: 22px; cursor: pointer; opacity: 0.7; }
.reva-body { padding: 16px; flex: 1; overflow: auto; max-height: 380px; display: flex; flex-direction: column; gap: 10px; }
.reva-msg { padding: 11px 14px; border-radius: 14px; font-size: 14px; line-height: 1.5; max-width: 85%; }
.reva-msg-bot { background: rgba(20,20,20,0.06); align-self: flex-start; border-bottom-left-radius: 4px; }
.reva-msg-user { background: var(--ink); color: var(--paper); align-self: flex-end; border-bottom-right-radius: 4px; }
.reva-typing { display: inline-flex; gap: 4px; padding: 11px 14px; background: rgba(20,20,20,0.06); border-radius: 14px; align-self: flex-start; }
.reva-typing span { width: 6px; height: 6px; border-radius: 50%; background: rgba(20,20,20,0.4); animation: typingDot 1.2s infinite; }
.reva-typing span:nth-child(2) { animation-delay: 0.2s; } .reva-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-3px); opacity: 1; } }
.reva-input { display: flex; gap: 6px; padding: 12px; border-top: 1px solid var(--line); }
.reva-input input { flex: 1; padding: 10px 12px; border: 1px solid var(--line); border-radius: 999px; font: inherit; }
.reva-input input:focus { outline: none; border-color: var(--ink); }
.reva-input button { padding: 10px 18px; font-size: 13px; }
@media (max-width: 460px) { .reva-panel { width: calc(100vw - 32px); right: 0; } .reva-fab-label { display: none; } }
  `;
}

function previewScript({ listingId }) {
  return /* js */ `
const listingId = ${JSON.stringify(listingId)};
const $ = (s) => document.querySelector(s);

// ── Modal ──────────────────────────────────────────────────────────────────
const modal = $("#scheduleModal");
document.querySelectorAll("[data-open-schedule]").forEach(b => b.addEventListener("click", () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}));
document.querySelectorAll("[data-close-modal]").forEach(b => b.addEventListener("click", () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}));

// ── Inquiry form ───────────────────────────────────────────────────────────
const inquiryForm = $("#inquiryForm");
inquiryForm && inquiryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(inquiryForm);
  const status = $("#inquiryStatus");
  status.textContent = "Sending…";
  const r = await fetch("/api/listings/" + listingId + "/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(Object.fromEntries(fd.entries())),
  });
  if (r.ok) { status.textContent = "Got it — we'll be in touch soon."; inquiryForm.reset(); }
  else { status.textContent = "Couldn't send — try again or use REVA chat."; }
});

// ── Showing form ───────────────────────────────────────────────────────────
const showingForm = $("#showingForm");
showingForm && showingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(showingForm);
  const status = $("#showingStatus");
  status.textContent = "Sending…";
  const r = await fetch("/api/listings/" + listingId + "/showings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(Object.fromEntries(fd.entries())),
  });
  if (r.ok) { status.textContent = "Got it — confirmation coming."; showingForm.reset(); setTimeout(() => modal.classList.remove("open"), 1500); }
  else { status.textContent = "Couldn't send — please try again."; }
});

// ── REVA chat ──────────────────────────────────────────────────────────────
const revaFab = $("#revaFab");
const revaPanel = $("#revaPanel");
const revaClose = $("#revaClose");
const revaBody = $("#revaBody");
const revaForm = $("#revaForm");
const revaInput = $("#revaInput");
const revaHistory = []; // {role, content}

revaFab.addEventListener("click", () => {
  const open = revaPanel.classList.toggle("open");
  revaPanel.setAttribute("aria-hidden", open ? "false" : "true");
  if (open) setTimeout(() => revaInput.focus(), 100);
});
revaClose.addEventListener("click", () => {
  revaPanel.classList.remove("open");
  revaPanel.setAttribute("aria-hidden", "true");
});
document.querySelectorAll("[data-open-reva]").forEach(b => b.addEventListener("click", () => {
  revaPanel.classList.add("open"); revaPanel.setAttribute("aria-hidden","false"); setTimeout(()=>revaInput.focus(), 100);
}));

function addRevaMsg(role, text) {
  const el = document.createElement("div");
  el.className = "reva-msg reva-msg-" + (role === "user" ? "user" : "bot");
  el.textContent = text;
  revaBody.appendChild(el);
  revaBody.scrollTop = revaBody.scrollHeight;
}

function addTyping() {
  const el = document.createElement("div");
  el.className = "reva-typing";
  el.id = "revaTyping";
  el.innerHTML = "<span></span><span></span><span></span>";
  revaBody.appendChild(el);
  revaBody.scrollTop = revaBody.scrollHeight;
}

revaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = revaInput.value.trim();
  if (!msg) return;
  revaInput.value = "";
  addRevaMsg("user", msg);
  revaHistory.push({ role: "user", content: msg });
  addTyping();
  try {
    const r = await fetch("/api/reva/" + listingId, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: revaHistory }),
    });
    document.getElementById("revaTyping")?.remove();
    const j = await r.json();
    const reply = j.reply || "Hmm — I had trouble there. Try asking again?";
    addRevaMsg("bot", reply);
    revaHistory.push({ role: "assistant", content: reply });

    // Heuristic: if REVA seems to have taken contact info, log an inquiry
    const looksLikeContact = /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b/.test(msg) || /\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}/.test(msg);
    if (looksLikeContact) {
      fetch("/api/listings/" + listingId + "/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "reva",
          message: msg,
          reva_transcript: revaHistory.slice(-10),
        }),
      });
    }
  } catch (err) {
    document.getElementById("revaTyping")?.remove();
    addRevaMsg("bot", "Sorry — I had trouble reaching the server. Try again?");
  }
});

// ── Publish button (owner only) ────────────────────────────────────────────
const publishBtn = document.getElementById("publishBtn");
publishBtn && publishBtn.addEventListener("click", async () => {
  publishBtn.disabled = true;
  publishBtn.textContent = "Opening checkout…";
  const r = await fetch("/api/listings/" + listingId + "/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!r.ok) {
    const err = await r.json().catch(()=>({}));
    publishBtn.textContent = "Couldn't start checkout";
    alert(err.error || "Checkout error — please try again.");
    publishBtn.disabled = false;
    return;
  }
  const j = await r.json();
  if (j.url) location.href = j.url;
});
  `;
}
