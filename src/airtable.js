// Airtable sync for SWFT-managed listings and inquiries.

function airtableUrl(env, tableName) {
  const base = env.AIRTABLE_BASE_ID || "appx3jGQIAp1lzwW0";
  const table = encodeURIComponent(tableName);
  return `https://api.airtable.com/v0/${base}/${table}`;
}

async function airtablePost(env, tableName, fields) {
  if (!env.AIRTABLE_API_KEY) return { ok: false, reason: "no_api_key" };
  const table = tableName || env.AIRTABLE_TABLE_INQUIRIES || "Inquiries";
  try {
    const res = await fetch(airtableUrl(env, table), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("Airtable error", res.status, t);
      return { ok: false, reason: t };
    }
    return { ok: true, data: await res.json() };
  } catch (e) {
    console.error("Airtable fetch error", e);
    return { ok: false, reason: e.message };
  }
}

export function shouldSyncToAirtable(listing) {
  const opts = listing.intake_options || {};
  return (
    opts.listing_management === "swft" ||
    opts.inquiry_delivery === "airtable"
  );
}

export async function syncInquiryToAirtable(env, listing, evt) {
  if (!shouldSyncToAirtable(listing)) return;
  const p = evt.payload || {};
  await airtablePost(env, env.AIRTABLE_TABLE_INQUIRIES || "Inquiries", {
    listing_id: listing.id,
    property_name: listing.property_name || listing.address_line || "",
    type: evt.kind === "showing" ? "showing" : "inquiry",
    source: p.source || evt.kind,
    prospect_name: p.name || "",
    prospect_email: p.email || "",
    prospect_phone: p.phone || "",
    message: p.message || p.notes || "",
    preferred_showing: p.preferred_showing || p.scheduled_for || "",
    created_at: new Date().toISOString(),
  });
}

export async function syncListingToAirtable(env, listing, appUrl) {
  const opts = listing.intake_options || {};
  if (opts.listing_management !== "swft") return;
  const addr = [listing.address_line, listing.city, listing.state, listing.zip]
    .filter(Boolean)
    .join(", ");
  await airtablePost(env, env.AIRTABLE_TABLE_LISTINGS || "Listings", {
    listing_id: listing.id,
    property_name: listing.property_name || listing.address_line || "",
    address: addr,
    goal: listing.goal || "",
    owner_email: listing.contact_email || "",
    management_mode: opts.listing_management || "",
    preview_url: `${appUrl || ""}/preview/${listing.id}`,
    status: listing.status || "draft",
    created_at: listing.created_at || new Date().toISOString(),
  });
}
