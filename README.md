# ListFast

Same-day hosted property listing pages with REVA, the AI real-estate assistant. Built on Cloudflare Workers + D1 + R2, payments by Stripe.

## What's in this repo

```
wrangler.toml          # Cloudflare Worker config (D1 + R2 bindings, env vars)
package.json           # npm scripts (dev / deploy / db:apply)
src/
  index.js             # Worker entry + router
  stripe.js            # Stripe REST helpers (Checkout Sessions, webhook verify)
  reva.js              # REVA chatbot — Anthropic Claude Haiku, with fallback
  schema.sql           # D1 schema (already applied)
  templates/
    layout.js          # Shared HTML shell + tokens
    landing.js         # Marketing site (SWFT-inspired)
    onboard.js         # 5-step upload wizard
    preview.js         # Property page template + REVA chat widget
    dashboard.js       # Landlord dashboard
```

The old single-file landing page is at `index.html` and is no longer used at runtime — the Worker now serves the new landing from `src/templates/landing.js`. Keep or delete it.

## What's already done

- **D1 database** `listfast-db` created (uuid `8eabf851-d45b-4766-ac72-69506bdb29ac`), schema applied.
- **Stripe products + prices** created in your live account (`acct_1FKOZ3AF4d9gCyuN`):
  - Quick List setup `price_1Tay5tAF4d9gCyuNjHypcIdY` ($79 one-time)
  - Quick List monthly `price_1Tay5wAF4d9gCyuNaATyeJaZ` ($29/mo)
  - Pro List setup `price_1Tay5zAF4d9gCyuNgdr5RHcV` ($149 one-time)
  - Pro List monthly `price_1Tay62AF4d9gCyuNzcP1nlfD` ($49/mo)
  - Portfolio `price_1Tay64AF4d9gCyuNiYsUrlBZ` ($299/mo)
- All five price IDs are wired into `wrangler.toml` `[vars]`.

## One-time deploy steps

### 1. Install + login

```bash
cd "Property Listing PaaS"
npm install
npx wrangler login          # authorizes wrangler against your Cloudflare account
```

### 2. Enable R2 (one-click, free up to 10 GB/month)

1. Open [dash.cloudflare.com](https://dash.cloudflare.com) → R2 Object Storage → **Enable R2**.
2. Then create the bucket:

```bash
npx wrangler r2 bucket create listfast-uploads
```

Until R2 is enabled, the Worker will still serve pages but image uploads will return a 503 with a friendly message.

### 3. Set secrets

```bash
npx wrangler secret put STRIPE_SECRET_KEY        # sk_live_... from dashboard.stripe.com/apikeys
npx wrangler secret put STRIPE_WEBHOOK_SECRET    # whsec_... (after you create the webhook below)
npx wrangler secret put ANTHROPIC_API_KEY        # sk-ant-... for REVA. Optional — REVA falls back to rule-based replies without it.
npx wrangler secret put ADMIN_EMAIL              # your email — gets BCC'd on inquiries
npx wrangler secret put RESEND_API_KEY           # optional — for transactional email via resend.com
npx wrangler secret put AIRTABLE_API_KEY         # optional — SWFT-managed inquiries (base appx3jGQIAp1lzwW0)
```

**Airtable (SWFT-managed listings / inquiries)**

1. Create a personal access token at [airtable.com/create/tokens](https://airtable.com/create/tokens) scoped to base `appx3jGQIAp1lzwW0`.
2. `npx wrangler secret put AIRTABLE_API_KEY`
3. Confirm table names in your base match `wrangler.toml` vars (`AIRTABLE_TABLE_INQUIRIES`, `AIRTABLE_TABLE_LISTINGS`) or update them after `GET /v0/meta/bases/appx3jGQIAp1lzwW0/tables`.
4. Apply the intake migration on existing D1 databases:

```bash
npx wrangler d1 execute listfast-db --remote --file=src/migrations/001_intake_options.sql
```

### 4. Deploy

```bash
npm run deploy
```

Wrangler will print a `listfast.<your-subdomain>.workers.dev` URL. Visit it. The landing page should render.

### 5. Wire up the Stripe webhook

1. dashboard.stripe.com → Developers → Webhooks → **Add endpoint**.
2. Endpoint URL: `https://<your-worker-url>/api/stripe/webhook`
3. Events to send: `checkout.session.completed` (minimum).
4. Copy the signing secret (`whsec_...`) and put it into `STRIPE_WEBHOOK_SECRET` via `wrangler secret put`.

### 6. (Optional) Point your domain

In `wrangler.toml`, uncomment the `routes` block and adjust:

```toml
routes = [
  { pattern = "listfast.co/*", custom_domain = true },
  { pattern = "www.listfast.co/*", custom_domain = true }
]
```

Then update `APP_URL` under `[vars]` to your apex domain. Redeploy.

## Local development

```bash
npm run dev
```

This runs the Worker locally against the **remote** D1 and R2 (so you don't have to maintain a local copy). Visit the printed `localhost:8787` URL.

If you want a fully local DB, run `wrangler dev --local` instead — `npm run dev` defers to remote by default for shared state.

## How a listing flows through the system

1. **`GET /`** — homepage intake (`/#intake`) collects property details, bulk photos/files, and management choices.
2. **`GET /onboard`** — redirects to `/#intake` (single canonical flow).
3. **`POST /api/listings`** — creates a draft row, returns `{ id, edit_token, preview_url }`.
4. **`POST /api/listings/:id/upload?kind=image|file`** — photos → `images_json`, documents → `files_json`.
5. **`PATCH /api/listings/:id`** — saves intake + `intake_options`.
6. **`POST /api/listings/:id/generate-description`** — optional AI copy when description is blank.
7. Owner is redirected to **`GET /preview/:id?t=<token>`** (SWFT full listing layout).
6. They click **"Publish for $X"** → **`POST /api/listings/:id/checkout`** creates a Stripe Checkout Session and redirects.
7. After payment, Stripe webhooks **`POST /api/stripe/webhook`** with `checkout.session.completed` → listing status flips to `published`.
8. Customer lands on **`/thanks?listing=:id`**.
9. The dashboard at **`/dashboard/:id?t=<token>`** shows all inquiries and showings as they arrive.
10. REVA on the public page (`/preview/:id`) handles prospect chat 24/7 via **`POST /api/reva/:id`**.

## Routes reference

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | SWFT marketing + homepage intake |
| GET | `/onboard` | Redirects to `/#intake` |
| GET | `/preview/:id` | Property page (owner mode if `?t=<edit_token>`) |
| GET | `/dashboard/:id?t=<token>` | Owner dashboard (CSV export, Airtable link) |
| GET | `/thanks?listing=:id` | Post-checkout confirmation |
| GET | `/uploads/:id/:file` | Image served from R2 (public, cached) |
| POST | `/api/listings` | Create draft listing |
| GET | `/api/listings/:id` | Fetch listing JSON |
| PATCH | `/api/listings/:id` | Edit (header `x-edit-token`) |
| POST | `/api/listings/:id/upload` | Multipart upload (`kind=image` or `kind=file`) |
| POST | `/api/listings/:id/generate-description` | AI description (edit token) |
| GET | `/api/listings/:id/inquiries/export.csv` | Export inquiries + showings (edit token) |
| POST | `/api/listings/:id/checkout` | Create Stripe Checkout Session |
| POST | `/api/listings/:id/inquiries` | Submit inquiry |
| POST | `/api/listings/:id/showings` | Request showing |
| POST | `/api/reva/:id` | REVA chatbot turn |
| POST | `/api/stripe/webhook` | Stripe events (publish on `checkout.session.completed`) |

## REVA configuration

REVA uses Claude Haiku 4.5. The model is set in `src/reva.js` (`claude-haiku-4-5-20251001`). The prompt is built from the listing row itself — REVA only knows what's in the listing, so it can't fabricate details. If `ANTHROPIC_API_KEY` is unset, REVA degrades gracefully to a rule-based responder that handles the most common questions.

## Pricing changes

Edit the price IDs in `wrangler.toml` `[vars]` and redeploy. If you change the dollar amounts, also update them in:
- `src/templates/landing.js` (pricing cards)
- `src/templates/onboard.js` (plan picker)
- `src/templates/preview.js` (`planBasePrice` in the owner bar)
- `src/templates/dashboard.js` (`planBasePrice` in the publish button)

## What's intentionally not built (yet)

- **Email confirmations** are stubbed via Resend — if `RESEND_API_KEY` isn't set, inquiries just log to the Worker console. Wire up Resend (or any SMTP) when you're ready.
- **Webflow auto-publish** isn't wired. The current preview page is the published page — you don't need Webflow as the runtime, just as inspiration for the design. If you later want to clone into Webflow CMS too, the Webflow MCP is available.
- **Templates beyond "swft"** — the template selector is in the wizard but currently all templates render the same way. Add per-template variants in `preview.js` when you have alternatives.
