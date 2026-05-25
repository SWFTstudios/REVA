// Stripe helpers — uses Stripe REST API directly so we don't need to bundle the SDK.

export async function createCheckoutSession({
  secretKey,
  lineItems,
  mode = "subscription",
  customerEmail,
  successUrl,
  cancelUrl,
  metadata = {},
}) {
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  if (customerEmail) params.set("customer_email", customerEmail);
  params.set("allow_promotion_codes", "true");
  params.set("billing_address_collection", "auto");
  lineItems.forEach((li, i) => {
    params.set(`line_items[${i}][price]`, li.price);
    params.set(`line_items[${i}][quantity]`, String(li.quantity || 1));
  });
  for (const [k, v] of Object.entries(metadata)) {
    params.set(`metadata[${k}]`, String(v));
    // Also stamp on subscription so it shows up in subscription objects later.
    if (mode === "subscription") params.set(`subscription_data[metadata][${k}]`, String(v));
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${secretKey}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stripe checkout error ${res.status}: ${text}`);
  }
  return res.json();
}

// Verify Stripe webhook signature (https://stripe.com/docs/webhooks/signatures)
export async function verifyStripeSignature(payload, header, secret, toleranceSeconds = 300) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=")));
  const timestamp = parts.t;
  const expected = parts.v1;
  if (!timestamp || !expected) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > toleranceSeconds) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`${timestamp}.${payload}`),
  );
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return timingSafeEqual(hex, expected);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function parseStripeEvent(rawBody) {
  return JSON.parse(rawBody);
}
