// Landing page — SWFT-inspired aesthetic
// Clean white space, large hero, restrained typography, warm accents.

import { layout, escapeHtml as esc } from "./layout.js";

export function renderLanding({ appUrl }) {
  const body = /* html */ `
<header class="nav">
  <a href="/" class="brand">
    <span class="brand-mark"></span>
    <span class="brand-text">ListFast</span>
  </a>
  <nav class="nav-links">
    <a href="#how">How it works</a>
    <a href="#pricing">Pricing</a>
    <a href="#examples">Examples</a>
    <a href="#faq">FAQ</a>
  </nav>
  <a class="btn btn-dark" href="/onboard">Start your listing →</a>
</header>

<section class="hero">
  <div class="hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">Property pages, done same day</span>
      <h1>Every day it sits vacant, you're losing money.</h1>
      <p class="lede">
        Upload your photos, fill in the details, and have a professional listing page live today —
        in 30 minutes or less. No designer. No developer. No waiting.
      </p>
      <div class="hero-ctas">
        <a class="btn btn-dark btn-lg" href="/onboard">Start your listing →</a>
        <a class="btn btn-ghost btn-lg" href="#examples">See examples</a>
      </div>
      <ul class="hero-stats">
        <li><b>30 min</b><span>From sign-up to live preview</span></li>
        <li><b>REVA</b><span>AI assistant manages inquiries</span></li>
        <li><b>$79</b><span>Starts from, no contract</span></li>
      </ul>
    </div>
    <div class="hero-art">
      <div class="hero-photo">
        <img alt="Modern home" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80" />
      </div>
      <div class="hero-card">
        <div class="hero-card-pill">live in 28 min</div>
        <div class="hero-card-title">451 Heath St</div>
        <div class="hero-card-meta">3 bd · 2 ba · $3,200/mo</div>
        <div class="hero-card-reva">
          <span class="reva-dot"></span>
          REVA replied to 4 new inquiries today
        </div>
      </div>
    </div>
  </div>
</section>

<section class="strip">
  <div class="strip-inner">
    <span>Trusted by landlords, property managers, realtors &amp; investors</span>
    <div class="strip-logos">
      <span>SWFT Studios</span><span>Solomon Properties</span><span>Heath St Holdings</span><span>EK Capital</span>
    </div>
  </div>
</section>

<section id="how" class="section">
  <div class="section-head">
    <span class="eyebrow">How it works</span>
    <h2>Three steps. One link. Live today.</h2>
    <p class="section-sub">Pay once, get your branded property page, and let REVA handle inquiries for you.</p>
  </div>
  <div class="steps">
    <article class="step">
      <span class="step-num">01</span>
      <h3>Drag, drop, describe.</h3>
      <p>Bulk upload photos, files, and floor plans. Add address, price, beds, baths, and what makes it special.</p>
    </article>
    <article class="step">
      <span class="step-num">02</span>
      <h3>Pick a template &amp; vibe.</h3>
      <p>Choose from clean, editorial, or bold templates. Set your showing schedule and inquiry preferences.</p>
    </article>
    <article class="step">
      <span class="step-num">03</span>
      <h3>Preview, publish, profit.</h3>
      <p>We email a link to your live preview. Approve, pay, and it goes public the same day with REVA built in.</p>
    </article>
  </div>
</section>

<section id="reva" class="section reva-section">
  <div class="reva-grid">
    <div>
      <span class="eyebrow">Meet REVA</span>
      <h2>Your AI real estate assistant — included.</h2>
      <p class="lede">
        REVA lives on every property page. She answers questions, screens prospects, and books showings —
        24/7, while you sleep.
      </p>
      <ul class="reva-list">
        <li><span class="check">✓</span> Answers prospect questions from your listing details</li>
        <li><span class="check">✓</span> Books showings into your schedule</li>
        <li><span class="check">✓</span> Forwards qualified inquiries to your inbox</li>
        <li><span class="check">✓</span> Hands off cleanly when something needs a human</li>
      </ul>
    </div>
    <div class="reva-demo">
      <div class="chat-window">
        <div class="chat-header">
          <span class="reva-dot"></span> REVA · live on 451 Heath St
        </div>
        <div class="chat-body">
          <div class="msg msg-them">Hey — is this still available for August?</div>
          <div class="msg msg-me">Yes! Move-in is August 1. It's $3,200/month, 3-bed / 2-bath, with parking. Want me to book you a showing?</div>
          <div class="msg msg-them">Sure, Sat afternoon if possible.</div>
          <div class="msg msg-me">Saturday 2 PM works — what's the best email to send confirmation to?</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="examples" class="section">
  <div class="section-head">
    <span class="eyebrow">Recent work</span>
    <h2>Pages like the one you'll get.</h2>
    <p class="section-sub">Every listing is built on a battle-tested template, then customized to your property.</p>
  </div>
  <div class="examples">
    <a class="example" href="https://swftrealestatedemo.webflow.io/" target="_blank" rel="noopener">
      <div class="example-photo" style="background-image:url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80');"></div>
      <div class="example-meta">
        <div class="example-name">SWFT Demo · Multi-property template</div>
        <div class="example-sub">3-bd portfolio · 6 listings · custom domain</div>
      </div>
    </a>
    <a class="example" href="#" onclick="return false;">
      <div class="example-photo" style="background-image:url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80');"></div>
      <div class="example-meta">
        <div class="example-name">451 Heath St · Brookline, MA</div>
        <div class="example-sub">Quick List · 12 photos · REVA booked 9 showings</div>
      </div>
    </a>
    <a class="example" href="#" onclick="return false;">
      <div class="example-photo" style="background-image:url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80');"></div>
      <div class="example-meta">
        <div class="example-name">Solomon Lofts · Cambridge</div>
        <div class="example-sub">Pro List · Floor plans + application form</div>
      </div>
    </a>
  </div>
</section>

<section id="pricing" class="section pricing-section">
  <div class="section-head">
    <span class="eyebrow">Pricing</span>
    <h2>Flat fee. No long contracts. No surprises.</h2>
  </div>
  <div class="pricing">
    <article class="plan">
      <header><h3>Quick List</h3><span class="plan-pill">Most popular</span></header>
      <div class="plan-price"><b>$79</b><span>one-time setup</span></div>
      <div class="plan-sub">+ $29/mo hosting · cancel anytime</div>
      <ul>
        <li>1 property page, live in 30 min</li>
        <li>Up to 8 photos</li>
        <li>REVA AI chat &amp; inquiry inbox</li>
        <li>Showing scheduler</li>
        <li>Mobile-optimized, on-page SEO</li>
      </ul>
      <a class="btn btn-dark btn-block" href="/onboard?plan=quick">Start Quick List →</a>
    </article>
    <article class="plan plan-featured">
      <header><h3>Pro List</h3><span class="plan-pill plan-pill-gold">Best for realtors</span></header>
      <div class="plan-price"><b>$149</b><span>one-time setup</span></div>
      <div class="plan-sub">+ $49/mo hosting · cancel anytime</div>
      <ul>
        <li>Everything in Quick List</li>
        <li>Unlimited photos &amp; floor plans</li>
        <li>Application form &amp; pre-screening</li>
        <li>Custom domain</li>
        <li>Virtual tour embed</li>
        <li>Priority same-day edits</li>
      </ul>
      <a class="btn btn-dark btn-block" href="/onboard?plan=pro">Start Pro List →</a>
    </article>
    <article class="plan">
      <header><h3>Portfolio</h3><span class="plan-pill">Volume</span></header>
      <div class="plan-price"><b>$299</b><span>per month</span></div>
      <div class="plan-sub">Up to 10 active listings · no setup fee</div>
      <ul>
        <li>Up to 10 property pages</li>
        <li>Shared REVA across all listings</li>
        <li>Unified inquiry dashboard</li>
        <li>Bulk publish &amp; rotate</li>
        <li>Dedicated onboarding</li>
      </ul>
      <a class="btn btn-dark btn-block" href="/onboard?plan=portfolio">Start Portfolio →</a>
    </article>
  </div>
  <p class="addons">
    Add-ons: Rush delivery +$49 · Extra listing +$49 · E-signature +$19/mo · Social media pack +$29 · Virtual tour embed +$29
  </p>
</section>

<section class="cta">
  <div class="cta-inner">
    <h2>Your property could be live by dinner.</h2>
    <p>Start the upload, see your preview in minutes, decide if you love it before you pay.</p>
    <a class="btn btn-light btn-lg" href="/onboard">Start your listing →</a>
  </div>
</section>

<section id="faq" class="section">
  <div class="section-head">
    <span class="eyebrow">FAQ</span>
    <h2>Common questions.</h2>
  </div>
  <div class="faq">
    <details><summary>How fast is "same day"?</summary><p>Most listings go from sign-up to live preview in under 30 minutes. We text and email you the link the moment it's ready.</p></details>
    <details><summary>Do I need to write the description?</summary><p>No — paste rough notes and we'll polish it. Or generate a copy draft right inside the wizard, free.</p></details>
    <details><summary>Can I edit it after publishing?</summary><p>Yes. You get a private dashboard link to update photos, copy, schedule, and pricing anytime.</p></details>
    <details><summary>What is REVA?</summary><p>REVA is the AI assistant embedded on your property page. She answers prospect questions using only your listing details, books showings, and forwards qualified leads to your inbox.</p></details>
    <details><summary>Can I use my own domain?</summary><p>Yes — Pro List and Portfolio include custom domains (e.g., 451heath.com → your listing).</p></details>
    <details><summary>How does payment work?</summary><p>Setup fee is one-time. Hosting is monthly and you can cancel anytime. All payments are processed by Stripe.</p></details>
    <details><summary>What if I have 5+ properties?</summary><p>Portfolio plan handles up to 10. More than that? Email <a href="mailto:elombe@swftstudios.com">elombe@swftstudios.com</a> for volume pricing.</p></details>
  </div>
</section>

<footer class="foot">
  <div class="foot-inner">
    <div>
      <a href="/" class="brand"><span class="brand-mark"></span> ListFast</a>
      <p class="foot-tag">List it fast. Host it anywhere.</p>
    </div>
    <div class="foot-cols">
      <div>
        <h4>Product</h4>
        <a href="/onboard">Start a listing</a>
        <a href="#pricing">Pricing</a>
        <a href="#examples">Examples</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="mailto:elombe@swftstudios.com">Contact</a>
        <a href="#faq">FAQ</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
      </div>
    </div>
  </div>
  <div class="foot-bottom">© ${new Date().getFullYear()} ListFast · A SWFT Studios product</div>
</footer>
  `;
  return layout({
    title: "ListFast — Your property, live today",
    description:
      "Upload photos, fill in details, and have a professional listing page live in 30 minutes. REVA, your AI assistant, handles inquiries 24/7.",
    body,
    appUrl,
    extraCss: landingCss(),
  });
}

function landingCss() {
  return /* css */ `
.nav { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 18px 40px; background: rgba(252,251,248,0.85); backdrop-filter: saturate(180%) blur(12px); border-bottom: 1px solid rgba(20,20,20,0.06); }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: -0.01em; font-size: 18px; color: var(--ink); text-decoration: none; }
.brand-mark { width: 26px; height: 26px; border-radius: 8px; background: var(--ink); position: relative; }
.brand-mark::after { content:""; position:absolute; inset:7px; border-radius:3px; background: var(--accent); }
.nav-links { display: flex; gap: 28px; }
.nav-links a { color: rgba(20,20,20,0.7); text-decoration: none; font-size: 14px; font-weight: 500; }
.nav-links a:hover { color: var(--ink); }
@media (max-width: 800px) { .nav-links { display: none; } .nav { padding: 16px 20px; } }

.hero { padding: 88px 40px 60px; }
.hero-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center; }
@media (max-width: 980px) { .hero { padding: 56px 20px 40px; } .hero-grid { grid-template-columns: 1fr; gap: 40px; } }
.eyebrow { display: inline-block; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(20,20,20,0.55); margin-bottom: 18px; font-weight: 600; }
.hero h1 { font-family: var(--serif); font-size: clamp(40px, 5.6vw, 76px); line-height: 1.02; letter-spacing: -0.02em; margin-bottom: 24px; }
.lede { font-size: 19px; line-height: 1.55; color: rgba(20,20,20,0.7); max-width: 56ch; margin-bottom: 32px; }
.hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 44px; }
.hero-stats { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 480px; }
.hero-stats li { display: flex; flex-direction: column; gap: 4px; border-left: 2px solid var(--accent); padding-left: 14px; }
.hero-stats b { font-family: var(--serif); font-size: 22px; }
.hero-stats span { font-size: 12px; color: rgba(20,20,20,0.6); }

.hero-art { position: relative; aspect-ratio: 4 / 5; max-height: 640px; }
.hero-photo { position: absolute; inset: 0; border-radius: 18px; overflow: hidden; box-shadow: 0 30px 80px -30px rgba(20,20,20,0.35); }
.hero-photo img { width: 100%; height: 100%; object-fit: cover; }
.hero-card { position: absolute; bottom: -28px; left: -28px; background: var(--paper); padding: 18px 22px; border-radius: 14px; box-shadow: 0 20px 60px -20px rgba(20,20,20,0.3); min-width: 240px; }
.hero-card-pill { display: inline-block; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-ink); background: var(--accent); padding: 4px 10px; border-radius: 999px; margin-bottom: 10px; font-weight: 700; }
.hero-card-title { font-family: var(--serif); font-size: 20px; }
.hero-card-meta { font-size: 13px; color: rgba(20,20,20,0.6); margin-top: 2px; }
.hero-card-reva { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(20,20,20,0.08); font-size: 12px; display: flex; align-items: center; gap: 8px; color: rgba(20,20,20,0.7); }
.reva-dot { width: 8px; height: 8px; border-radius: 50%; background: #21c374; box-shadow: 0 0 0 4px rgba(33,195,116,0.18); }

.strip { background: var(--ink); color: rgba(252,251,248,0.7); padding: 18px 40px; }
.strip-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; font-size: 13px; }
.strip-logos { display: flex; gap: 28px; flex-wrap: wrap; font-weight: 500; color: rgba(252,251,248,0.85); }

.section { padding: 100px 40px; max-width: 1280px; margin: 0 auto; }
@media (max-width: 700px) { .section { padding: 64px 20px; } }
.section-head { max-width: 720px; margin: 0 auto 56px; text-align: center; }
.section-head h2 { font-family: var(--serif); font-size: clamp(32px, 4vw, 52px); line-height: 1.08; letter-spacing: -0.02em; }
.section-sub { font-size: 17px; color: rgba(20,20,20,0.65); margin-top: 16px; line-height: 1.55; }

.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
@media (max-width: 900px) { .steps { grid-template-columns: 1fr; } }
.step { padding: 36px 28px; background: var(--paper); border: 1px solid rgba(20,20,20,0.08); border-radius: 18px; }
.step-num { font-family: var(--serif); font-size: 14px; color: var(--accent-ink); background: var(--accent); padding: 4px 10px; border-radius: 999px; font-weight: 700; }
.step h3 { font-family: var(--serif); font-size: 26px; line-height: 1.15; margin: 22px 0 10px; }
.step p { color: rgba(20,20,20,0.7); line-height: 1.55; }

.reva-section { background: var(--ink); color: var(--paper); border-radius: 28px; }
.reva-section .eyebrow { color: var(--accent); }
.reva-section .lede { color: rgba(252,251,248,0.75); }
.reva-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
@media (max-width: 900px) { .reva-grid { grid-template-columns: 1fr; } }
.reva-list { list-style: none; margin-top: 24px; display: grid; gap: 14px; }
.reva-list li { display: flex; align-items: flex-start; gap: 12px; color: rgba(252,251,248,0.85); font-size: 16px; }
.check { color: var(--accent); font-weight: 700; }
.chat-window { background: var(--paper); color: var(--ink); border-radius: 18px; overflow: hidden; box-shadow: 0 40px 100px -30px rgba(0,0,0,0.5); }
.chat-header { padding: 14px 18px; border-bottom: 1px solid rgba(20,20,20,0.08); font-size: 13px; display: flex; align-items: center; gap: 10px; font-weight: 600; }
.chat-body { padding: 22px; display: flex; flex-direction: column; gap: 12px; }
.msg { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.45; }
.msg-them { background: rgba(20,20,20,0.06); border-bottom-left-radius: 4px; align-self: flex-start; }
.msg-me { background: var(--ink); color: var(--paper); border-bottom-right-radius: 4px; align-self: flex-end; }

.examples { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 900px) { .examples { grid-template-columns: 1fr; } }
.example { display: block; text-decoration: none; color: var(--ink); border-radius: 18px; overflow: hidden; border: 1px solid rgba(20,20,20,0.08); transition: transform .25s ease, box-shadow .25s ease; }
.example:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -30px rgba(20,20,20,0.3); }
.example-photo { aspect-ratio: 4 / 3; background-size: cover; background-position: center; }
.example-meta { padding: 18px 20px; }
.example-name { font-family: var(--serif); font-size: 18px; }
.example-sub { font-size: 13px; color: rgba(20,20,20,0.6); margin-top: 4px; }

.pricing-section { }
.pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 900px) { .pricing { grid-template-columns: 1fr; } }
.plan { display: flex; flex-direction: column; padding: 32px 28px; background: var(--paper); border: 1px solid rgba(20,20,20,0.08); border-radius: 20px; }
.plan-featured { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.plan-featured .plan-sub, .plan-featured ul li { color: rgba(252,251,248,0.78); }
.plan header { display: flex; justify-content: space-between; align-items: center; }
.plan h3 { font-family: var(--serif); font-size: 24px; }
.plan-pill { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(20,20,20,0.08); padding: 4px 10px; border-radius: 999px; font-weight: 700; }
.plan-pill-gold { background: var(--accent); color: var(--accent-ink); }
.plan-featured .plan-pill { background: rgba(252,251,248,0.15); color: rgba(252,251,248,0.9); }
.plan-featured .plan-pill-gold { background: var(--accent); color: var(--accent-ink); }
.plan-price { margin: 24px 0 6px; display: flex; align-items: baseline; gap: 8px; }
.plan-price b { font-family: var(--serif); font-size: 52px; line-height: 1; letter-spacing: -0.02em; }
.plan-price span { font-size: 13px; color: rgba(20,20,20,0.6); }
.plan-featured .plan-price span { color: rgba(252,251,248,0.6); }
.plan-sub { font-size: 13px; color: rgba(20,20,20,0.6); margin-bottom: 24px; }
.plan ul { list-style: none; margin-bottom: 28px; display: grid; gap: 10px; flex: 1; }
.plan ul li { font-size: 14px; line-height: 1.4; color: rgba(20,20,20,0.78); padding-left: 18px; position: relative; }
.plan ul li::before { content: "✓"; position: absolute; left: 0; color: var(--accent-ink); font-weight: 700; }
.plan-featured ul li::before { color: var(--accent); }
.addons { text-align: center; margin-top: 36px; font-size: 13px; color: rgba(20,20,20,0.6); }

.cta { padding: 100px 40px; background: var(--accent); color: var(--accent-ink); }
.cta-inner { max-width: 720px; margin: 0 auto; text-align: center; }
.cta h2 { font-family: var(--serif); font-size: clamp(34px, 4.5vw, 56px); line-height: 1.05; letter-spacing: -0.02em; }
.cta p { font-size: 18px; margin: 18px auto 32px; opacity: 0.8; }

.faq { max-width: 760px; margin: 0 auto; }
.faq details { padding: 22px 4px; border-bottom: 1px solid rgba(20,20,20,0.1); }
.faq summary { cursor: pointer; font-weight: 600; font-size: 17px; list-style: none; display: flex; justify-content: space-between; align-items: center; }
.faq summary::after { content: "+"; font-weight: 400; font-size: 24px; }
.faq details[open] summary::after { content: "−"; }
.faq p { padding-top: 12px; color: rgba(20,20,20,0.7); line-height: 1.55; }

.foot { background: var(--ink); color: rgba(252,251,248,0.7); padding: 72px 40px 24px; }
.foot-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 2fr; gap: 48px; }
@media (max-width: 800px) { .foot-inner { grid-template-columns: 1fr; } }
.foot .brand { color: var(--paper); }
.foot-tag { margin-top: 12px; font-size: 14px; }
.foot-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.foot-cols h4 { color: var(--paper); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px; }
.foot-cols a { display: block; color: rgba(252,251,248,0.7); text-decoration: none; padding: 4px 0; font-size: 14px; }
.foot-cols a:hover { color: var(--paper); }
.foot-bottom { max-width: 1280px; margin: 56px auto 0; padding-top: 24px; border-top: 1px solid rgba(252,251,248,0.12); font-size: 13px; color: rgba(252,251,248,0.5); }
  `;
}
