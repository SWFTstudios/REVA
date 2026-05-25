import { getAllDemoListings } from "../data/demo-listings.js";
import {
  assetUrl,
  renderPropertyCard,
  renderSwftFooter,
  renderSwftNav,
  renderSwftPage,
  renderStatusBadge,
} from "./swft-theme.js";
import { escapeHtml as esc } from "./layout.js";
import { lightboxCss, lightboxScript, renderLightboxHtml } from "./lightbox.js";

const FEATURE_CHIPS = [
  "Laundry on site",
  "In-unit laundry",
  "Washer/dryer hookups",
  "Dishwasher",
  "Parking",
  "Garage",
  "Central A/C",
  "Heat included",
  "Pets allowed",
  "Furnished",
  "Hardwood floors",
  "Balcony",
  "Elevator",
  "Doorman",
  "Gym",
  "Pool",
  "Backyard",
  "Fireplace",
  "Roof access",
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80";

export function renderSwftHome({ appUrl }) {
  const listings = getAllDemoListings().slice(0, 6);
  const gridHtml = listings.map((l) => renderPropertyCard(l)).join("");
  const chips = FEATURE_CHIPS.map(
    (f) =>
      `<label class="intake-chip"><input type="checkbox" name="features" value="${esc(f)}" /><span>${esc(f)}</span></label>`
  ).join("");

  const body = /* html */ `
${renderSwftNav({ active: "home", appUrl })}
<div class="notice">
  <div class="notice-wrap">
    <span class="notice-badge">Start here</span>
    <span class="notice-text">Submit your property — preview your full listing page in minutes.</span>
  </div>
</div>
<section class="slider-section">
  <div class="hero-bg hero-bg-2"></div>
  <div class="slider-content container" style="padding-top: 40px;">
    <h1 class="display-heading">List your property SWFTly.</h1>
    <p class="hero-paragraph">Professional listing pages with your photos, details, and inquiry handling — your way or ours. See your live preview before you publish.</p>
  </div>
  <div class="hero-block container">
    <a href="#intake" class="plain-link-wrap">
      <span>Start your listing</span>
      <img src="${assetUrl("images/Arrow-Y.svg")}" alt="" width="20" height="20" />
    </a>
  </div>
</section>

<section class="list-swiftly-section" id="intake">
  <div class="container intake-container">
    <div class="title-wrap">
      <div class="title-line"></div>
      <h2>Start your listing</h2>
      <p class="paragraph-large">Tell us about your property, upload photos and files, and choose how you want showings and inquiries handled.</p>
    </div>
    <div class="intake-layout">
      <div class="intake-main">
        <div class="intake-steps">
          <button type="button" class="intake-step-btn active" data-goto="1">1 · Property</button>
          <button type="button" class="intake-step-btn" data-goto="2">2 · Photos &amp; files</button>
          <button type="button" class="intake-step-btn" data-goto="3">3 · Management</button>
        </div>

        <form id="intakeForm">
          <div class="intake-panel active" data-panel="1">
            <h3>Property details</h3>
            <div class="ls-field"><label>Property name</label><input type="text" name="property_name" id="in-property_name" placeholder="451 Heath St" /></div>
            <div class="ls-row ls-row-2">
              <div class="ls-field"><label>Street address *</label><input type="text" name="address_line" id="in-address" required placeholder="451 Heath St" /></div>
              <div class="ls-field"><label>City</label><input type="text" name="city" id="in-city" placeholder="Brookline" /></div>
            </div>
            <div class="ls-row">
              <div class="ls-field"><label>State</label><input type="text" name="state" id="in-state" maxlength="2" placeholder="MA" /></div>
              <div class="ls-field"><label>ZIP</label><input type="text" name="zip" id="in-zip" placeholder="02445" /></div>
              <div class="ls-field"><label>Listing type</label>
                <select name="goal" id="in-goal">
                  <option value="rent" selected>For rent</option>
                  <option value="sell">For sale</option>
                  <option value="sublease">Sublease</option>
                  <option value="lease">Commercial lease</option>
                </select>
              </div>
            </div>
            <div class="ls-row">
              <div class="ls-field"><label>Price (USD)</label><input type="number" name="price" id="in-price" min="0" placeholder="3200" /></div>
              <div class="ls-field"><label>Price unit</label>
                <select name="price_unit" id="in-price_unit">
                  <option value="monthly" selected>per month</option>
                  <option value="total">total (sale)</option>
                  <option value="nightly">per night</option>
                  <option value="annual">per year</option>
                </select>
              </div>
              <div class="ls-field"><label>Property type</label>
                <select name="property_type" id="in-type">
                  <option value="">Choose…</option>
                  <option>Apartment</option><option>Condo</option><option>House</option>
                  <option>Townhouse</option><option>Loft</option><option>Studio</option>
                </select>
              </div>
            </div>
            <div class="ls-row">
              <div class="ls-field"><label>Bedrooms</label><input type="number" name="bedrooms" id="in-beds" step="0.5" placeholder="3" /></div>
              <div class="ls-field"><label>Bathrooms</label><input type="number" name="bathrooms" id="in-baths" step="0.5" placeholder="2" /></div>
              <div class="ls-field"><label>Square feet</label><input type="number" name="sqft" id="in-sqft" placeholder="1450" /></div>
            </div>
            <div class="ls-field">
              <label>Features</label>
              <div class="intake-chip-grid">${chips}</div>
            </div>
            <div class="ls-field">
              <label>Additional features</label>
              <input type="text" id="in-custom-features" placeholder="e.g. Laundry on site, Skylights, Pet-friendly" />
              <p class="form-hint" style="margin-top:6px;">Comma-separated — we'll format each phrase.</p>
            </div>
            <div class="ls-field">
              <label>Description <span class="form-hint-inline">(optional — we'll generate one if blank)</span></label>
              <textarea name="description" id="in-desc" rows="4" placeholder="What makes this place special?"></textarea>
            </div>
            <button type="button" class="button-dark intake-next" data-next="2">Continue to photos →</button>
          </div>

          <div class="intake-panel" data-panel="2">
            <h3>Photos &amp; documents</h3>
            <p class="form-hint">Drag folders or multi-select files. Photos upload when you generate your preview. Drag to reorder — first photo is your cover.</p>
            <div class="drop-zone" id="photoDrop">
              <input type="file" id="photoInput" multiple accept="image/*" hidden />
              <div class="drop-title">📷 Listing photos</div>
              <div class="drop-sub">JPG, PNG, HEIC — up to 12MB each</div>
              <button type="button" class="button-outline drop-browse" data-browse="photoInput">Browse photos</button>
            </div>
            <div class="photo-grid-section" id="photoGridSection" hidden>
              <h4 class="photo-grid-heading">Your photos</h4>
              <p class="form-hint photo-grid-hint">Drag to reorder — first photo is your cover. Click to enlarge.</p>
              <div class="photo-grid" id="photoGrid" data-lightbox-group="intake-photos"></div>
            </div>
            <p class="photo-panel-status" id="photoPanelStatus" aria-live="polite"></p>
            <div class="drop-zone drop-zone-file" id="fileDrop">
              <input type="file" id="fileInput" multiple accept=".pdf,.doc,.docx,application/pdf" hidden />
              <div class="drop-title">📎 Floor plans &amp; documents</div>
              <div class="drop-sub">PDF, DOC — up to 25MB each</div>
              <button type="button" class="button-outline drop-browse" data-browse="fileInput">Browse files</button>
            </div>
            <ul class="file-list" id="fileList"></ul>
            <div class="intake-panel-nav">
              <button type="button" class="button-outline intake-back" data-back="1">← Back</button>
              <button type="button" class="button-dark intake-next" data-next="3">Continue →</button>
            </div>
          </div>

          <div class="intake-panel" data-panel="3">
            <h3>Showings &amp; inquiries</h3>
            <fieldset class="radio-fieldset">
              <legend>Who manages showings?</legend>
              <label class="radio-line"><input type="radio" name="showing_management" value="self" checked /> I manage showings myself</label>
              <label class="radio-line"><input type="radio" name="showing_management" value="point_person" /> My realtor / property manager is the point person</label>
              <label class="radio-line"><input type="radio" name="showing_management" value="swft" /> SWFT manages showings for me</label>
            </fieldset>
            <div class="point-person-fields" id="pointPersonFields" hidden>
              <div class="ls-row ls-row-2">
                <div class="ls-field"><label>Point person name</label><input type="text" name="pp_name" id="pp-name" /></div>
                <div class="ls-field"><label>Role</label>
                  <select name="pp_role" id="pp-role">
                    <option value="realtor">Realtor</option>
                    <option value="pm">Property manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div class="ls-row ls-row-2">
                <div class="ls-field"><label>Email</label><input type="email" name="pp_email" id="pp-email" /></div>
                <div class="ls-field"><label>Phone</label><input type="tel" name="pp_phone" id="pp-phone" /></div>
              </div>
            </div>
            <fieldset class="radio-fieldset">
              <legend>How should listing inquiries be handled?</legend>
              <label class="radio-line"><input type="radio" name="inquiry_delivery" value="email" checked /> Send form submissions directly to my email</label>
              <label class="radio-line"><input type="radio" name="inquiry_delivery" value="airtable" /> SWFT manages in Airtable — I'll use your dashboard</label>
              <label class="radio-line"><input type="radio" name="inquiry_delivery" value="email_and_csv" /> Email me + CSV export on request from my dashboard</label>
            </fieldset>
            <fieldset class="radio-fieldset">
              <legend>Listing management</legend>
              <label class="radio-line"><input type="radio" name="listing_management" value="self" checked /> I'll manage this listing myself (or with my team)</label>
              <label class="radio-line"><input type="radio" name="listing_management" value="swft" /> SWFT manages this listing for me</label>
            </fieldset>
            <h4 class="intake-subh">Your contact info</h4>
            <div class="ls-row ls-row-2">
              <div class="ls-field"><label>Your name</label><input type="text" name="contact_name" id="in-contact_name" /></div>
              <div class="ls-field"><label>Email *</label><input type="email" name="contact_email" id="in-email" required /></div>
            </div>
            <div class="ls-field"><label>Phone</label><input type="tel" name="contact_phone" id="in-phone" /></div>
            <p class="intake-status" id="intakeStatus" aria-live="polite"></p>
            <div class="intake-panel-nav">
              <button type="button" class="button-outline intake-back" data-back="2">← Back</button>
              <button type="submit" class="button-dark" id="generatePreviewBtn">Generate my preview →</button>
            </div>
          </div>
        </form>
      </div>
      <aside class="intake-preview-col">
        <p class="preview-panel-label">Live preview</p>
        <div id="livePreview">${renderQuickPreviewShell()}</div>
      </aside>
    </div>
  </div>
</section>

<section class="property-section">
  <div class="container">
    <div class="title-wrap">
      <div class="title-line"></div>
      <h2>Example listings</h2>
    </div>
    <div class="property-grid">${gridHtml}</div>
    <p class="section-cta-row"><a href="/properties" class="see-all-link">See all listings →</a></p>
  </div>
</section>

<section class="content-section">
  <div class="content-grid container">
    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="" class="content-image" />
    <div>
      <h2 class="content-h2">You're in good hands</h2>
      <p class="paragraph-large">SWFT builds brokerage-quality pages in minutes. REVA answers questions and books showings 24/7 — or we route every lead to you, your PM, or our Airtable workspace.</p>
      <a href="#intake" class="button-dark">Start your listing</a>
    </div>
  </div>
</section>

<section class="tabs-section">
  <div class="tabs-inner container">
    <div class="tabs-menu-row" role="tablist">
      <button type="button" class="tab-button active" data-tab="0" role="tab">
        <div class="author-wrap"><span class="avatar-placeholder">EK</span><div><div class="avatar-name">Elombe K.</div><div class="avatar-type">Property owner</div></div></div>
      </button>
      <button type="button" class="tab-button" data-tab="1" role="tab">
        <div class="author-wrap"><span class="avatar-placeholder">SL</span><div><div class="avatar-name">Samuel Lee</div><div class="avatar-type">Designer</div></div></div>
      </button>
      <button type="button" class="tab-button" data-tab="2" role="tab">
        <div class="author-wrap"><span class="avatar-placeholder">LM</span><div><div class="avatar-name">Lara Madrigal</div><div class="avatar-type">Client</div></div></div>
      </button>
    </div>
    <div class="tab-pane active" data-pane="0"><div class="title-line-full"></div><p class="quote-text">"I was able to list and rent out my apartment in less than 2 weeks!"</p></div>
    <div class="tab-pane" data-pane="1"><div class="title-line-full"></div><p class="quote-text">"The template made our portfolio look like a top brokerage — setup took one afternoon."</p></div>
    <div class="tab-pane" data-pane="2"><div class="title-line-full"></div><p class="quote-text">"REVA answered weekend inquiries so we didn't lose leads while traveling."</p></div>
  </div>
</section>

${renderSwftFooter()}
${renderLightboxHtml()}
`;

  return renderSwftPage({
    title: "SWFT Real Estate — List your property SWFTly",
    description:
      "Submit your property, upload photos, preview your listing page, and choose how SWFT handles showings and inquiries.",
    body,
    appUrl,
    extraCss: intakeExtraCss() + lightboxCss(),
    extraScript: intakeClientScript() + lightboxScript(),
  });
}

function renderQuickPreviewShell() {
  return /* html */ `
<div class="property-card intake-preview-card">
  <div class="property-image-wrap" id="previewMedia">
    <img src="${PLACEHOLDER_IMAGE}" alt="" class="property-image" id="previewImg" />
    <div class="card-badge-wrap" id="previewBadge">${renderStatusBadge("for_rent")}</div>
  </div>
  <div class="property-content">
    <h5 id="previewTitle">Your property</h5>
    <div class="property-subline" id="previewSub">City, MA · $0</div>
  </div>
  <div class="room-feature-grid">
    <div class="feature"><img src="${assetUrl("images/Bed.svg")}" alt="" class="feature-icon" /><span id="previewBeds">—</span></div>
    <div class="feature centre-lines"><img src="${assetUrl("images/Shower.svg")}" alt="" class="feature-icon" /><span id="previewBaths">—</span></div>
    <div class="feature"><img src="${assetUrl("images/Size.svg")}" alt="" class="feature-icon" /><span id="previewSqft">—</span></div>
  </div>
  <div class="intake-features-preview" id="previewFeatures"></div>
</div>`;
}

function intakeExtraCss() {
  return /* css */ `
.intake-container { max-width: 1200px; }
.intake-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: start; }
.intake-main { background: var(--white-smoke); border-radius: 20px; padding: 32px; }
.intake-steps { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
.intake-step-btn { padding: 10px 16px; border: 1px solid rgba(0,0,0,0.12); background: #fff; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.intake-step-btn.active { background: #000; color: #fff; border-color: #000; }
.intake-panel { display: none; }
.intake-panel.active { display: block; }
.intake-panel h3 { font-size: 24px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.04em; }
.intake-subh { font-size: 16px; margin: 24px 0 12px; }
.intake-panel-nav { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
.ls-row-2 { grid-template-columns: 1fr 1fr; }
.form-hint { color: #666; font-size: 14px; margin-bottom: 16px; }
.form-hint-inline { font-weight: 400; color: #888; font-size: 12px; }
.ls-field textarea { width: 100%; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.12); border-radius: 10px; font: inherit; min-height: 100px; resize: vertical; }
.intake-chip-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.intake-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; border: 1px solid rgba(0,0,0,0.12); font-size: 13px; cursor: pointer; background: #fff; }
.intake-chip:has(input:checked) { background: #000; color: #fff; border-color: #000; }
.intake-chip input { display: none; }
.drop-zone { border: 2px dashed rgba(0,0,0,0.18); border-radius: 16px; padding: 32px 20px; text-align: center; margin-bottom: 16px; background: #fff; transition: border-color 0.2s, background 0.2s; }
.drop-zone.dragover { border-color: var(--orange); background: rgba(179,113,173,0.08); }
.drop-zone-file { margin-top: 8px; }
.drop-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.drop-sub { font-size: 13px; color: #666; margin-bottom: 12px; }
.drop-browse { margin-top: 4px; }
.photo-grid-section { margin-bottom: 16px; }
.photo-grid-heading { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
.photo-grid-hint { margin-bottom: 12px; }
.photo-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 100px; gap: 8px; }
.photo-grid-item { position: relative; border-radius: 10px; overflow: hidden; background: #eee; cursor: grab; }
.photo-grid-item.is-cover { grid-column: span 2; grid-row: span 2; }
.photo-grid-item.dragging { opacity: 0.45; }
.photo-grid-item.drag-over { outline: 2px solid var(--orange); outline-offset: 2px; }
.photo-grid-item img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
.photo-grid-badge { position: absolute; top: 8px; left: 8px; background: #000; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; z-index: 2; pointer-events: none; }
.photo-grid-actions { position: absolute; bottom: 0; left: 0; right: 0; display: flex; gap: 4px; padding: 6px; background: linear-gradient(transparent, rgba(0,0,0,0.65)); z-index: 2; }
.photo-grid-actions button { flex: 1; border: none; background: rgba(255,255,255,0.92); font-size: 11px; font-weight: 600; padding: 5px 4px; border-radius: 4px; cursor: pointer; }
.photo-grid-actions button:hover { background: #fff; }
.photo-grid-remove { position: absolute; top: 8px; right: 8px; width: 26px; height: 26px; border: none; border-radius: 50%; background: rgba(0,0,0,0.55); color: #fff; font-size: 16px; line-height: 1; cursor: pointer; z-index: 3; }
.photo-panel-status { min-height: 18px; font-size: 13px; color: #555; margin-bottom: 12px; font-weight: 500; }
.file-list { list-style: none; padding: 0; margin: 0 0 16px; font-size: 14px; }
.file-list li { padding: 8px 12px; background: #fff; border-radius: 8px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.file-list button { border: none; background: transparent; color: #c00; font-size: 18px; cursor: pointer; padding: 0 4px; }
.radio-fieldset { border: none; margin: 0 0 20px; padding: 0; }
.radio-fieldset legend { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
.radio-line { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; cursor: pointer; }
.radio-line input { margin-top: 3px; accent-color: var(--orange); }
.point-person-fields { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.intake-status { min-height: 20px; font-size: 14px; color: #333; margin: 12px 0; font-weight: 500; }
.intake-preview-col { position: sticky; top: 24px; }
.intake-preview-card { pointer-events: none; }
.intake-preview-card [data-lightbox-src] { pointer-events: auto; cursor: zoom-in; }
.preview-gallery-mini { display: grid; grid-template-columns: 2fr 1fr; gap: 6px; border-radius: 12px 12px 0 0; overflow: hidden; aspect-ratio: 16/10; }
.preview-gallery-mini .preview-mini-cover { grid-row: span 2; overflow: hidden; }
.preview-gallery-mini .preview-mini-cover img { width: 100%; height: 100%; object-fit: cover; }
.preview-gallery-mini .preview-mini-thumbs { display: grid; grid-template-rows: 1fr 1fr; gap: 6px; }
.preview-gallery-mini .preview-mini-thumbs img { width: 100%; height: 100%; object-fit: cover; }
.intake-features-preview { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 14px; }
.intake-features-preview span { font-size: 11px; background: rgba(0,0,0,0.06); padding: 4px 10px; border-radius: 999px; font-weight: 600; }
@media (max-width: 960px) { .intake-layout { grid-template-columns: 1fr; } .intake-preview-col { position: static; } .photo-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 560px) { .photo-grid { grid-template-columns: repeat(2, 1fr); } .photo-grid-item.is-cover { grid-column: span 2; grid-row: span 1; } }
`;
}

function intakeClientScript() {
  return /* js */ `
const PLACEHOLDER_IMAGE = "${PLACEHOLDER_IMAGE}";
const state = { listingId: null, editToken: null, photoItems: [], fileItems: [], dragId: null };
const statusMap = { rent: "for_rent", sell: "for_sale", sublease: "for_rent", lease: "for_rent" };
const statusLabels = { for_rent: "For Rent", for_sale: "For Sale" };
const statusClass = { for_rent: "badge-rent", for_sale: "badge-sale" };

function uid() { return Math.random().toString(36).slice(2, 10); }

function titleCaseFeature(s) {
  return s.trim().split(/\\s+/).map(w =>
    w.split("-").map(p => p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : "").join("-")
  ).join(" ");
}

function parseCustomFeatures() {
  const raw = document.getElementById("in-custom-features")?.value || "";
  if (!raw.trim()) return [];
  return raw.split(",").map(s => titleCaseFeature(s)).filter(Boolean);
}

function gatherFeatures() {
  const chips = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(i => i.value);
  const custom = parseCustomFeatures();
  const seen = new Set(chips.map(c => c.toLowerCase()));
  const merged = [...chips];
  for (const c of custom) {
    if (!seen.has(c.toLowerCase())) { merged.push(c); seen.add(c.toLowerCase()); }
  }
  return merged;
}

function photoSrc(p) { return p.url || p.blobUrl; }

function showPanel(n) {
  document.querySelectorAll(".intake-panel").forEach(p => p.classList.toggle("active", Number(p.dataset.panel) === n));
  document.querySelectorAll(".intake-step-btn").forEach(b => b.classList.toggle("active", Number(b.dataset.goto) === n));
  updatePreview();
}

document.querySelectorAll(".intake-step-btn").forEach(b => b.addEventListener("click", () => showPanel(Number(b.dataset.goto))));
document.querySelectorAll("[data-next]").forEach(b => b.addEventListener("click", () => showPanel(Number(b.dataset.next))));
document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => showPanel(Number(b.dataset.back))));

document.querySelectorAll('input[name="showing_management"]').forEach(r => {
  r.addEventListener("change", () => {
    const pp = document.getElementById("pointPersonFields");
    if (pp) pp.hidden = document.querySelector('input[name="showing_management"]:checked')?.value !== "point_person";
  });
});

function gatherIntakeOptions() {
  const sm = document.querySelector('input[name="showing_management"]:checked')?.value || "self";
  const id = document.querySelector('input[name="inquiry_delivery"]:checked')?.value || "email";
  const lm = document.querySelector('input[name="listing_management"]:checked')?.value || "self";
  const opts = { showing_management: sm, inquiry_delivery: id, listing_management: lm };
  if (sm === "point_person") {
    opts.point_person = {
      name: document.getElementById("pp-name")?.value || "",
      email: document.getElementById("pp-email")?.value || "",
      phone: document.getElementById("pp-phone")?.value || "",
      role: document.getElementById("pp-role")?.value || "",
    };
  }
  return opts;
}

function gatherPayload() {
  return {
    template: "swft",
    plan: "quick",
    goal: document.getElementById("in-goal")?.value || "rent",
    property_name: document.getElementById("in-property_name")?.value || document.getElementById("in-address")?.value,
    address_line: document.getElementById("in-address")?.value,
    city: document.getElementById("in-city")?.value,
    state: document.getElementById("in-state")?.value,
    zip: document.getElementById("in-zip")?.value,
    price: document.getElementById("in-price")?.value,
    price_unit: document.getElementById("in-price_unit")?.value || "monthly",
    bedrooms: document.getElementById("in-beds")?.value,
    bathrooms: document.getElementById("in-baths")?.value,
    sqft: document.getElementById("in-sqft")?.value,
    property_type: document.getElementById("in-type")?.value,
    description: document.getElementById("in-desc")?.value?.trim() || "",
    features: gatherFeatures(),
    contact_name: document.getElementById("in-contact_name")?.value,
    contact_email: document.getElementById("in-email")?.value,
    contact_phone: document.getElementById("in-phone")?.value,
    intake_options: gatherIntakeOptions(),
  };
}

function renderPreviewMedia() {
  const wrap = document.getElementById("previewMedia");
  if (!wrap) return;
  const photos = state.photoItems;

  if (!photos.length) {
    wrap.innerHTML =
      '<img src="' + PLACEHOLDER_IMAGE + '" alt="" class="property-image" id="previewImg" />' +
      '<div class="card-badge-wrap" id="previewBadge"></div>';
    syncPreviewBadge();
    return;
  }

  if (photos.length === 1) {
    const src = photoSrc(photos[0]);
    wrap.innerHTML =
      '<img src="' + src + '" alt="" class="property-image" data-lightbox-group="intake-photos" data-lightbox-src="' + src + '" />' +
      '<div class="card-badge-wrap" id="previewBadge"></div>';
    syncPreviewBadge();
    return;
  }

  const cover = photoSrc(photos[0]);
  const thumbs = photos.slice(1, 3);
  let thumbsHtml = thumbs.map(p => {
    const s = photoSrc(p);
    return '<div><img src="' + s + '" alt="" data-lightbox-group="intake-photos" data-lightbox-src="' + s + '" /></div>';
  }).join("");
  while (thumbs.length < 2 && photos.length > thumbs.length + 1) {
    const extra = photos[thumbs.length + 1];
    if (extra) {
      const s = photoSrc(extra);
      thumbsHtml += '<div><img src="' + s + '" alt="" data-lightbox-group="intake-photos" data-lightbox-src="' + s + '" /></div>';
      thumbs.push(extra);
    } else break;
  }

  wrap.innerHTML =
    '<div class="preview-gallery-mini">' +
      '<div class="preview-mini-cover"><img src="' + cover + '" alt="" data-lightbox-group="intake-photos" data-lightbox-src="' + cover + '" /></div>' +
      '<div class="preview-mini-thumbs">' + thumbsHtml + '</div>' +
    '</div>' +
    '<div class="card-badge-wrap" id="previewBadge"></div>';
  syncPreviewBadge();
}

function syncPreviewBadge() {
  const goal = document.getElementById("in-goal")?.value || "rent";
  const ms = statusMap[goal] || "for_rent";
  const badge = document.getElementById("previewBadge");
  if (badge) badge.innerHTML = '<span class="status-badge ' + (statusClass[ms]||"badge-rent") + '">' + (statusLabels[ms]||"For Rent") + '</span>';
}

function updatePreview() {
  const title = document.getElementById("in-property_name")?.value || document.getElementById("in-address")?.value || "Your property";
  const city = document.getElementById("in-city")?.value || "City";
  const stateCode = document.getElementById("in-state")?.value || "";
  const beds = document.getElementById("in-beds")?.value || "—";
  const baths = document.getElementById("in-baths")?.value || "—";
  const sqft = document.getElementById("in-sqft")?.value;
  const price = document.getElementById("in-price")?.value || "0";
  const unit = document.getElementById("in-price_unit")?.value === "monthly" ? "/mo" : "";
  const el = id => document.getElementById(id);
  if (el("previewTitle")) el("previewTitle").textContent = title;
  if (el("previewSub")) el("previewSub").textContent = city + (stateCode ? ", " + stateCode : "") + " · $" + Number(price).toLocaleString() + unit;
  if (el("previewBeds")) el("previewBeds").textContent = beds;
  if (el("previewBaths")) el("previewBaths").textContent = baths;
  if (el("previewSqft")) el("previewSqft").textContent = sqft ? Number(sqft).toLocaleString() + " sqft" : "—";
  renderPreviewMedia();
  const featEl = el("previewFeatures");
  if (featEl) {
    const feats = gatherFeatures().slice(0, 4);
    featEl.innerHTML = feats.map(f => '<span>' + f.replace(/</g,"&lt;") + '</span>').join("");
  }
}

["in-property_name","in-address","in-city","in-state","in-beds","in-baths","in-sqft","in-price","in-goal","in-price_unit","in-custom-features"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", updatePreview);
  document.getElementById(id)?.addEventListener("change", updatePreview);
});
document.querySelectorAll('input[name="features"]').forEach(i => {
  i.addEventListener("change", updatePreview);
});

function renderPhotoGrid() {
  const section = document.getElementById("photoGridSection");
  const grid = document.getElementById("photoGrid");
  if (!grid) return;
  if (!state.photoItems.length) {
    if (section) section.hidden = true;
    grid.innerHTML = "";
    updatePreview();
    return;
  }
  if (section) section.hidden = false;
  grid.innerHTML = state.photoItems.map((p, i) => {
    const src = photoSrc(p);
    const cover = i === 0 ? " is-cover" : "";
    const coverBadge = i === 0 ? '<span class="photo-grid-badge">Cover</span>' : '';
    const setCover = i === 0 ? '' : '<button type="button" data-set-cover="' + p.id + '">Set cover</button>';
    return '<div class="photo-grid-item' + cover + '" draggable="true" data-id="' + p.id + '">' +
      coverBadge +
      '<img src="' + src + '" alt="" data-lightbox-group="intake-photos" data-lightbox-src="' + src + '" />' +
      '<button type="button" class="photo-grid-remove" data-remove-photo="' + p.id + '" aria-label="Remove">×</button>' +
      '<div class="photo-grid-actions">' + setCover + '</div></div>';
  }).join("");
  bindPhotoGridEvents();
  updatePreview();
}

function bindPhotoGridEvents() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;

  grid.querySelectorAll("[data-remove-photo]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.removePhoto;
      const item = state.photoItems.find(p => p.id === id);
      if (item?.blobUrl) URL.revokeObjectURL(item.blobUrl);
      state.photoItems = state.photoItems.filter(p => p.id !== id);
      const st = document.getElementById("photoPanelStatus");
      if (st) st.textContent = state.photoItems.length + " photo(s) ready — uploads when you generate preview.";
      renderPhotoGrid();
    });
  });

  grid.querySelectorAll("[data-set-cover]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.setCover;
      const idx = state.photoItems.findIndex(p => p.id === id);
      if (idx <= 0) return;
      const [item] = state.photoItems.splice(idx, 1);
      state.photoItems.unshift(item);
      renderPhotoGrid();
    });
  });

  grid.querySelectorAll(".photo-grid-item").forEach(el => {
    el.addEventListener("dragstart", (e) => {
      state.dragId = el.dataset.id;
      el.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      state.dragId = null;
      grid.querySelectorAll(".photo-grid-item").forEach(x => x.classList.remove("drag-over"));
    });
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      el.classList.add("drag-over");
    });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      el.classList.remove("drag-over");
      const fromId = state.dragId;
      const toId = el.dataset.id;
      if (!fromId || fromId === toId) return;
      const fromIdx = state.photoItems.findIndex(p => p.id === fromId);
      const toIdx = state.photoItems.findIndex(p => p.id === toId);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = state.photoItems.splice(fromIdx, 1);
      state.photoItems.splice(toIdx, 0, moved);
      renderPhotoGrid();
    });
  });
}

function renderFileList() {
  const el = document.getElementById("fileList");
  if (!el) return;
  el.innerHTML = state.fileItems.map(f =>
    '<li><span>' + f.name.replace(/</g,"&lt;") + '</span><span>' + Math.round((f.size||0)/1024) + ' KB</span>' +
    '<button type="button" data-remove-file="' + f.id + '" aria-label="Remove">×</button></li>'
  ).join("");
  el.querySelectorAll("[data-remove-file]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.fileItems = state.fileItems.filter(f => f.id !== btn.dataset.removeFile);
      renderFileList();
    });
  });
}

function setupDrop(zoneId, inputId, kind) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("dragover"); handleFiles(e.dataTransfer.files, kind); });
  input.addEventListener("change", () => { handleFiles(input.files, kind); input.value = ""; });
}
document.querySelectorAll("[data-browse]").forEach(btn => {
  btn.addEventListener("click", () => document.getElementById(btn.dataset.browse)?.click());
});
setupDrop("photoDrop", "photoInput", "image");
setupDrop("fileDrop", "fileInput", "file");

function handleFiles(fileList, kind) {
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) return;
  const st = document.getElementById("photoPanelStatus");

  if (kind === "image") {
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      state.photoItems.push({
        id: uid(),
        file,
        blobUrl: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
    if (st) st.textContent = state.photoItems.length + " photo(s) added — drag to reorder. Uploads when you generate preview.";
    renderPhotoGrid();
    return;
  }

  for (const file of files) {
    state.fileItems.push({ id: uid(), file, name: file.name, size: file.size, type: file.type });
  }
  if (st) st.textContent = state.fileItems.length + " file(s) ready.";
  renderFileList();
}

function reconcileImages(serverImages) {
  if (!serverImages?.length) return [];
  const ordered = [];
  const used = new Set();
  for (const p of state.photoItems) {
    let match = serverImages.find(s => !used.has(s.url) && s.name === p.name && s.size === p.size);
    if (!match) match = serverImages.find(s => !used.has(s.url) && s.name === p.name);
    if (match) {
      ordered.push(match);
      used.add(match.url);
    }
  }
  for (const s of serverImages) {
    if (!used.has(s.url)) ordered.push(s);
  }
  return ordered.length ? ordered : serverImages;
}

async function uploadKind(listingId, token, items, kind) {
  if (!items.length) return kind === "image" ? [] : [];
  const fd = new FormData();
  fd.append("kind", kind);
  let appended = 0;
  for (const item of items) {
    if (item.file) {
      fd.append("files", item.file, item.name || item.file.name || "upload");
      appended++;
    }
  }
  if (!appended) throw new Error("Photos could not be read. Please go back to step 2 and re-add your images.");
  const res = await fetch("/api/listings/" + listingId + "/upload", {
    method: "POST",
    headers: { "x-edit-token": token },
    body: fd,
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || kind + " upload failed");
  return kind === "image" ? (j.images || []) : (j.files || []);
}

document.getElementById("intakeForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const st = document.getElementById("intakeStatus");
  const email = document.getElementById("in-email")?.value?.trim();
  if (!email || !email.includes("@")) {
    st.textContent = "Please enter a valid email.";
    return;
  }
  const addr = document.getElementById("in-address")?.value?.trim();
  if (!addr) { st.textContent = "Street address is required."; showPanel(1); return; }
  const btn = document.getElementById("generatePreviewBtn");
  btn.disabled = true;
  try {
    st.textContent = "Saving your listing…";
    const payload = gatherPayload();
    payload.contact_email = email;
    const createRes = await fetch("/api/listings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!createRes.ok) throw new Error("create failed");
    const created = await createRes.json();
    state.listingId = created.id;
    state.editToken = created.edit_token;

    if (state.photoItems.length) {
      st.textContent = "Uploading " + state.photoItems.length + " photo(s)…";
      const serverImages = await uploadKind(state.listingId, state.editToken, state.photoItems, "image");
      if (!serverImages.length) {
        throw new Error("Photo upload failed — no images were saved. Try again or use JPG/PNG files.");
      }
      const ordered = reconcileImages(serverImages);
      const patchImg = await fetch("/api/listings/" + state.listingId, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-edit-token": state.editToken },
        body: JSON.stringify({ images: ordered }),
      });
      if (!patchImg.ok) throw new Error("Could not save photo order");
    }

    if (state.fileItems.length) {
      st.textContent = "Uploading " + state.fileItems.length + " file(s)…";
      await uploadKind(state.listingId, state.editToken, state.fileItems, "file");
    }

    st.textContent = "Saving details…";
    await fetch("/api/listings/" + state.listingId, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-edit-token": state.editToken },
      body: JSON.stringify(gatherPayload()),
    });

    if (!payload.description) {
      st.textContent = "Writing your description…";
      await fetch("/api/listings/" + state.listingId + "/generate-description", {
        method: "POST",
        headers: { "x-edit-token": state.editToken },
      });
    }
    st.textContent = "Opening your preview…";
    location.href = "/preview/" + state.listingId + "?t=" + state.editToken;
  } catch (err) {
    st.textContent = "Something went wrong — " + err.message;
    btn.disabled = false;
  }
});

document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const i = btn.dataset.tab;
    document.querySelectorAll(".tab-button").forEach(b => b.classList.toggle("active", b.dataset.tab === i));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.toggle("active", p.dataset.pane === i));
  });
});

if (location.hash === "#intake" || new URLSearchParams(location.search).has("property_name")) {
  const q = new URLSearchParams(location.search);
  const set = (id, k) => { const el = document.getElementById(id); if (el && q.get(k)) el.value = q.get(k); };
  set("in-property_name", "property_name");
  set("in-address", "address_line");
  set("in-city", "city");
  set("in-state", "state");
  set("in-beds", "bedrooms");
  set("in-baths", "bathrooms");
  set("in-price", "price");
  if (q.get("goal")) document.getElementById("in-goal").value = q.get("goal");
  updatePreview();
}
updatePreview();
`;
}
