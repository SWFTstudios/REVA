import { getAllDemoListings } from "../data/demo-listings.js";
import {
  renderPropertyCard,
  renderSwftFooter,
  renderSwftNav,
  renderSwftPage,
} from "./swft-theme.js";

export function renderSwftProperties({ appUrl }) {
  const listings = getAllDemoListings();
  const cards = listings.map((l) => renderPropertyCard(l)).join("");

  const body = /* html */ `
${renderSwftNav({ active: "properties", appUrl })}
<section class="property-section" style="padding-top: 120px;">
  <div class="container">
    <div class="title-wrap">
      <div class="title-line"></div>
      <h2>All properties</h2>
      <p class="paragraph-large" style="margin-top:12px;">Browse sales, rentals, and recently closed homes across Greater Boston.</p>
    </div>
    <div class="filter-block">
      <div class="filter-row">
        <label for="filterStatus">Status</label>
        <select id="filterStatus">
          <option value="">All</option>
          <option value="for_sale">For Sale</option>
          <option value="sold">Sold</option>
          <option value="for_rent">For Rent</option>
          <option value="rented">Rented</option>
        </select>
        <label for="filterType">Type</label>
        <select id="filterType">
          <option value="">All types</option>
          <option value="Apartment">Apartment</option>
          <option value="Condo">Condo</option>
          <option value="Loft">Loft</option>
          <option value="Duplex">Duplex</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Studio">Studio</option>
          <option value="Single Family">Single Family</option>
          <option value="Penthouse">Penthouse</option>
        </select>
        <button type="button" class="filter-reset" id="filterReset">Reset filters</button>
      </div>
    </div>
    <div class="property-grid" id="propertyGrid">${cards}</div>
    <p id="filterEmpty" style="display:none;text-align:center;padding:48px;color:#666;">No properties match your filters.</p>
  </div>
</section>
${renderSwftFooter()}
`;

  return renderSwftPage({
    title: "Properties — SWFT Real Estate",
    description: "Browse Boston-area homes for sale, rent, sold, and rented listings.",
    body,
    appUrl,
    extraScript: propertiesFilterScript(listings),
  });
}

function propertiesFilterScript(listings) {
  const data = JSON.stringify(
    listings.map((l) => ({
      slug: l.slug,
      marketStatus: l.marketStatus,
      propertyType: l.propertyType,
    }))
  );
  return /* js */ `
const listingMeta = ${data};
const cards = document.querySelectorAll("#propertyGrid .property-card");

function applyFilters() {
  const status = document.getElementById("filterStatus")?.value || "";
  const type = document.getElementById("filterType")?.value || "";
  let visible = 0;
  cards.forEach((card, i) => {
    const m = listingMeta[i];
    if (!m) return;
    const okStatus = !status || m.marketStatus === status;
    const okType = !type || m.propertyType === type;
    const show = okStatus && okType;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  document.getElementById("filterEmpty").style.display = visible ? "none" : "block";
}

document.getElementById("filterStatus")?.addEventListener("change", applyFilters);
document.getElementById("filterType")?.addEventListener("change", applyFilters);
document.getElementById("filterReset")?.addEventListener("click", () => {
  document.getElementById("filterStatus").value = "";
  document.getElementById("filterType").value = "";
  applyFilters();
});
`;
}
