// Auto-generate listing descriptions from property data when owner leaves blank.

export function buildDescriptionFallback(listing) {
  const addr = [listing.address_line, listing.city, listing.state].filter(Boolean).join(", ");
  const beds = listing.bedrooms != null ? `${listing.bedrooms} bedroom` : null;
  const baths = listing.bathrooms != null ? `${listing.bathrooms} bathroom` : null;
  const sqft = listing.sqft ? `${Number(listing.sqft).toLocaleString()} sq ft` : null;
  const specs = [beds, baths, sqft].filter(Boolean).join(", ");
  const price = listing.price_cents
    ? `$${(listing.price_cents / 100).toLocaleString()}${listing.price_unit === "monthly" ? " per month" : listing.price_unit === "total" ? "" : ` ${listing.price_unit || ""}`}`
    : null;
  const goal =
    listing.goal === "sell" ? "for sale" : listing.goal === "rent" ? "for rent" : listing.goal || "available";
  const features = (listing.features || []).slice(0, 6).join(", ");
  const photoNote =
    (listing.images || []).length > 0
      ? ` Browse ${listing.images.length} photo${listing.images.length > 1 ? "s" : ""} for a closer look.`
      : "";

  let text = `${listing.property_name || addr || "This property"} is ${goal}`;
  if (listing.property_type) text += ` — a ${listing.property_type.toLowerCase()}`;
  if (specs) text += ` with ${specs}`;
  text += ".";
  if (price) text += ` Listed at ${price}.`;
  if (features) text += ` Highlights include ${features}.`;
  text += photoNote;
  text += " Contact us to schedule a showing or ask any questions.";
  return text;
}

export async function generateListingDescription(listing, apiKey) {
  if (!apiKey) return buildDescriptionFallback(listing);

  const addr = [listing.address_line, listing.city, listing.state, listing.zip].filter(Boolean).join(", ");
  const price = listing.price_cents
    ? `$${(listing.price_cents / 100).toLocaleString()} ${listing.price_unit === "monthly" ? "/ month" : listing.price_unit === "total" ? "asking" : listing.price_unit || ""}`
    : "price on request";
  const features = (listing.features || []).join(", ") || "not specified";
  const imageCount = (listing.images || []).length;

  const prompt = `Write a professional, warm real-estate listing description (2–3 short paragraphs) for this property. Do not invent facts not listed here. No bullet lists.

Property name: ${listing.property_name || "—"}
Address: ${addr || "—"}
Goal: ${listing.goal || "—"}
Type: ${listing.property_type || "—"}
Beds/Baths/Sqft: ${listing.bedrooms ?? "?"} / ${listing.bathrooms ?? "?"} / ${listing.sqft ?? "?"}
Price: ${price}
Features: ${features}
Number of photos uploaded: ${imageCount}
Owner notes: ${listing.description || "(none — write from facts above)"}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return buildDescriptionFallback(listing);
    const data = await res.json();
    const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
    return text || buildDescriptionFallback(listing);
  } catch (e) {
    console.error("description gen error", e);
    return buildDescriptionFallback(listing);
  }
}
