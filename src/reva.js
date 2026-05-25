// REVA — Real Estate Virtual Assistant
// A chatbot embedded on every published property page. She:
//   - Answers prospect questions about the property using only the listing data
//   - Offers to book a showing and captures contact info
//   - Captures inquiries that get forwarded to the landlord
//
// Uses Anthropic's Claude API (Haiku for low cost, low latency).

export async function revaTurn({ listing, messages, apiKey }) {
  if (!apiKey) {
    return {
      reply: revaFallback(listing, messages),
      stub: true,
    };
  }
  const systemPrompt = buildSystemPrompt(listing);
  const formatted = (messages || [])
    .filter((m) => m && m.role && m.content)
    .slice(-20)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 4000),
    }));

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: systemPrompt,
        messages: formatted.length ? formatted : [{ role: "user", content: "Hi" }],
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("REVA upstream error", res.status, t);
      return { reply: revaFallback(listing, messages), stub: true };
    }
    const data = await res.json();
    const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
    return { reply: text || revaFallback(listing, messages) };
  } catch (e) {
    console.error("REVA error", e);
    return { reply: revaFallback(listing, messages), stub: true };
  }
}

function buildSystemPrompt(l) {
  const priceLine = l.price_cents
    ? `$${(l.price_cents / 100).toLocaleString()} ${l.price_unit === "monthly" ? "/ month" : "(asking price)"}`
    : "Price available on request";
  const features = (l.features || []).join(", ") || "—";
  const sched = l.schedule || {};
  const schedLines = [];
  if (sched.days) schedLines.push(`Showings days: ${(sched.days || []).join(", ")}`);
  if (sched.window) schedLines.push(`Time window: ${sched.window}`);
  if (sched.notes) schedLines.push(`Notes: ${sched.notes}`);

  return `You are REVA, a real estate virtual assistant for a property listing on ListFast.
You ONLY answer questions about this specific property using the information below.
You are warm, brief, and helpful. Reply in 1–3 sentences unless explicitly asked for detail.
You never invent details that aren't in the listing. If something isn't covered, say so honestly
and offer to take the prospect's contact info so the landlord can follow up.

Your jobs:
1. Answer questions about the property factually.
2. Offer to book a showing when appropriate. If the prospect agrees, ask for: name, email, phone, and preferred time. Confirm you'll pass it along.
3. Capture inquiries for the landlord — name, contact, and what they're asking.

Do NOT discuss other properties, give legal/financial advice, quote rents you don't have, or speak for the landlord beyond the listed details.

---
LISTING FACTS

Property: ${l.property_name || "(unnamed)"}
Address: ${[l.address_line, l.city, l.state, l.zip].filter(Boolean).join(", ") || "—"}
Goal: ${l.goal || "—"}
Type: ${l.property_type || "—"}
Beds / Baths / Sqft: ${l.bedrooms ?? "?"} bed / ${l.bathrooms ?? "?"} bath / ${l.sqft ?? "?"} sqft
Price: ${priceLine}
Features: ${features}
Description: ${l.description || "—"}
${schedLines.join("\n")}
Contact (landlord): ${l.contact_name || "—"}${l.contact_email ? " <" + l.contact_email + ">" : ""}${l.contact_phone ? " — " + l.contact_phone : ""}
---

If asked something the listing doesn't answer, say: "I don't have that detail yet — want me to pass your question to ${l.contact_name || "the owner"}? Just share your name, email, and a quick note."`;
}

// No-LLM fallback so REVA degrades gracefully if ANTHROPIC_API_KEY isn't set
function revaFallback(l, messages) {
  const last = (messages && messages.length) ? String(messages[messages.length - 1].content || "").toLowerCase() : "";
  const dollars = l.price_cents ? `$${(l.price_cents / 100).toLocaleString()}` : null;
  if (!last) {
    return `Hi! I'm REVA — I can answer questions about ${l.property_name || "this property"} or help you schedule a showing. What would you like to know?`;
  }
  if (last.includes("price") || last.includes("rent") || last.includes("cost")) {
    return dollars
      ? `It's listed at ${dollars}${l.price_unit === "monthly" ? "/month" : ""}. Want to book a showing?`
      : "Pricing is available on request — I can pass your details to the owner. What's the best email to reach you?";
  }
  if (last.includes("show") || last.includes("tour") || last.includes("visit") || last.includes("see")) {
    return "Happy to book you a showing — what's your name, email, and a time that works?";
  }
  if (last.includes("bed") || last.includes("bath") || last.includes("size") || last.includes("sqft")) {
    return `${l.bedrooms ?? "?"} bed / ${l.bathrooms ?? "?"} bath${l.sqft ? `, about ${l.sqft.toLocaleString()} sqft` : ""}. Anything else?`;
  }
  if (last.includes("pet") || last.includes("dog") || last.includes("cat")) {
    const f = (l.features || []).join(" ").toLowerCase();
    if (f.includes("pet")) return "Pets are noted as allowed on this listing. Want to lock in a showing?";
    return "I don't have a pet policy on file yet — want me to pass your question to the owner?";
  }
  return "I'd like to help — can you tell me a bit more, or would you like to schedule a showing?";
}
