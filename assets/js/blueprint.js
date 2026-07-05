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

// --- DOM init ---
function init() {
  const svg = document.querySelector("svg.floor-svg");
  if (!svg) return;

  // pan/zoom (opts mirror the source blueprint)
  if (window.svgPanZoom) {
    window.svgPanZoom(svg, {
      controlIconsEnabled: false, fit: true, center: true,
      minZoom: 0.4, maxZoom: 12, dblClickZoomEnabled: false, zoomScaleSensitivity: 0.3,
    });
  }

  // hover highlight
  svg.querySelectorAll("[data-node]").forEach((n) => {
    n.addEventListener("mouseenter", () => lightUp(n));
    n.addEventListener("mouseleave", () => clearLit(n));
  });

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
