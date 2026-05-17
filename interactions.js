// Mouse-reactive effects + scroll reveal + OS detection + mobile sticky CTA
//
// 1) Global cursor spotlight (--cursor-x/y on :root)
// 2) Per-card 3D tilt + radial shine
// 3) Scroll reveal — .reveal elements fade up when they enter viewport
// 4) OS detection — adds .os-mac / .os-win on <html>; marks the matching
//    platform card with .platform-recommended
// 5) Mobile sticky CTA visibility (toggles .visible after hero leaves view)

(function () {
  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- OS detection ---- */
  (function () {
    const ua = (navigator.userAgent || "").toLowerCase();
    const platform = (navigator.platform || "").toLowerCase();
    const isMac = /mac/.test(platform) || /macintosh|mac os x/.test(ua);
    const isWin = /win/.test(platform) || /windows/.test(ua);
    if (isMac) document.documentElement.classList.add("os-mac");
    else if (isWin) document.documentElement.classList.add("os-win");
    else document.documentElement.classList.add("os-other");
  })();

  function markRecommendedPlatform() {
    const isMac = document.documentElement.classList.contains("os-mac");
    document.querySelectorAll(".platform").forEach((el) => {
      el.classList.remove("platform-recommended");
    });
    const platforms = document.querySelectorAll(".platform");
    if (!platforms.length) return;
    // Cards in order: macOS, Windows, Changes, Updates
    const target = platforms[isMac ? 0 : 1];
    if (target) target.classList.add("platform-recommended");
  }

  /* ---- Global cursor (rAF-throttled) ---- */
  if (!reduced) {
    let rafId = 0;
    let lastX = 0, lastY = 0;
    window.addEventListener(
      "mousemove",
      (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const r = document.documentElement;
          r.style.setProperty("--cursor-x", lastX + "px");
          r.style.setProperty("--cursor-y", lastY + "px");
          rafId = 0;
        });
      },
      { passive: true }
    );
  }

  /* ---- Card-level tilt + shine ---- */
  const SELECTOR =
    ".feature, .step, .platform, .partner, .panel, .live-card, .download, .preview-wrap, .faq-item, .video-card";
  const TILT_MAX = 10;

  function onMove(e) {
    if (reduced) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = (x / r.width) * 100;
    const py = (y / r.height) * 100;
    const rx = ((y / r.height) - 0.5) * -TILT_MAX * 2;
    const ry = ((x / r.width) - 0.5) * TILT_MAX * 2;
    card.style.setProperty("--mx", px + "%");
    card.style.setProperty("--my", py + "%");
    card.style.setProperty("--rx", rx.toFixed(2) + "deg");
    card.style.setProperty("--ry", ry.toFixed(2) + "deg");
    card.style.setProperty("--shine", "1");
  }
  function onLeave(e) {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--shine", "0");
  }
  function attach(el) {
    if (el.dataset.fx === "1") return;
    el.dataset.fx = "1";
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
  }

  /* ---- Scroll reveal ---- */
  const REVEAL_SELECTOR =
    ".section-eyebrow, .section-title, .section-lead, .feature, .step, .platform, .partner, .faq-item, .hero h1, .hero-sub, .hero-actions, .hero-stats, .pill.live, .live-card, .preview-wrap, .video-card, .download-grid > *";

  function markReveal(el) {
    if (el.dataset.rv === "1") return;
    el.dataset.rv = "1";
    el.classList.add("reveal");
  }

  const revealObs = ("IntersectionObserver" in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("is-visible");
            revealObs.unobserve(ent.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;

  function scanReveal(root) {
    (root || document).querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      markReveal(el);
      if (revealObs && !reduced) revealObs.observe(el);
      else el.classList.add("is-visible");
    });
  }

  /* ---- Mobile sticky CTA visibility ---- */
  function setupStickyCta() {
    const hero = document.querySelector(".hero");
    const bar = document.querySelector(".sticky-cta");
    if (!hero || !bar) return;
    const obs = new IntersectionObserver(
      ([ent]) => {
        if (ent.isIntersecting) bar.classList.remove("visible");
        else bar.classList.add("visible");
      },
      { threshold: 0, rootMargin: "-40% 0px 0px 0px" }
    );
    obs.observe(hero);
  }

  function scan(root) {
    (root || document).querySelectorAll(SELECTOR).forEach(attach);
    scanReveal(root);
  }

  function init() {
    scan(document);
    markRecommendedPlatform();
    setupStickyCta();
    const mo = new MutationObserver((muts) => {
      let needSticky = false;
      let needPlatform = false;
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches && n.matches(SELECTOR)) attach(n);
          if (n.matches && n.matches(REVEAL_SELECTOR)) {
            markReveal(n);
            if (revealObs && !reduced) revealObs.observe(n);
            else n.classList.add("is-visible");
          }
          if (n.querySelectorAll) scan(n);
          if (n.classList && (n.classList.contains("sticky-cta") || n.classList.contains("hero"))) needSticky = true;
          if (n.classList && n.classList.contains("platform")) needPlatform = true;
          if (n.querySelector && n.querySelector(".platform")) needPlatform = true;
        });
      }
      if (needSticky) setupStickyCta();
      if (needPlatform) markRecommendedPlatform();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
