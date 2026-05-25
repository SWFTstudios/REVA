// Landlord dashboard — listing overview, inquiries, showings, export.

import { layout, escapeHtml as esc } from "./layout.js";
import { renderSwftNav, swftCss } from "./swft-theme.js";
import { intakeSummaryLabels } from "../intake-routing.js";

export function renderDashboard({ listing, inquiries, showings, appUrl, env = {} }) {
  const l = listing;
  const fullAddress = [l.address_line, l.city, l.state, l.zip].filter(Boolean).join(", ");
  const isPublished = l.status === "published";
  const token = l.edit_token || "";
  const newInquiries = inquiries.filter((i) => {
    const d = new Date((i.created_at || "").replace(" ", "T") + "Z");
    return Date.now() - d.getTime() < 1000 * 60 * 60 * 24 * 7;
  }).length;
  const pendingShowings = showings.filter((s) => s.status === "requested").length;
  const opts = l.intake_options || {};
  const labels = intakeSummaryLabels(opts);
  const csvUrl = `/api/listings/${l.id}/inquiries/export.csv?t=${encodeURIComponent(token)}`;
  const airtableUrl = env.AIRTABLE_VIEW_URL || "https://airtable.com/appx3jGQIAp1lzwW0/shroRmEse80QK8gKz";
  const showAirtable = opts.listing_management === "swft" || opts.inquiry_delivery === "airtable";
  const showCsv = true;

  const body = /* html */ `
${renderSwftNav({ appUrl })}
<div class="owner-bar">
  <div class="owner-bar-left">
    <b>Dashboard</b>
    <span class="owner-bar-sep">·</span>
    <span>${esc(l.property_name || fullAddress || "Listing")}</span>
    <span class="${isPublished ? "pill pill-live" : "pill pill-draft"}" style="margin-left:8px;">${isPublished ? "Live" : "Draft"}</span>
  </div>
  <div class="owner-bar-right">
    <a class="btn btn-ghost" href="/preview/${l.id}?t=${esc(token)}">View listing</a>
    <a class="btn btn-ghost" href="/#intake">Edit</a>
    ${isPublished ? "" : `<button class="btn btn-accent" id="publishBtn">Publish →</button>`}
  </div>
</div>

<main class="dash">
  <section class="dash-hero">
    <div class="dash-hero-stats">
      <div class="stat"><b>${inquiries.length}</b><span>inquiries</span></div>
      <div class="stat"><b>${newInquiries}</b><span>this week</span></div>
      <div class="stat"><b>${showings.length}</b><span>showings</span></div>
      <div class="stat"><b>${pendingShowings}</b><span>pending</span></div>
    </div>
    <div class="dash-hero-share">
      <h2>Your listing</h2>
      <div class="share-row">
        <input type="text" readonly value="${esc(appUrl || "")}/preview/${l.id}" id="shareUrl" />
        <button class="btn btn-dark" id="copyBtn">Copy link</button>
      </div>
      <div class="intake-summary">
        <p><b>Listing:</b> ${esc(labels.listing)}</p>
        <p><b>Showings:</b> ${esc(labels.showing)}</p>
        <p><b>Inquiries:</b> ${esc(labels.inquiries)}</p>
      </div>
      <div class="dash-actions-row">
        ${showCsv ? `<a class="btn btn-ghost" href="${esc(csvUrl)}">Export CSV</a>` : ""}
        ${showAirtable ? `<a class="btn btn-ghost" href="${esc(airtableUrl)}" target="_blank" rel="noopener">Open Airtable</a>` : ""}
      </div>
      <p class="hint">REVA answers questions on your listing page 24/7.</p>
    </div>
  </section>

  <section class="dash-section">
    <div class="dash-section-head"><h2>Inquiries</h2><span class="hint">${inquiries.length} total</span></div>
    ${inquiries.length === 0 ? `<div class="empty">No inquiries yet — share your listing link.</div>` : `
    <table class="dash-table">
      <thead><tr><th>When</th><th>Source</th><th>Name</th><th>Contact</th><th>Message</th></tr></thead>
      <tbody>
        ${inquiries.map((i) => `
        <tr>
          <td class="muted">${esc(formatWhen(i.created_at))}</td>
          <td><span class="src src-${esc(i.source || "form")}">${esc(i.source || "form")}</span></td>
          <td>${esc(i.prospect_name || "—")}</td>
          <td>${i.prospect_email ? `<a href="mailto:${esc(i.prospect_email)}">${esc(i.prospect_email)}</a>` : ""}${i.prospect_phone ? `<br><a href="tel:${esc(i.prospect_phone)}">${esc(i.prospect_phone)}</a>` : ""}</td>
          <td class="msg-cell">${esc(i.message || "—")}</td>
        </tr>`).join("")}
      </tbody>
    </table>`}
  </section>

  <section class="dash-section">
    <div class="dash-section-head"><h2>Showings</h2><span class="hint">${showings.length} total</span></div>
    ${showings.length === 0 ? `<div class="empty">No showing requests yet.</div>` : `
    <table class="dash-table">
      <thead><tr><th>When</th><th>Name</th><th>Time</th><th>Contact</th><th>Status</th><th>Notes</th></tr></thead>
      <tbody>
        ${showings.map((s) => `
        <tr>
          <td class="muted">${esc(formatWhen(s.created_at))}</td>
          <td>${esc(s.prospect_name || "—")}</td>
          <td><b>${esc(s.scheduled_for || "—")}</b></td>
          <td>${s.prospect_email ? `<a href="mailto:${esc(s.prospect_email)}">${esc(s.prospect_email)}</a>` : ""}</td>
          <td><span class="src src-${esc(s.status || "requested")}">${esc(s.status || "requested")}</span></td>
          <td class="msg-cell">${esc(s.notes || "—")}</td>
        </tr>`).join("")}
      </tbody>
    </table>`}
  </section>
</main>
`;

  return layout({
    title: `Dashboard — ${l.property_name || fullAddress || "Listing"} · SWFT`,
    body,
    appUrl,
    bodyClass: "swft-body",
    extraHead: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />`,
    extraCss: swftCss() + dashboardCss(),
    extraScript: dashboardScript({ listingId: l.id }),
  });
}

function planBasePrice(plan) {
  if (plan === "pro") return 149;
  if (plan === "portfolio") return 299;
  return 79;
}

function formatWhen(ts) {
  if (!ts) return "—";
  try {
    const d = new Date(ts.replace(" ", "T") + "Z");
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return ts;
  }
}

function dashboardCss() {
  return /* css */ `
.dash { max-width: 1200px; margin: 0 auto; padding: 32px 24px 80px; }
.dash-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
@media (max-width: 900px) { .dash-hero { grid-template-columns: 1fr; } }
.dash-hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; background: var(--white-smoke); border-radius: 18px; padding: 24px; }
.stat b { font-size: 36px; font-weight: 700; display: block; }
.stat span { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.06em; }
.dash-hero-share { background: #000; color: #fff; border-radius: 18px; padding: 28px; }
.dash-hero-share h2 { font-size: 22px; margin-bottom: 14px; }
.share-row { display: flex; gap: 8px; margin-bottom: 16px; }
.share-row input { flex: 1; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; font-size: 13px; }
.intake-summary { font-size: 14px; line-height: 1.6; margin-bottom: 16px; color: rgba(255,255,255,0.85); }
.intake-summary p { margin: 4px 0; }
.dash-actions-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.dash-hero-share .hint { color: rgba(255,255,255,0.55); font-size: 13px; }
.dash-section { margin-bottom: 48px; }
.dash-section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
.dash-section-head h2 { font-size: 24px; font-weight: 700; }
.dash-section-head .hint { color: #666; font-size: 13px; }
.empty { background: var(--white-smoke); padding: 32px; text-align: center; color: #666; border-radius: 12px; }
.dash-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.dash-table th, .dash-table td { padding: 12px 14px; text-align: left; font-size: 14px; border-bottom: 1px solid rgba(0,0,0,0.06); }
.dash-table th { font-size: 11px; text-transform: uppercase; color: #666; background: var(--white-smoke); }
.dash-table .muted { color: #888; white-space: nowrap; }
.dash-table .msg-cell { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.src { font-size: 11px; padding: 3px 8px; border-radius: 999px; font-weight: 600; text-transform: uppercase; }
.src-form { background: #eee; }
.src-reva { background: #f3e5f5; color: #6a1b9a; }
  `;
}

function dashboardScript({ listingId }) {
  return /* js */ `
document.getElementById("copyBtn")?.addEventListener("click", async () => {
  const input = document.getElementById("shareUrl");
  try {
    await navigator.clipboard.writeText(input.value);
    document.getElementById("copyBtn").textContent = "Copied!";
  } catch {
    input.select();
    document.execCommand("copy");
  }
});
document.getElementById("publishBtn")?.addEventListener("click", async () => {
  const btn = document.getElementById("publishBtn");
  btn.disabled = true;
  const r = await fetch("/api/listings/${listingId}/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  if (!r.ok) { btn.disabled = false; alert("Checkout failed"); return; }
  const j = await r.json();
  if (j.url) location.href = j.url;
});
  `;
}
