// Deck Plan interactive diagram: pan/zoom, hover-highlight, and a click-to-open
// detail panel. The SVG is a one-time static port of the internal blueprint's
// pirateflix flow — see docs/superpowers/plans/2026-07-05-deck-plan-blueprint-and-seerr.md

// --- pure helpers (unit-tested) ---

// A pointer gesture is a tap (vs a pan/drag) when it barely moved and was quick.
// svg-pan-zoom swallows the synthetic click after a drag, so we detect taps ourselves.
export function isTap(down, up, maxDist = 10, maxMs = 500) {
  if (!down || !up) return false;
  return Math.hypot(up.x - down.x, up.y - down.y) < maxDist && up.t - down.t < maxMs;
}

// Panel content for a node id, or null when that node has no entry (not clickable).
export function contentFor(id, data) {
  return (id && data && data[id]) || null;
}

// Compact star count: 999 -> "999", 13904 -> "13.9k", 53969 -> "54k". "" if unknown.
// Counts are baked into the data (see _data/deck_plan.yml) rather than fetched live —
// per-visitor GitHub API calls rate-limit at 60/hr per IP, so panels went starless.
export function formatStars(n) {
  if (n == null || Number.isNaN(n)) return "";
  if (n < 1000) return String(n);
  const k = n >= 100000 ? Math.round(n / 1000) : Math.round(n / 100) / 10;
  return `${k}k`;
}

// --- guided tour geometry (unit-tested) ---

// Bounding box (SVG user coords) of a set of node centers, padded, then grown to
// match the viewport aspect ratio so the focused region fills the stage undistorted.
// null when there's nothing to frame.
export function focusBox(centers, pad, aspect) {
  if (!centers.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of centers) {
    if (c.cx < minX) minX = c.cx;
    if (c.cx > maxX) maxX = c.cx;
    if (c.cy < minY) minY = c.cy;
    if (c.cy > maxY) maxY = c.cy;
  }
  minX -= pad; maxX += pad; minY -= pad; maxY += pad;
  let w = maxX - minX, h = maxY - minY;
  if (w / h < aspect) { const nw = h * aspect; minX -= (nw - w) / 2; w = nw; }
  else { const nh = w / aspect; minY -= (nh - h) / 2; h = nh; }
  return { x: minX, y: minY, w, h };
}

// Relative zoom + pixel pan that frames `box` (user coords) centered in a `sizes`
// (px) viewport, given `baseZoom` = px per user unit at svg-pan-zoom's fit (zoom 1).
// Zoom is clamped to maxZoom so a single-node box doesn't slam to full magnification.
export function zoomPanForBox(box, sizes, baseZoom, maxZoom = 12) {
  const zoom = Math.min(Math.min(sizes.width / box.w, sizes.height / box.h) / baseZoom, maxZoom);
  const real = zoom * baseZoom;
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  return { zoom, panX: sizes.width / 2 - real * cx, panY: sizes.height / 2 - real * cy };
}

// --- hover highlight (ported from the blueprint's highlight.ts) ---
function center(el) {
  const cx = parseFloat(el.dataset.cx ?? "");
  const cy = parseFloat(el.dataset.cy ?? "");
  return Number.isNaN(cx) || Number.isNaN(cy) ? null : { cx, cy };
}
function boxContains(box, pts) {
  const x = parseFloat(box.getAttribute("x") ?? "");
  const y = parseFloat(box.getAttribute("y") ?? "");
  const w = parseFloat(box.getAttribute("width") ?? "");
  const h = parseFloat(box.getAttribute("height") ?? "");
  return pts.some((p) => p.cx >= x && p.cx <= x + w && p.cy >= y && p.cy <= y + h);
}
function lightUp(node) {
  const svg = node.closest("svg");
  const id = node.dataset.node;
  if (!svg || !id) return;
  const ids = new Set([id]);
  svg.querySelectorAll(`.conn[data-a="${id}"], .conn[data-b="${id}"]`).forEach((l) => {
    l.classList.add("lit");
    if (l.dataset.a) ids.add(l.dataset.a);
    if (l.dataset.b) ids.add(l.dataset.b);
  });
  const centers = [];
  ids.forEach((nid) => {
    svg.querySelectorAll(`[data-node="${nid}"]`).forEach((n) => {
      n.classList.add("lit");
      const c = center(n);
      if (c) centers.push(c);
    });
  });
  svg.querySelectorAll(".group-box").forEach((b) => {
    if (boxContains(b, centers)) b.classList.add("lit");
  });
}
function clearLit(node) {
  node.closest("svg")?.querySelectorAll(".lit").forEach((e) => e.classList.remove("lit"));
}

// Drag a card anywhere within `stage`, ignoring pointerdowns on its controls so
// buttons still click. Positions via left/top (px) relative to the stage.
function makeDraggable(el, stage) {
  let sx, sy, ox, oy, dragging = false;
  el.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;
    const pr = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    ox = r.left - pr.left; oy = r.top - pr.top; sx = e.clientX; sy = e.clientY;
    el.style.left = ox + "px"; el.style.top = oy + "px";
    el.style.right = "auto"; el.style.bottom = "auto";
    dragging = true; el.setPointerCapture(e.pointerId); e.preventDefault();
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const pr = stage.getBoundingClientRect();
    const nx = Math.max(0, Math.min(ox + e.clientX - sx, pr.width - el.offsetWidth));
    const ny = Math.max(0, Math.min(oy + e.clientY - sy, pr.height - el.offsetHeight));
    el.style.left = nx + "px"; el.style.top = ny + "px";
  });
  const end = () => { dragging = false; };
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
}

// --- guided tour: a first-visit welcome note that walks the request→screen flow,
// dimming the chart and spotlighting + zooming to each step. ---
function initTour(svg, pz) {
  const stepsEl = document.getElementById("deck-tour-data");
  const steps = stepsEl ? JSON.parse(stepsEl.textContent) : [];
  const welcome = document.getElementById("deck-welcome");
  const tourEl = document.getElementById("deck-tour");
  const reopen = document.getElementById("deck-reopen");
  const stage = svg.closest(".deck-stage");
  if (!steps.length || !welcome || !tourEl || !reopen || !stage) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const KEY = "pf-deck-welcomed";
  const PAD = 150, DUR = 550;
  const el = (id) => document.getElementById(id);
  const remember = () => { try { localStorage.setItem(KEY, "1"); } catch (_) {} };

  const esc = (s) => (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/[^\w-]/g, "\\$&");
  const centerOf = (n) => {
    const cx = parseFloat(n.dataset.cx), cy = parseFloat(n.dataset.cy);
    return Number.isNaN(cx) || Number.isNaN(cy) ? null : { cx, cy };
  };

  function clearSpot() {
    svg.querySelectorAll(".spot, .lit").forEach((e) => e.classList.remove("spot", "lit"));
  }
  function spotlight(ids) {
    clearSpot();
    const set = new Set(ids);
    ids.forEach((id) => svg.querySelectorAll(`[data-node="${esc(id)}"]`).forEach((n) => n.classList.add("spot")));
    svg.querySelectorAll(".conn").forEach((c) => {
      if (set.has(c.dataset.a) && set.has(c.dataset.b)) {
        c.classList.add("spot", "lit");
        // a labelled edge is followed by its label rect + text as siblings
        let s = c.nextElementSibling;
        for (let k = 0; k < 2 && s && !s.classList.contains("conn"); k++, s = s.nextElementSibling) {
          s.classList.add("spot");
        }
      }
    });
  }

  // Animate svg-pan-zoom to frame a step's nodes (no-op without the pan/zoom lib).
  let raf = null;
  function focusOn(ids) {
    if (!pz) return;
    const centers = [];
    ids.forEach((id) => svg.querySelectorAll(`[data-node="${esc(id)}"]`).forEach((n) => {
      const c = centerOf(n); if (c) centers.push(c);
    }));
    const sizes = pz.getSizes();
    const box = focusBox(centers, PAD, sizes.width / sizes.height);
    if (!box) return;
    const base = sizes.realZoom / pz.getZoom();
    const apply = (zoom, cx, cy) => {
      const real = zoom * base;
      pz.zoom(zoom);
      pz.pan({ x: sizes.width / 2 - real * cx, y: sizes.height / 2 - real * cy });
    };
    const { zoom: tz } = zoomPanForBox(box, sizes, base, 12);
    const tcx = box.x + box.w / 2, tcy = box.y + box.h / 2;
    if (reduce) { apply(tz, tcx, tcy); return; }

    const pan0 = pz.getPan(), z0 = pz.getZoom(), real0 = sizes.realZoom;
    const cx0 = (sizes.width / 2 - pan0.x) / real0;
    const cy0 = (sizes.height / 2 - pan0.y) / real0;
    if (raf) cancelAnimationFrame(raf);
    let t0 = null;
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const frame = (ts) => {
      if (t0 === null) t0 = ts;
      const e = ease(Math.min(1, (ts - t0) / DUR));
      apply(z0 + (tz - z0) * e, cx0 + (tcx - cx0) * e, cy0 + (tcy - cy0) * e);
      if (e < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  // step dots
  const dots = el("deck-tour-dots");
  steps.forEach((_, i) => {
    const d = document.createElement("button");
    d.type = "button"; d.className = "deck-dot";
    d.setAttribute("aria-label", `Go to stage ${i + 1}`);
    d.addEventListener("click", () => show(i));
    dots.appendChild(d);
  });

  let idx = 0;
  function show(i) {
    idx = i;
    const s = steps[i];
    el("deck-tour-eyebrow").textContent = `Stage ${i + 1} of ${steps.length}`;
    el("deck-tour-title").textContent = s.title;
    el("deck-tour-body").textContent = s.body;
    el("deck-prev").disabled = i === 0;
    el("deck-next").textContent = i === steps.length - 1 ? "Finish" : "Next ›";
    dots.querySelectorAll(".deck-dot").forEach((d, k) => d.classList.toggle("on", k === i));
    spotlight(s.nodes);
    focusOn(s.nodes);
  }

  const reveal = (node) => {
    node.hidden = false;
    node.classList.remove("anim-in"); void node.offsetWidth; node.classList.add("anim-in");
  };
  function startTour() {
    remember();
    welcome.hidden = true; reopen.hidden = true;
    reveal(tourEl);
    svg.classList.add("touring");
    show(0);
  }
  function endTour() {
    tourEl.hidden = true;
    svg.classList.remove("touring");
    clearSpot();
    if (pz) pz.reset();
    reopen.hidden = false;
  }

  el("deck-start").addEventListener("click", startTour);
  el("deck-dismiss").addEventListener("click", () => { remember(); welcome.hidden = true; reopen.hidden = false; });
  el("deck-next").addEventListener("click", () => (idx === steps.length - 1 ? endTour() : show(idx + 1)));
  el("deck-prev").addEventListener("click", () => show(Math.max(0, idx - 1)));
  el("deck-skip").addEventListener("click", endTour);
  reopen.addEventListener("click", () => { reopen.hidden = true; reveal(welcome); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !tourEl.hidden) endTour(); });

  makeDraggable(welcome, stage);
  makeDraggable(tourEl, stage);

  // First visit greets with the note; on later visits it waits behind the ? button.
  let welcomed = false;
  try { welcomed = localStorage.getItem(KEY) === "1"; } catch (_) {}
  if (welcomed) reopen.hidden = false; else reveal(welcome);
}

// --- DOM init ---
function init() {
  const svg = document.querySelector("svg.floor-svg");
  if (!svg) return;

  // pan/zoom (opts mirror the source blueprint)
  const pz = window.svgPanZoom
    ? window.svgPanZoom(svg, {
        controlIconsEnabled: false, fit: true, center: true,
        minZoom: 0.4, maxZoom: 12, dblClickZoomEnabled: false, zoomScaleSensitivity: 0.3,
      })
    : null;

  // hover highlight
  svg.querySelectorAll("[data-node]").forEach((n) => {
    n.addEventListener("mouseenter", () => lightUp(n));
    n.addEventListener("mouseleave", () => clearLit(n));
  });

  initTour(svg, pz);

  // detail panel
  const dataEl = document.getElementById("deck-plan-data");
  const data = dataEl ? JSON.parse(dataEl.textContent) : {};

  // Clickable nodes (those with a data entry — a detail panel or a plain link) get a
  // pointer cursor; category/actor nodes default to `.flow-node { cursor: default }`.
  svg.querySelectorAll("[data-node]").forEach((n) => {
    if (data[n.dataset.node]) n.style.cursor = "pointer";
  });

  const panel = document.getElementById("deck-panel");
  if (!panel) return;
  const q = (sel) => panel.querySelector(sel);

  function openPanel(entry) {
    q(".dp-logo").src = entry.logo || "";
    q(".dp-logo").alt = entry.title || "";
    q(".dp-title").textContent = entry.title || "";
    q(".dp-desc").textContent = entry.description || "";
    const repo = q(".dp-repo");
    if (entry.github) {
      repo.hidden = false;
      q(".dp-gh").href = `https://github.com/${entry.github}`;
      const s = formatStars(entry.stars);
      q(".dp-stars").textContent = s ? `⭐ ${s}` : "";
    } else {
      repo.hidden = true;
    }
    q(".dp-links").innerHTML = (entry.links || [])
      .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join("");
    q(".dp-shots").innerHTML = (entry.screenshots || [])
      .map((s) => `<img src="${s}" alt="" loading="lazy">`).join("");
    // full-bleed portrait: the crew art becomes the panel background (content on a scrim)
    if (entry.portrait) {
      panel.style.setProperty("--art", `url("${entry.portrait}")`);
      panel.classList.add("has-art");
    } else {
      panel.classList.remove("has-art");
      panel.style.removeProperty("--art");
    }
    panel.classList.add("open");
  }
  const closePanel = () => panel.classList.remove("open");

  function openFromTarget(target) {
    const node = target.closest?.("[data-node]");
    const entry = node && contentFor(node.dataset.node, data);
    if (!entry) return;
    if (entry.href) { window.open(entry.href, "_blank", "noopener"); return; }
    openPanel(entry);
  }

  // tap detection (all pointer types) so a pan-drag never opens the panel
  let down = null;
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest?.("svg.floor-svg")) down = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  });
  document.addEventListener("pointerup", (e) => {
    const up = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    if (isTap(down, up)) openFromTarget(e.target);
    down = null;
  });

  q(".dp-close").addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
  document.addEventListener("click", (e) => {
    if (panel.classList.contains("open") && !panel.contains(e.target) && !e.target.closest?.("[data-node]")) {
      closePanel();
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
