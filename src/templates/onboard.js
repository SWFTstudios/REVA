// Onboarding wizard — 5 steps, single page, client-driven state.
// Step 1: goal + basics    Step 2: details    Step 3: photos    Step 4: schedule + contact    Step 5: review + go

import { layout } from "./layout.js";
import { renderSwftNav, swftCss } from "./swft-theme.js";

export function renderOnboard({ appUrl }) {
  const body = /* html */ `
${renderSwftNav({ appUrl })}
<div class="onboard-wrap">
<header class="onboard-nav">
  <div class="step-pills">
    <span data-step-pill="1" class="active">1 · Basics</span>
    <span data-step-pill="2">2 · Details</span>
    <span data-step-pill="3">3 · Photos</span>
    <span data-step-pill="4">4 · Schedule</span>
    <span data-step-pill="5">5 · Review</span>
  </div>
  <a href="/" class="exit">Exit</a>
</header>

<main class="onboard">
  <!-- Step 1 -->
  <section data-step="1" class="step-panel active">
    <div class="step-head">
      <span class="eyebrow">Step 1 of 5</span>
      <h1>Tell us about the property.</h1>
      <p class="lede">Two minutes and we'll have enough to draft your page. You can refine anything later.</p>
    </div>
    <div class="grid-2">
      <div class="form-row">
        <label>What are you doing?</label>
        <div class="radio-grid">
          <label class="radio"><input type="radio" name="goal" value="rent" checked /> <span>Renting it out</span></label>
          <label class="radio"><input type="radio" name="goal" value="sell" /> <span>Selling it</span></label>
          <label class="radio"><input type="radio" name="goal" value="sublease" /> <span>Subleasing</span></label>
          <label class="radio"><input type="radio" name="goal" value="lease" /> <span>Commercial lease</span></label>
        </div>
      </div>
      <div class="form-row">
        <label>Template vibe</label>
        <div class="radio-grid">
          <label class="radio"><input type="radio" name="template" value="swft" checked /> <span>Editorial (SWFT)</span></label>
          <label class="radio"><input type="radio" name="template" value="bold" /> <span>Bold &amp; modern</span></label>
          <label class="radio"><input type="radio" name="template" value="clean" /> <span>Clean &amp; minimal</span></label>
        </div>
      </div>
    </div>

    <div class="form-row">
      <label>Property name <span class="hint">— a short label, e.g. "451 Heath St" or "The Solomon Lofts"</span></label>
      <input type="text" name="property_name" placeholder="451 Heath St" />
    </div>

    <div class="grid-3">
      <div class="form-row">
        <label>Address</label>
        <input type="text" name="address_line" placeholder="451 Heath St" />
      </div>
      <div class="form-row">
        <label>City</label>
        <input type="text" name="city" placeholder="Brookline" />
      </div>
      <div class="form-row">
        <label>State / ZIP</label>
        <div style="display: flex; gap: 8px;">
          <input type="text" name="state" placeholder="MA" maxlength="2" style="width: 80px;" />
          <input type="text" name="zip" placeholder="02445" />
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="form-row">
        <label>Asking price (USD)</label>
        <input type="number" name="price" placeholder="3200" min="0" />
      </div>
      <div class="form-row">
        <label>Price unit</label>
        <select name="price_unit">
          <option value="monthly">per month</option>
          <option value="total">total (sale)</option>
          <option value="nightly">per night</option>
          <option value="annual">per year</option>
        </select>
      </div>
    </div>

    <div class="step-foot">
      <span></span>
      <button class="btn btn-dark btn-lg" data-next>Continue →</button>
    </div>
  </section>

  <!-- Step 2 -->
  <section data-step="2" class="step-panel">
    <div class="step-head">
      <span class="eyebrow">Step 2 of 5</span>
      <h1>What makes it special?</h1>
      <p class="lede">Beds, baths, square footage, and the features prospects ask about.</p>
    </div>
    <div class="grid-3">
      <div class="form-row"><label>Bedrooms</label><input type="number" name="bedrooms" step="0.5" placeholder="3" /></div>
      <div class="form-row"><label>Bathrooms</label><input type="number" name="bathrooms" step="0.5" placeholder="2" /></div>
      <div class="form-row"><label>Square feet</label><input type="number" name="sqft" placeholder="1450" /></div>
    </div>
    <div class="form-row">
      <label>Property type</label>
      <select name="property_type">
        <option value="">Choose one…</option>
        <option>Apartment</option><option>Condo</option><option>House</option><option>Townhouse</option>
        <option>Loft</option><option>Studio</option><option>Multi-family</option><option>Commercial</option>
        <option>Office</option><option>Retail</option>
      </select>
    </div>
    <div class="form-row">
      <label>Features <span class="hint">— select all that apply, or type your own and press enter</span></label>
      <div class="chip-grid" data-feature-chips>
        ${["In-unit laundry","Dishwasher","Parking","Garage","Central A/C","Heat included","Pets allowed","Furnished","Hardwood floors","Balcony","Roof access","Gym","Pool","Doorman","Elevator","Backyard","Fireplace"].map(f=>`<label class="chip"><input type="checkbox" name="features" value="${f}"/><span>${f}</span></label>`).join("")}
      </div>
      <input type="text" name="custom_feature" placeholder="Add custom feature and press Enter" />
    </div>
    <div class="form-row">
      <label>Description <span class="hint">— rough notes are fine, we'll polish it</span></label>
      <textarea name="description" placeholder="A sunny 3-bedroom in the heart of Brookline. Steps to the green line, parking included, recently renovated kitchen…"></textarea>
    </div>

    <div class="step-foot">
      <button class="btn btn-ghost" data-back>← Back</button>
      <button class="btn btn-dark btn-lg" data-next>Continue →</button>
    </div>
  </section>

  <!-- Step 3 -->
  <section data-step="3" class="step-panel">
    <div class="step-head">
      <span class="eyebrow">Step 3 of 5</span>
      <h1>Drop your photos.</h1>
      <p class="lede">Drag-and-drop or click to browse. We'll upload them straight to your page. JPG, PNG, HEIC up to 12MB each.</p>
    </div>
    <div class="drop-zone" id="dropZone">
      <input type="file" id="fileInput" multiple accept="image/*,.pdf" hidden />
      <div class="drop-inner">
        <div class="drop-icon">📷</div>
        <div class="drop-title">Drag &amp; drop photos here</div>
        <div class="drop-sub">or <a href="#" id="browseLink">click to browse</a></div>
        <div class="drop-hint">Tip: bulk-select a folder of photos in Finder/Explorer and drag the whole thing in.</div>
      </div>
    </div>
    <div class="upload-status" id="uploadStatus"></div>
    <div class="thumbs" id="thumbs"></div>

    <div class="step-foot">
      <button class="btn btn-ghost" data-back>← Back</button>
      <button class="btn btn-dark btn-lg" data-next>Continue →</button>
    </div>
  </section>

  <!-- Step 4 -->
  <section data-step="4" class="step-panel">
    <div class="step-head">
      <span class="eyebrow">Step 4 of 5</span>
      <h1>Schedule &amp; contact.</h1>
      <p class="lede">When can prospects come see it, and where should inquiries go?</p>
    </div>
    <div class="form-row">
      <label>Showing days</label>
      <div class="chip-grid">
        ${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>`<label class="chip"><input type="checkbox" name="schedule_days" value="${d}" /><span>${d}</span></label>`).join("")}
      </div>
    </div>
    <div class="grid-2">
      <div class="form-row">
        <label>Showing window</label>
        <input type="text" name="schedule_window" placeholder="e.g. 4–7 PM weekdays, 11–4 weekends" />
      </div>
      <div class="form-row">
        <label>Showing notes <span class="hint">— optional</span></label>
        <input type="text" name="schedule_notes" placeholder="48-hour notice preferred; building has doorman" />
      </div>
    </div>

    <h3 class="sub-h">Your contact info</h3>
    <p class="hint">REVA forwards every inquiry here. We never share your email publicly on the page.</p>
    <div class="grid-2">
      <div class="form-row"><label>Your name</label><input type="text" name="contact_name" placeholder="Elombe Kisala" /></div>
      <div class="form-row"><label>Email *</label><input type="email" name="contact_email" required placeholder="you@example.com" /></div>
      <div class="form-row"><label>Phone</label><input type="tel" name="contact_phone" placeholder="(555) 123-4567" /></div>
    </div>

    <h3 class="sub-h">Plan</h3>
    <div class="plan-pick">
      <label class="plan-card"><input type="radio" name="plan" value="quick" checked />
        <div><b>Quick List</b><span>$79 setup + $29/mo · 1 property · 8 photos</span></div></label>
      <label class="plan-card"><input type="radio" name="plan" value="pro" />
        <div><b>Pro List</b><span>$149 setup + $49/mo · unlimited photos + custom domain</span></div></label>
      <label class="plan-card"><input type="radio" name="plan" value="portfolio" />
        <div><b>Portfolio</b><span>$299/mo · up to 10 listings · no setup fee</span></div></label>
    </div>

    <div class="step-foot">
      <button class="btn btn-ghost" data-back>← Back</button>
      <button class="btn btn-dark btn-lg" data-next>Continue →</button>
    </div>
  </section>

  <!-- Step 5 -->
  <section data-step="5" class="step-panel">
    <div class="step-head">
      <span class="eyebrow">Step 5 of 5</span>
      <h1>Looks good — let's see your preview.</h1>
      <p class="lede">We'll generate your live preview now. You can edit anything, then publish whenever you're ready.</p>
    </div>
    <div class="review" id="review"></div>

    <div class="step-foot">
      <button class="btn btn-ghost" data-back>← Back</button>
      <button class="btn btn-dark btn-lg" id="generateBtn">Generate my preview →</button>
    </div>
  </section>
</main>
</div>
  `;

  return layout({
    title: "List your property — SWFT Real Estate",
    description: "Upload photos, fill in details, see your preview in minutes.",
    body,
    appUrl,
    bodyClass: "swft-body",
    extraHead: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />`,
    extraCss: swftCss() + onboardCss(),
    extraScript: onboardScript(),
  });
}

function onboardCss() {
  return /* css */ `
.onboard-wrap { background: var(--white-smoke, #f5f5f5); min-height: 100vh; }
.onboard-nav { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.08); }
.step-pills { display: flex; gap: 16px; font-size: 13px; color: #666; flex: 1; justify-content: center; }
.step-pills span { padding: 4px 10px; border-radius: 999px; }
.step-pills span.active { background: #000; color: #fff; font-weight: 600; }
.step-pills span.done { color: #000; font-weight: 600; }
.exit { color: #666; text-decoration: none; font-size: 14px; }
.exit:hover { color: #000; }
@media (max-width: 900px) { .step-pills { display: none; } }

.onboard { max-width: 880px; margin: 0 auto; padding: 56px 32px 120px; background: #fff; border-radius: 16px; margin-top: 24px; margin-bottom: 48px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
@media (max-width: 700px) { .onboard { padding: 32px 20px 80px; } }

.step-panel { display: none; animation: fadeUp .4s ease; }
.step-panel.active { display: block; }
@keyframes fadeUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:none; } }
.step-head { margin-bottom: 32px; }
.step-head h1 { font-family: var(--serif); font-size: clamp(32px, 4.4vw, 48px); line-height: 1.08; letter-spacing: -0.02em; margin: 12px 0 14px; }
.step-head .lede { color: var(--muted); font-size: 17px; line-height: 1.55; }
.eyebrow { display: inline-block; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
.sub-h { font-family: var(--serif); font-size: 22px; letter-spacing: -0.01em; margin: 32px 0 4px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 700px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }

.radio-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.radio { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--line); cursor: pointer; transition: all .15s ease; font-size: 14px; }
.radio:hover { border-color: rgba(20,20,20,0.25); }
.radio input { accent-color: var(--ink); }
.radio:has(input:checked) { border-color: var(--ink); background: rgba(19,19,17,0.04); }

.chip-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; border: 1px solid var(--line); font-size: 13px; cursor: pointer; transition: all .15s ease; user-select: none; }
.chip:hover { border-color: rgba(20,20,20,0.3); }
.chip input { display: none; }
.chip:has(input:checked) { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.chip-removable { background: rgba(233,196,106,0.2); border-color: rgba(233,196,106,0.6); }

.drop-zone { border: 2px dashed rgba(20,20,20,0.18); border-radius: 18px; padding: 64px 24px; text-align: center; cursor: pointer; transition: all .2s ease; background: var(--paper-2); }
.drop-zone.dragover { border-color: var(--ink); background: rgba(19,19,17,0.04); transform: scale(1.01); }
.drop-icon { font-size: 36px; margin-bottom: 12px; }
.drop-title { font-family: var(--serif); font-size: 22px; }
.drop-sub { font-size: 14px; color: var(--muted); margin-top: 6px; }
.drop-sub a { color: var(--ink); text-decoration: underline; font-weight: 600; }
.drop-hint { margin-top: 14px; font-size: 12px; color: var(--muted); }

.upload-status { margin-top: 16px; font-size: 13px; color: var(--muted); min-height: 18px; }
.thumbs { margin-top: 18px; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
.thumb { position: relative; aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: var(--paper-2); }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-remove { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.65); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 13px; }

.plan-pick { display: grid; gap: 10px; }
.plan-card { display: flex; gap: 12px; padding: 16px 18px; border-radius: 12px; border: 1px solid var(--line); cursor: pointer; align-items: flex-start; }
.plan-card input { margin-top: 4px; accent-color: var(--ink); }
.plan-card div { display: flex; flex-direction: column; gap: 4px; }
.plan-card b { font-family: var(--serif); font-size: 18px; }
.plan-card span { font-size: 13px; color: var(--muted); }
.plan-card:has(input:checked) { border-color: var(--ink); background: rgba(19,19,17,0.04); }

.review { background: var(--paper-2); border-radius: 18px; padding: 28px; display: grid; gap: 14px; font-size: 14px; }
.review-row { display: grid; grid-template-columns: 160px 1fr; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--line); }
.review-row:last-child { border-bottom: none; }
.review-row b { color: var(--muted); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
.review-photos { display: flex; gap: 6px; flex-wrap: wrap; }
.review-photos img { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; }

.step-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--line); }
.step-foot button { min-width: 140px; }

.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--paper); padding: 12px 20px; border-radius: 999px; font-size: 14px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.4); z-index: 100; }
  `;
}

function onboardScript() {
  return /* js */ `
// ── Prefill from homepage quick form ────────────────────────────────────────
(function prefillFromQuery() {
  const q = new URLSearchParams(location.search);
  const set = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.value = val; };
  set('input[name="property_name"]', q.get("property_name"));
  set('input[name="address_line"]', q.get("address_line"));
  set('input[name="city"]', q.get("city"));
  set('input[name="state"]', q.get("state"));
  set('input[name="zip"]', q.get("zip"));
  set('input[name="price"]', q.get("price"));
  set('input[name="bedrooms"]', q.get("bedrooms"));
  set('input[name="bathrooms"]', q.get("bathrooms"));
  const goal = q.get("goal");
  if (goal) {
    const r = document.querySelector('input[name="goal"][value="' + goal + '"]');
    if (r) r.checked = true;
  }
  if (goal === "sell") {
    const pu = document.querySelector('select[name="price_unit"]');
    if (pu) pu.value = "total";
  }
})();

// ── Onboard state machine ───────────────────────────────────────────────────
const state = {
  step: 1,
  listingId: null,
  editToken: null,
  data: {
    template: "swft",
    goal: "rent",
    price_unit: "monthly",
    plan: new URLSearchParams(location.search).get("plan") || "quick",
    features: [],
    images: [],
    schedule: { days: [], window: "", notes: "" },
  },
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

function showStep(n) {
  state.step = n;
  $$(".step-panel").forEach(p => p.classList.toggle("active", Number(p.dataset.step) === n));
  $$("[data-step-pill]").forEach(p => {
    const s = Number(p.dataset.stepPill);
    p.classList.toggle("active", s === n);
    p.classList.toggle("done", s < n);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (n === 5) renderReview();
}

function gatherData() {
  state.data.goal = (document.querySelector('input[name="goal"]:checked') || {}).value || state.data.goal;
  state.data.template = (document.querySelector('input[name="template"]:checked') || {}).value || state.data.template;
  state.data.plan = (document.querySelector('input[name="plan"]:checked') || {}).value || state.data.plan;
  state.data.property_name = ($('input[name="property_name"]') || {}).value || "";
  state.data.address_line = ($('input[name="address_line"]') || {}).value || "";
  state.data.city = ($('input[name="city"]') || {}).value || "";
  state.data.state = ($('input[name="state"]') || {}).value || "";
  state.data.zip = ($('input[name="zip"]') || {}).value || "";
  const price = parseFloat(($('input[name="price"]') || {}).value || "0");
  state.data.price = isFinite(price) ? price : null;
  state.data.price_unit = ($('select[name="price_unit"]') || {}).value || "monthly";
  state.data.bedrooms = parseFloat(($('input[name="bedrooms"]') || {}).value || "") || null;
  state.data.bathrooms = parseFloat(($('input[name="bathrooms"]') || {}).value || "") || null;
  state.data.sqft = parseFloat(($('input[name="sqft"]') || {}).value || "") || null;
  state.data.property_type = ($('select[name="property_type"]') || {}).value || "";
  state.data.description = ($('textarea[name="description"]') || {}).value || "";

  state.data.features = $$('input[name="features"]:checked').map(i => i.value);
  // include any custom-added chips
  $$('[data-custom-feature]').forEach(el => {
    const v = el.dataset.customFeature;
    if (v && !state.data.features.includes(v)) state.data.features.push(v);
  });

  state.data.schedule = {
    days: $$('input[name="schedule_days"]:checked').map(i => i.value),
    window: ($('input[name="schedule_window"]') || {}).value || "",
    notes: ($('input[name="schedule_notes"]') || {}).value || "",
  };
  state.data.contact_name = ($('input[name="contact_name"]') || {}).value || "";
  state.data.contact_email = ($('input[name="contact_email"]') || {}).value || "";
  state.data.contact_phone = ($('input[name="contact_phone"]') || {}).value || "";
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// Custom feature chips
const customInput = document.querySelector('input[name="custom_feature"]');
if (customInput) {
  customInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = customInput.value.trim();
      if (!v) return;
      const grid = document.querySelector('[data-feature-chips]');
      const label = document.createElement("label");
      label.className = "chip chip-removable";
      label.dataset.customFeature = v;
      label.innerHTML = '<input type="checkbox" name="features" value="' + v + '" checked /><span>' + v + ' ×</span>';
      label.addEventListener("click", (ev) => {
        if (ev.target.tagName !== "INPUT") { label.remove(); }
      });
      grid.appendChild(label);
      customInput.value = "";
    }
  });
}

// ── Step nav ────────────────────────────────────────────────────────────────
$$("[data-next]").forEach(btn => btn.addEventListener("click", async () => {
  // Validation per step
  if (state.step === 1) {
    const addr = ($('input[name="address_line"]') || {}).value.trim();
    if (!addr) return toast("Add the property address to continue");
  }
  if (state.step === 4) {
    const email = ($('input[name="contact_email"]') || {}).value.trim();
    if (!email || !email.includes("@")) return toast("We need an email to send the preview to");
    // Save listing as draft on first move past contact step
    gatherData();
    await ensureListing();
  }
  showStep(state.step + 1);
}));
$$("[data-back]").forEach(btn => btn.addEventListener("click", () => showStep(state.step - 1)));

async function ensureListing() {
  if (state.listingId) return state.listingId;
  const res = await fetch("/api/listings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(state.data),
  });
  if (!res.ok) {
    toast("Couldn't save draft — please try again");
    throw new Error("create failed");
  }
  const j = await res.json();
  state.listingId = j.id;
  state.editToken = j.edit_token;
  return j.id;
}

// ── Image upload (drag/drop or browse) ──────────────────────────────────────
const dropZone = $("#dropZone");
const fileInput = $("#fileInput");
const browseLink = $("#browseLink");
const uploadStatus = $("#uploadStatus");
const thumbs = $("#thumbs");

if (dropZone) {
  ["dragenter","dragover"].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.add("dragover"); }));
  ["dragleave","drop"].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.remove("dragover"); }));
  dropZone.addEventListener("drop", e => handleFiles(e.dataTransfer.files));
  dropZone.addEventListener("click", () => fileInput.click());
  browseLink && browseLink.addEventListener("click", (e) => { e.preventDefault(); fileInput.click(); });
  fileInput.addEventListener("change", () => handleFiles(fileInput.files));
}

async function handleFiles(files) {
  if (!files || !files.length) return;
  // ensure listing exists first so we can attach uploads
  gatherData();
  // need at least email — if step 1+2 done, ok; else, save what we have to a draft
  if (!state.data.contact_email) {
    state.data.contact_email = "pending+" + Math.random().toString(36).slice(2,8) + "@listfast.local";
  }
  try { await ensureListing(); } catch { return; }
  uploadStatus.textContent = "Uploading " + files.length + " file(s)…";
  const fd = new FormData();
  for (const f of files) fd.append("files", f);
  try {
    const r = await fetch("/api/listings/" + state.listingId + "/upload", {
      method: "POST",
      headers: { "x-edit-token": state.editToken },
      body: fd,
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      uploadStatus.textContent = "Upload failed — " + (err.error || r.statusText);
      return;
    }
    const j = await r.json();
    state.data.images = j.images || [];
    renderThumbs();
    uploadStatus.textContent = state.data.images.length + " photo(s) ready.";
  } catch (e) {
    uploadStatus.textContent = "Upload failed — " + e.message;
  }
}

function renderThumbs() {
  if (!thumbs) return;
  thumbs.innerHTML = state.data.images.map((im, i) => \`
    <div class="thumb">
      <img src="\${im.url}" alt="" />
      <button class="thumb-remove" data-idx="\${i}" aria-label="Remove">×</button>
    </div>
  \`).join("");
  thumbs.querySelectorAll(".thumb-remove").forEach(btn => btn.addEventListener("click", async (e) => {
    const i = Number(e.currentTarget.dataset.idx);
    state.data.images.splice(i, 1);
    renderThumbs();
    // Persist removal
    await fetch("/api/listings/" + state.listingId, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-edit-token": state.editToken },
      body: JSON.stringify({ images: state.data.images }),
    });
  }));
}

// ── Review screen ───────────────────────────────────────────────────────────
function renderReview() {
  gatherData();
  const r = $("#review");
  if (!r) return;
  const a = state.data;
  const addr = [a.address_line, a.city, a.state, a.zip].filter(Boolean).join(", ") || "—";
  const price = a.price ? "$" + Number(a.price).toLocaleString() + (a.price_unit==="monthly"?"/mo":a.price_unit==="nightly"?"/night":a.price_unit==="annual"?"/yr":"") : "—";
  const photos = (a.images || []).slice(0,6).map(im => '<img src="' + im.url + '" />').join("");
  r.innerHTML = \`
    <div class="review-row"><b>Goal</b><span>\${a.goal} · \${a.template} template · plan: \${a.plan}</span></div>
    <div class="review-row"><b>Property</b><span>\${a.property_name || "—"}</span></div>
    <div class="review-row"><b>Address</b><span>\${addr}</span></div>
    <div class="review-row"><b>Price</b><span>\${price}</span></div>
    <div class="review-row"><b>Details</b><span>\${a.bedrooms||"?"} bed · \${a.bathrooms||"?"} bath · \${a.sqft||"?"} sqft · \${a.property_type||"—"}</span></div>
    <div class="review-row"><b>Features</b><span>\${(a.features||[]).join(", ") || "—"}</span></div>
    <div class="review-row"><b>Schedule</b><span>\${(a.schedule.days||[]).join(", ") || "—"} · \${a.schedule.window || "—"}</span></div>
    <div class="review-row"><b>Contact</b><span>\${a.contact_name || "—"} · \${a.contact_email || "—"}\${a.contact_phone ? " · " + a.contact_phone : ""}</span></div>
    <div class="review-row"><b>Photos</b><div class="review-photos">\${photos || "—"}</div></div>
  \`;
}

// ── Generate preview ────────────────────────────────────────────────────────
$("#generateBtn") && $("#generateBtn").addEventListener("click", async () => {
  gatherData();
  await ensureListing();
  // Push the latest data
  const r = await fetch("/api/listings/" + state.listingId, {
    method: "PATCH",
    headers: { "content-type": "application/json", "x-edit-token": state.editToken },
    body: JSON.stringify(state.data),
  });
  if (!r.ok) {
    const err = await r.json().catch(()=>({}));
    return toast("Couldn't save: " + (err.error || r.statusText));
  }
  // Redirect to preview with edit token so the owner can keep editing
  location.href = "/preview/" + state.listingId + "?t=" + state.editToken;
});

showStep(1);
  `;
}
