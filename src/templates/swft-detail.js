import { getDemoBySlug, getSimilarListings } from "../data/demo-listings.js";
import {
  assetUrl,
  formatPrice,
  renderPropertyCard,
  renderStatusBadge,
  renderSwftFooter,
  renderSwftNav,
  renderSwftPage,
} from "./swft-theme.js";
import { escapeHtml as esc } from "./layout.js";

export function renderSwftDetail({ listing, appUrl }) {
  const images = listing.images?.length ? listing.images : [listing.image];
  const mainImg = esc(images[0]);
  const thumbs = images.slice(1, 5);
  const similar = getSimilarListings(listing.slug, 3);
  const similarHtml = similar.map((l) => renderPropertyCard(l)).join("");
  const amenities = (listing.amenities || [])
    .map((a) => `<div class="amenity-item">${esc(a)}</div>`)
    .join("");

  const body = /* html */ `
${renderSwftNav({ active: "properties", appUrl })}
<div class="header-dark">
  <div class="property-title-wrap container">
    <div>
      <div style="margin-bottom:12px;">${renderStatusBadge(listing.marketStatus)}</div>
      <div class="property-detail-text">${esc(listing.title)}</div>
      <div class="property-text-light">${esc(listing.city)}, ${esc(listing.state)} ${esc(listing.zip || "")} · ${formatPrice(listing)}</div>
    </div>
    <div>
      <div class="property-detail-text">${esc(listing.propertyType || "Property")}</div>
      <div class="property-text-light">${listing.bedrooms} bed · ${listing.bathrooms} bath · ${listing.sqft ? Number(listing.sqft).toLocaleString() + " sqft" : "—"}</div>
    </div>
  </div>
</div>

<div class="property-detail">
  <div class="detail-gallery container">
    <div class="detail-gallery-main"><img src="${mainImg}" alt="${esc(listing.title)}" /></div>
    <div class="detail-gallery-thumbs">
      ${thumbs.map((u) => `<img src="${esc(u)}" alt="" loading="lazy" />`).join("")}
    </div>
  </div>

  <div class="white-block container">
    <h5>Details</h5>
    <div class="room-features">
      <div class="feature"><img src="${assetUrl("images/Bed.svg")}" alt="" class="feature-icon" />${listing.bedrooms} bed</div>
      <div class="feature centre-lines"><img src="${assetUrl("images/Shower.svg")}" alt="" class="feature-icon" />${listing.bathrooms} bath</div>
      <div class="feature"><img src="${assetUrl("images/Size.svg")}" alt="" class="feature-icon" />${listing.sqft ? Number(listing.sqft).toLocaleString() + " sqft" : "—"}</div>
      <div class="feature centre-lines"><img src="${assetUrl("images/Garage.svg")}" alt="" class="feature-icon" />${listing.garage != null ? listing.garage + " garage" : "—"}</div>
    </div>
  </div>

  <div class="white-block container">
    <h5>About this property</h5>
    <p class="detail-desc">${esc(listing.description)}</p>
    ${listing.slug === "451-heath-st" ? `<p style="margin-top:20px;"><a href="/onboard?property_name=451+Heath+St&address_line=451+Heath+St&city=Brookline&state=MA&bedrooms=3&bathrooms=2&price=3200&goal=rent" class="button-dark">List a property like this →</a></p>` : ""}
  </div>

  ${
    amenities
      ? `<div class="white-block container"><h5>Amenities</h5><div class="amenities-grid">${amenities}</div></div>`
      : ""
  }

  <div class="white-block container inquiry-form">
    <h5>Request a showing</h5>
    <form id="inquiryForm">
      <input type="text" name="name" placeholder="Your name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="tel" name="phone" placeholder="Phone (optional)" />
      <textarea name="message" rows="4" placeholder="Hello, I am interested in ${esc(listing.title)}…"></textarea>
      <button type="submit" class="button-dark">Send inquiry</button>
    </form>
    <p id="inquiryThanks" style="display:none;margin-top:16px;color:#1b5e20;font-weight:600;">Thanks — we'll be in touch shortly. (Demo form)</p>
  </div>
</div>

<section class="similar-section">
  <div class="container">
    <div class="title-wrap">
      <div class="title-line"></div>
      <h2>Similar listings</h2>
    </div>
    <div class="property-grid">${similarHtml}</div>
  </div>
</section>

${renderSwftFooter()}
`;

  return renderSwftPage({
    title: `${listing.title} — SWFT Real Estate`,
    description: listing.description?.slice(0, 160) || "",
    body,
    appUrl,
    extraScript: /* js */ `
document.getElementById("inquiryForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("inquiryForm").style.display = "none";
  document.getElementById("inquiryThanks").style.display = "block";
});
`,
  });
}

export function renderSwftDetailNotFound() {
  return renderSwftPage({
    title: "Property not found — SWFT Real Estate",
    body: `${renderSwftNav({})}<div class="container" style="padding:120px 24px;text-align:center;"><h2>Property not found</h2><p style="margin:16px 0 24px;"><a href="/properties">Browse all properties</a></p></div>${renderSwftFooter()}`,
  });
}
