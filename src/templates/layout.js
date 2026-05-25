// Shared HTML shell + design tokens for every page.

export function escapeHtml(input) {
  if (input == null) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function layout({ title, description = "", body, extraCss = "", extraHead = "", extraScript = "", appUrl = "", bodyClass = "" }) {
  const bodyAttr = bodyClass ? ` class="${escapeHtml(bodyClass)}"` : "";
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:type" content="website" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
<style>
  :root {
    --paper: #fcfbf8;
    --paper-2: #f4f1ea;
    --ink: #131311;
    --ink-2: #2b2b27;
    --muted: rgba(20,20,20,0.6);
    --accent: #e9c46a;
    --accent-ink: #2b2200;
    --line: rgba(20,20,20,0.08);
    --serif: 'Fraunces', Georgia, serif;
    --sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); background: var(--paper); color: var(--ink); -webkit-font-smoothing: antialiased; line-height: 1.5; }
  img { max-width: 100%; display: block; }
  a { color: inherit; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14px; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: transform .2s ease, background .2s ease, color .2s ease; white-space: nowrap; }
  .btn-lg { padding: 16px 28px; font-size: 15px; }
  .btn-block { width: 100%; }
  .btn-dark { background: var(--ink); color: var(--paper); }
  .btn-dark:hover { transform: translateY(-1px); background: #000; }
  .btn-light { background: var(--paper); color: var(--ink); }
  .btn-light:hover { transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--ink); border-color: rgba(20,20,20,0.15); }
  .btn-ghost:hover { background: rgba(20,20,20,0.04); }
  .btn-accent { background: var(--accent); color: var(--accent-ink); }
  .btn-accent:hover { transform: translateY(-1px); background: #f0d27c; }

  .container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
  @media (max-width: 700px) { .container { padding: 0 20px; } }

  .form-row { display: grid; gap: 8px; margin-bottom: 18px; }
  .form-row label { font-size: 13px; font-weight: 600; color: var(--ink-2); }
  .form-row .hint { font-size: 12px; color: var(--muted); }
  input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], input[type="time"], textarea, select {
    width: 100%; padding: 13px 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--paper); font: inherit; color: var(--ink); transition: border-color .2s ease, box-shadow .2s ease;
  }
  input:focus, textarea:focus, select:focus { outline: none; border-color: var(--ink); box-shadow: 0 0 0 3px rgba(19,19,17,0.08); }
  textarea { min-height: 110px; resize: vertical; line-height: 1.5; }

  ${extraCss}
</style>
${extraHead}
</head>
<body${bodyAttr}>
${body}
${extraScript ? `<script>${extraScript}</script>` : ""}
</body>
</html>`;
}
