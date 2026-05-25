// Shared lightbox for intake photo grid and preview gallery.

export function renderLightboxHtml() {
  return /* html */ `
<div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-label="Photo viewer">
  <div class="lightbox-scrim" data-lightbox-close></div>
  <div class="lightbox-inner">
    <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close">×</button>
    <button type="button" class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Previous">←</button>
    <img class="lightbox-img" id="lightboxImg" alt="" />
    <button type="button" class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Next">→</button>
    <div class="lightbox-counter" id="lightboxCounter"></div>
  </div>
</div>`;
}

export function lightboxCss() {
  return /* css */ `
.lightbox { position: fixed; inset: 0; z-index: 9999; display: none; align-items: center; justify-content: center; }
.lightbox.is-open { display: flex; }
.lightbox-scrim { position: absolute; inset: 0; background: rgba(0,0,0,0.88); cursor: pointer; }
.lightbox-inner { position: relative; z-index: 1; max-width: min(92vw, 1200px); max-height: 90vh; display: flex; align-items: center; justify-content: center; padding: 48px 56px; }
.lightbox-img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 4px; user-select: none; }
.lightbox-close { position: absolute; top: 12px; right: 12px; width: 44px; height: 44px; border: none; background: rgba(255,255,255,0.12); color: #fff; font-size: 28px; line-height: 1; border-radius: 50%; cursor: pointer; z-index: 2; }
.lightbox-close:hover { background: rgba(255,255,255,0.22); }
.lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border: none; background: rgba(255,255,255,0.12); color: #fff; font-size: 22px; border-radius: 50%; cursor: pointer; z-index: 2; }
.lightbox-nav:hover { background: rgba(255,255,255,0.22); }
.lightbox-prev { left: 8px; }
.lightbox-next { right: 8px; }
.lightbox-counter { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 600; }
[data-lightbox-src] { cursor: zoom-in; }
`;
}

export function lightboxScript() {
  return /* js */ `
(function initLightbox() {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const counter = document.getElementById("lightboxCounter");
  if (!lb || !img) return;

  let items = [];
  let index = 0;

  function collect(group) {
    return Array.from(document.querySelectorAll('[data-lightbox-group="' + group + '"][data-lightbox-src]'))
      .map(el => ({ src: el.getAttribute("data-lightbox-src"), alt: el.getAttribute("data-lightbox-alt") || "" }))
      .filter(x => x.src);
  }

  function show(i) {
    if (!items.length) return;
    index = ((i % items.length) + items.length) % items.length;
    img.src = items[index].src;
    img.alt = items[index].alt;
    if (counter) counter.textContent = (index + 1) + " / " + items.length;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    img.src = "";
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-lightbox-src]");
    if (!trigger) return;
    const group = trigger.getAttribute("data-lightbox-group");
    if (!group) return;
    e.preventDefault();
    items = collect(group);
    const src = trigger.getAttribute("data-lightbox-src");
    index = Math.max(0, items.findIndex(x => x.src === src));
    show(index);
  });

  lb.querySelectorAll("[data-lightbox-close]").forEach(el => el.addEventListener("click", close));
  lb.querySelector("[data-lightbox-prev]")?.addEventListener("click", (e) => { e.stopPropagation(); show(index - 1); });
  lb.querySelector("[data-lightbox-next]")?.addEventListener("click", (e) => { e.stopPropagation(); show(index + 1); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
`;
}
