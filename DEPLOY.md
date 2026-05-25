# Deploy SWFT REVA (`swft-reva`)

Live site: **https://swft-reva.elombe.workers.dev**

## Workers vs Pages (why Pages showed a blank site)

| | **Cloudflare Worker** | **Cloudflare Pages** |
|---|---|---|
| Role | Runs your app code on every request (HTML, API, webhooks) | Hosts **static** build output (`index.html`, `dist/`, etc.) |
| This repo | **Use this.** [`src/index.js`](src/index.js) renders pages and APIs | Wrong fit — there is no root `index.html` |

**You need one Worker deployment, not a static Pages project.**

Pages failed because it looked for static files. The homepage is generated in [`src/templates/swft-home.js`](src/templates/swft-home.js).

## First-time production setup

### 1. Prerequisites

```bash
npm install
npx wrangler login
```

### 2. D1 (done for `swft-reva-db`)

```bash
npx wrangler d1 create swft-reva-db   # once
npm run db:apply
```

Database ID is in [`wrangler.toml`](wrangler.toml).

### 3. R2 (required for photo uploads)

1. Enable R2: [Cloudflare Dashboard → R2](https://dash.cloudflare.com/) → **Enable R2**.
2. Create bucket:

```bash
npx wrangler r2 bucket create swft-reva-uploads
```

3. Uncomment the `[[r2_buckets]]` block in [`wrangler.toml`](wrangler.toml):

```toml
[[r2_buckets]]
binding = "UPLOADS"
bucket_name = "swft-reva-uploads"
```

4. Redeploy: `npm run deploy`

Until R2 is enabled, the site works but uploads return a friendly 503.

### 4. Secrets (required for payments, REVA, email)

```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put RESEND_API_KEY      # optional
npx wrangler secret put AIRTABLE_API_KEY    # optional
```

List secrets: `npm run secrets:list`

### 5. Deploy

```bash
npm run deploy
```

Wrangler prints your workers.dev URL (e.g. `https://swft-reva.<account>.workers.dev`). Set `APP_URL` in [`wrangler.toml`](wrangler.toml) `[vars]` to that URL and redeploy.

### 6. Stripe webhook

Point Stripe to:

`https://swft-reva.elombe.workers.dev/api/stripe/webhook`

Event: `checkout.session.completed` (minimum).

## Dashboard deploy (Git → Worker)

1. **Remove or ignore** the Pages project linked to the REVA repo (static-only deploy).
2. Dashboard → **Workers & Pages** → **Create** → **Connect to Git**.
3. Repo: `SWFTstudios/REVA`, branch `main`.
4. Build command: `npm install && npx wrangler deploy`
5. Add secrets under Worker → **Settings** → **Variables**.
6. Ensure D1/R2 bindings match `wrangler.toml`.

## GitHub Actions

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Add repo secret `CLOUDFLARE_API_TOKEN` with Workers edit permission.

## Post-deploy checks

- [ ] `GET /` — homepage and intake
- [ ] Submit intake → preview with photos (needs R2)
- [ ] REVA chat on preview (needs `ANTHROPIC_API_KEY`)
- [ ] Publish / Stripe (needs `STRIPE_*` secrets)

## Custom domain (optional)

Uncomment `routes` in `wrangler.toml` and add your domain in the Cloudflare dashboard. Attach the route to the **Worker**, not Pages.
