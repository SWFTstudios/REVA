// SWFT Real Estate — shared theme ported from swftrealestatedemo.webflow

import { escapeHtml as esc, layout } from "./layout.js";

export const MARKET_STATUS = {
  for_sale: { label: "For Sale", className: "badge-sale" },
  sold: { label: "Sold", className: "badge-sold" },
  for_rent: { label: "For Rent", className: "badge-rent" },
  rented: { label: "Rented", className: "badge-rented" },
};

export function formatPrice(listing) {
  if (!listing.price) return "Inquire";
  const n = Number(listing.price);
  const formatted = n >= 1000 ? "$" + n.toLocaleString() : "$" + n;
  if (listing.marketStatus === "rented" && listing.priceStrikethrough) {
    return `<span class="price-struck">${esc(formatted)}</span> Rented`;
  }
  const unit = listing.priceUnit === "monthly" ? "/mo" : listing.priceUnit === "total" ? "" : listing.priceUnit === "annual" ? "/yr" : "";
  return esc(formatted + unit);
}

export function assetUrl(path) {
  return "/assets/swft/" + path.replace(/^\//, "");
}

export function renderStatusBadge(marketStatus) {
  const meta = MARKET_STATUS[marketStatus] || MARKET_STATUS.for_rent;
  return `<span class="status-badge ${meta.className}">${esc(meta.label)}</span>`;
}

export function renderPropertyCard(listing, { linkPrefix = "/properties" } = {}) {
  const href = `${linkPrefix}/${esc(listing.slug)}`;
  const img = esc(listing.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80");
  return /* html */ `
<a href="${href}" class="property-card">
  <div class="property-image-wrap">
    <img src="${img}" alt="${esc(listing.title)}" class="property-image" loading="lazy" />
    <div class="card-badge-wrap">${renderStatusBadge(listing.marketStatus)}</div>
  </div>
  <div class="property-content">
    <h5>${esc(listing.title)}</h5>
    <div class="property-subline">${esc(listing.city)}, ${esc(listing.state)} · ${formatPrice(listing)}</div>
  </div>
  <div class="room-feature-grid">
    <div class="feature"><img src="${assetUrl("images/Bed.svg")}" alt="" class="feature-icon" />${listing.bedrooms ?? "—"}</div>
    <div class="feature centre-lines"><img src="${assetUrl("images/Shower.svg")}" alt="" class="feature-icon" />${listing.bathrooms ?? "—"}</div>
    <div class="feature"><img src="${assetUrl("images/Size.svg")}" alt="" class="feature-icon" />${listing.sqft ? Number(listing.sqft).toLocaleString() + " sqft" : "—"}</div>
  </div>
</a>`;
}

export function renderSwftNav({ active = "home", appUrl = "/" }) {
  const homeActive = active === "home" ? " nav-active" : "";
  const propsActive = active === "properties" ? " nav-active" : "";
  return /* html */ `
<div class="swft-nav-wrap">
  <div data-collapse="medium" class="navigation">
    <div class="navigation-container">
      <a href="${esc(appUrl || "/")}" class="brand swft-brand">
        <span class="swft-logo-text">SWFT</span>
        <span class="swft-logo-sub">Real Estate</span>
      </a>
      <button type="button" class="nav-toggle" aria-label="Menu" id="navToggle">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-menu" id="navMenu">
        <a href="/" class="nav-link-plain${homeActive}">Home</a>
        <a href="/properties" class="nav-link-plain${propsActive}">Properties</a>
        <a href="mailto:elombe@swftstudios.com" class="nav-link-plain">Contact</a>
        <a href="/onboard" class="button nav-cta">
          <span class="button-text">List your property</span>
          <img src="${assetUrl("images/Arrow-White.svg")}" alt="" class="nav-arrow" />
        </a>
      </nav>
    </div>
  </div>
</div>`;
}

export function renderSwftFooter() {
  return /* html */ `
<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <h2 class="heading-2">Leverage AI to automate and personalize your <span class="text-span">Real Estate</span> business</h2>
      <div class="footer-wrapper">
        <a href="/onboard" class="button">
          <span class="button-text">List your property</span>
          <img src="${assetUrl("images/Arrow-White.svg")}" alt="" class="nav-arrow" />
        </a>
      </div>
    </div>
    <div class="footer-bottom-row">
      <p>© ${new Date().getFullYear()} SWFT Studios · <a href="mailto:elombe@swftstudios.com">elombe@swftstudios.com</a></p>
      <div class="footer-social">
        <a href="#" aria-label="Facebook"><img src="${assetUrl("images/001-facebook.svg")}" alt="" /></a>
        <a href="#" aria-label="Twitter"><img src="${assetUrl("images/003-twitter.svg")}" alt="" /></a>
        <a href="#" aria-label="Instagram"><img src="${assetUrl("images/004-instagram.svg")}" alt="" /></a>
      </div>
    </div>
  </div>
</footer>`;
}

export function renderSwftPage({ title, description = "", body, extraCss = "", extraScript = "", appUrl = "" }) {
  return layout({
    title,
    description,
    body,
    appUrl,
    bodyClass: "swft-body",
    extraHead: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />`,
    extraCss: swftCss() + extraCss,
    extraScript: swftNavScript() + (extraScript || ""),
  });
}

export function swftNavScript() {
  return /* js */ `
document.getElementById("navToggle")?.addEventListener("click", () => {
  document.getElementById("navMenu")?.classList.toggle("open");
});
`;
}

export function swftCss() {
  return /* css */ `
.swft-body, .swft-body body { font-family: 'DM Sans', system-ui, sans-serif; color: #333; background: #fff; }
.swft-body { --orange: #b371ad; --white-smoke: whitesmoke; }

.container { width: 100%; max-width: 1140px; margin: 0 auto; padding: 0 24px; }
.container-large { max-width: 1420px; margin: 0 auto; padding: 0 24px; }

/* Nav */
.swft-nav-wrap { position: relative; z-index: 100; }
.navigation { background: #000; padding: 16px 4%; }
.navigation-container { display: flex; align-items: center; justify-content: space-between; max-width: 1140px; margin: 0 auto; gap: 16px; }
.swft-brand { display: flex; flex-direction: column; text-decoration: none; line-height: 1.1; }
.swft-logo-text { color: #fff; font-size: 22px; font-weight: 700; letter-spacing: -0.04em; }
.swft-logo-sub { color: var(--orange); font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; }
.nav-menu { display: flex; align-items: center; gap: 28px; }
.nav-link-plain { color: #fff; font-size: 15px; font-weight: 500; text-decoration: none; opacity: 0.85; }
.nav-link-plain:hover, .nav-link-plain.nav-active { opacity: 1; color: #fff; }
.nav-toggle { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 8px; }
.nav-toggle span { display: block; width: 22px; height: 2px; background: #fff; }
.button { background: var(--orange); color: #fff; border-radius: 0 20px 0 0; padding: 14px 22px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: none; cursor: pointer; font-size: 14px; }
.button:hover { filter: brightness(1.05); }
.nav-cta { margin-left: 8px; }
.nav-arrow { width: 14px; height: 14px; }
@media (max-width: 768px) {
  .nav-toggle { display: flex; }
  .nav-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; background: #000; flex-direction: column; padding: 20px 4% 28px; gap: 16px; }
  .nav-menu.open { display: flex; }
  .nav-cta { margin-left: 0; width: 100%; justify-content: center; }
}

/* Notice */
.notice { background: #000; padding: 14px 4%; text-align: center; }
.notice-wrap { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
.notice-badge { background: var(--orange); color: #fff; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
.notice-text { color: #fff; font-size: 14px; }

/* Hero slider section */
.slider-section { position: relative; background: #111; min-height: 85vh; display: flex; flex-direction: column; }
.slider-content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 120px 4% 200px; position: relative; z-index: 2; }
.display-heading { color: #fff; font-size: clamp(42px, 7vw, 70px); font-weight: 700; line-height: 0.95; letter-spacing: -0.04em; max-width: 560px; margin: 0 0 22px; }
.hero-paragraph { color: rgba(255,255,255,0.6); font-size: 18px; max-width: 520px; line-height: 1.5; margin: 0; }
.hero-block { background: #fff; border-top-right-radius: 35px; padding: 40px 48px; max-width: 1140px; margin: 0 auto; width: calc(100% - 8%); position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); z-index: 3; }
.hero-block a { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 500; color: #000; text-decoration: none; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.55; }
.hero-bg-2 { background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80'); }
@media (max-width: 768px) { .hero-block { position: relative; transform: none; left: auto; width: 100%; border-radius: 0; padding: 28px 24px; } .slider-section { min-height: auto; } }

/* Property section */
.property-section { background: var(--white-smoke); padding: 80px 4%; }
.title-wrap { margin-bottom: 48px; }
.title-wrap h2 { font-size: clamp(32px, 5vw, 50px); font-weight: 700; letter-spacing: -0.04em; margin: 0; color: #000; }
.title-line { background: var(--orange); border-radius: 20px; height: 4px; width: 170px; margin-bottom: 12px; }
.property-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.property-card { background: #fff; border-radius: 15px; overflow: hidden; box-shadow: 18px 18px 45px rgba(0,0,0,0.1); text-decoration: none; color: inherit; display: block; transition: transform 0.25s ease; }
.property-card:hover { transform: translateY(-4px); }
.property-image-wrap { height: 230px; position: relative; overflow: hidden; }
.property-image { width: 100%; height: 100%; object-fit: cover; }
.card-badge-wrap { position: absolute; top: 14px; left: 14px; }
.status-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 6px 12px; border-radius: 999px; }
.badge-sale { background: #e8f5e9; color: #1b5e20; }
.badge-sold { background: #eceff1; color: #546e7a; }
.badge-rent { background: #f3e5f5; color: #6a1b9a; }
.badge-rented { background: #efebe9; color: #5d4037; }
.property-content { padding: 24px; border-bottom: 1px solid rgba(0,0,0,0.1); }
.property-content h5 { margin: 0 0 8px; font-size: 22px; font-weight: 700; letter-spacing: -0.04em; color: #000; }
.property-subline { font-size: 14px; color: #666; }
.price-struck { text-decoration: line-through; opacity: 0.6; margin-right: 6px; }
.room-feature-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }
.feature { display: flex; align-items: center; justify-content: center; padding: 16px; font-size: 15px; font-weight: 700; color: #000; }
.feature.centre-lines { border-left: 1px solid rgba(0,0,0,0.1); border-right: 1px solid rgba(0,0,0,0.1); }
.feature-icon { width: 18px; height: 18px; margin-right: 6px; }

/* List swiftly panel */
.list-swiftly-section { padding: 80px 4%; background: #fff; }
.list-swiftly-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; max-width: 1140px; margin: 0 auto; }
.list-swiftly-form { background: var(--white-smoke); border-radius: 20px; padding: 36px; }
.list-swiftly-form h3 { font-size: 28px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.04em; }
.list-swiftly-form .form-hint { color: #666; font-size: 14px; margin-bottom: 24px; }
.ls-field { margin-bottom: 16px; }
.ls-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #333; }
.ls-field input, .ls-field select { width: 100%; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.12); border-radius: 10px; font: inherit; background: #fff; }
.ls-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.ls-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.button-dark { background: #000; color: #fff; padding: 16px 28px; border-radius: 0 20px 0 0; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; border: none; cursor: pointer; font-size: 15px; }
.button-dark:hover { background: #222; }
.button-outline { background: transparent; color: #000; border: 1px solid rgba(0,0,0,0.2); padding: 16px 24px; border-radius: 10px; font-weight: 500; cursor: pointer; font-size: 15px; }
.preview-panel-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #666; margin-bottom: 12px; font-weight: 600; }
@media (max-width: 900px) { .list-swiftly-grid { grid-template-columns: 1fr; } .ls-row { grid-template-columns: 1fr; } }

/* Content sections */
.content-section { padding: 100px 4%; position: relative; }
.content-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: center; max-width: 1140px; margin: 0 auto; }
.content-grid-reverse { grid-template-columns: 1fr 1.1fr; }
.content-image { width: 100%; border-radius: 8px; box-shadow: 0 62px 54px rgba(0,0,0,0.25); }
.content-h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 700; letter-spacing: -0.04em; margin: 0 0 24px; }
.paragraph-large { font-size: 18px; line-height: 1.55; color: #333; max-width: 520px; }
.content-section-dark { background: #000; padding: 100px 4%; text-align: center; }
.content-centre-wrap { max-width: 580px; margin: 0 auto; }
.content-section-dark .heading { color: #fff; font-size: clamp(28px, 4vw, 42px); margin-bottom: 24px; }
.paragraph-large-white { color: rgba(255,255,255,0.75); font-size: 18px; line-height: 1.55; margin-bottom: 32px; }
.text-span { color: var(--orange); }
.button-space { margin-top: 8px; }
@media (max-width: 900px) { .content-grid, .content-grid-reverse { grid-template-columns: 1fr; gap: 32px; } }

/* Testimonials */
.tabs-section { padding: 80px 4%; }
.tabs-inner { max-width: 1140px; margin: 0 auto; }
.tabs-menu-row { display: flex; flex-wrap: wrap; gap: 0; margin-bottom: 0; }
.tab-button { flex: 1; min-width: 180px; background: #fff; padding: 32px 28px; display: flex; align-items: center; border: 1px solid rgba(0,0,0,0.08); cursor: pointer; text-align: left; font: inherit; }
.tab-button.active { background: #000; color: #fff; }
.tab-button.active .avatar-type { color: rgba(255,255,255,0.6); }
.tab-button.active .avatar-name { color: #fff; }
.author-wrap { display: flex; align-items: center; gap: 10px; }
.avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--orange); object-fit: cover; }
.avatar-placeholder { width: 44px; height: 44px; border-radius: 50%; background: var(--orange); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px; }
.avatar-name { font-weight: 700; font-size: 16px; letter-spacing: -0.04em; }
.avatar-type { font-size: 14px; color: #979797; }
.tab-pane { display: none; padding: 48px 0 0; }
.tab-pane.active { display: block; }
.title-line-full { background: linear-gradient(275deg, #000, var(--orange)); height: 4px; border-radius: 20px; margin-bottom: 32px; }
.quote-text { font-size: clamp(20px, 3vw, 24px); font-weight: 700; line-height: 1.4; letter-spacing: -0.04em; color: #000; }

/* Filters */
.filter-block { background: #fff; border-radius: 20px; padding: 32px; margin-bottom: 40px; box-shadow: 8px 80px 55px -50px rgba(0,0,0,0.13); }
.filter-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.filter-row label { font-size: 13px; font-weight: 600; margin-right: 4px; }
.filter-row select { padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.12); font: inherit; min-width: 140px; }
.filter-reset { margin-left: auto; font-size: 13px; color: var(--orange); background: none; border: none; cursor: pointer; font-weight: 600; }

/* Detail page */
.header-dark { background: #000; color: #fff; padding: 48px 4% 32px; }
.property-title-wrap { display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; max-width: 1140px; margin: 0 auto; }
.property-detail-text { font-size: 28px; font-weight: 700; letter-spacing: -0.04em; }
.property-text-light { color: rgba(255,255,255,0.65); font-size: 16px; margin-top: 8px; }
.property-detail { padding: 48px 4% 80px; }
.detail-gallery { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 32px; max-width: 1140px; margin-left: auto; margin-right: auto; }
.detail-gallery-main { border-radius: 12px; overflow: hidden; aspect-ratio: 16/10; }
.detail-gallery-main img { width: 100%; height: 100%; object-fit: cover; }
.detail-gallery-thumbs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-gallery-thumbs img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; aspect-ratio: 4/3; }
.white-block { background: #fff; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); max-width: 1140px; margin-left: auto; margin-right: auto; }
.white-block h5 { font-size: 20px; font-weight: 700; margin: 0 0 20px; }
.room-features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; overflow: hidden; }
.detail-desc { line-height: 1.7; color: #444; font-size: 16px; }
.amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.amenity-item { padding: 12px 16px; background: var(--white-smoke); border-radius: 8px; font-size: 14px; font-weight: 500; }
.similar-section { padding: 60px 4%; background: var(--white-smoke); }
.inquiry-form input, .inquiry-form textarea { width: 100%; padding: 12px; border: 1px solid rgba(0,0,0,0.12); border-radius: 8px; margin-bottom: 12px; font: inherit; }
@media (max-width: 768px) { .detail-gallery { grid-template-columns: 1fr; } .room-features { grid-template-columns: 1fr 1fr; } }

/* Footer */
.footer { background: #000; padding: 80px 4% 40px; color: #fff; }
.footer .heading-2 { color: #fff; font-size: clamp(24px, 4vw, 36px); font-weight: 700; max-width: 520px; margin: 0 0 32px; line-height: 1.2; }
.footer-bottom-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.15); font-size: 14px; color: rgba(255,255,255,0.6); }
.footer-bottom-row a { color: var(--orange); }
.footer-social { display: flex; gap: 16px; }
.footer-social img { width: 20px; opacity: 0.7; }

.section-cta-row { text-align: center; margin-top: 32px; }
.see-all-link { color: var(--orange); font-weight: 600; font-size: 16px; text-decoration: none; }
.see-all-link:hover { text-decoration: underline; }
`;
}
