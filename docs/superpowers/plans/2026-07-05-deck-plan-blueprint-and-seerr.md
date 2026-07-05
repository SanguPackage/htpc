# Deck Plan page (ported pirateflix blueprint) + Seerr swap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pirate-themed `/deck-plan/` page showing a one-time static port of the internal pirateflix blueprint diagram (pan/zoom + hover-highlight + click-to-open detail panel), reached from the hero's "See how she sails" button; and rename Jellyseerr → Seerr across the landing showcase.

**Architecture:** The blueprint's pre-rendered SVG is copied verbatim into a Jekyll include, its logo hrefs rewritten to site-hosted assets, its Jellyseerr node renamed to Seerr, and two helper nodes made clickable. A vendored `svg-pan-zoom` plus a small ES-module (`blueprint.js`) wire up pan/zoom, hover-highlight (ported from the source `highlight.ts`), and a detail panel fed by a JSON blob from `_data/deck_plan.yml`. The Seerr swap touches `crew.yml`, one include string, and adds a Seerr emblem.

**Tech Stack:** Jekyll (Liquid, SCSS via dart-sass `@use`), vanilla ES-module JS loaded with `<script type="module">`, `bun test` for pure-function unit tests, `svg-pan-zoom` (vendored UMD).

**Reference spec:** `docs/superpowers/specs/2026-07-05-deck-plan-blueprint-and-seerr-design.md`

---

## File Structure

**Create:**
- `assets/blueprint/logos/{bazarr,qbittorrent,prowlarr,flaresolverr,radarr,sonarr,jellyfin,jellystat,seerr}.svg` — diagram logos.
- `assets/js/svg-pan-zoom.min.js` — vendored UMD lib (global `svgPanZoom`).
- `assets/js/blueprint.js` — ES module: pan/zoom init + hover-highlight + panel wiring; exports pure `isTap`, `contentFor` for tests.
- `test/blueprint.test.js` — bun unit tests for `isTap`/`contentFor`.
- `_includes/pirate/deck-plan-svg.html` — the transformed pirateflix SVG.
- `_data/deck_plan.yml` — per-node panel content (underscore key ⇒ `site.data.deck_plan`).
- `_sass/_blueprint.scss` — flow-diagram + panel + page styles.
- `_layouts/deck-plan.html` — page layout (nav, intro, diagram, panel DOM, scripts).
- `deck-plan.html` — the page (front matter only; body from layout).
- `assets/seerr.png` — Seerr crew emblem.

**Modify:**
- `_includes/pirate/hero.html` — line 8 button href.
- `_data/crew.yml` — jellyseerr entry → seerr.
- `_includes/pirate/amplifiers.html` — line 20 text.
- `assets/style.scss` — add `@use "blueprint";`.

**Do NOT touch:** anything under `_personal/Home` (source blueprint) or the blog posts.

---

## Task 1: Seerr logo assets

**Files:**
- Create: `assets/blueprint/logos/seerr.svg`, `assets/seerr.png`

- [ ] **Step 1: Fetch the Seerr icon mark (SVG, for the diagram) and a square PNG (for the crew emblem)**

```bash
cd "$(git rev-parse --show-toplevel)"
mkdir -p assets/blueprint/logos
curl -sSL "https://raw.githubusercontent.com/seerr-team/seerr/develop/public/os_icon.svg" -o assets/blueprint/logos/seerr.svg
curl -sSL "https://raw.githubusercontent.com/seerr-team/seerr/develop/public/android-chrome-512x512.png" -o /tmp/seerr512.png
# downscale to emblem size (other emblems display small); ImageMagick `convert` is available
convert /tmp/seerr512.png -resize 128x128 assets/seerr.png
```

- [ ] **Step 2: Verify**

Run: `file assets/seerr.png && head -c 80 assets/blueprint/logos/seerr.svg`
Expected: `assets/seerr.png: PNG image data, 128 x 128 …` and the SVG starts with `<svg xmlns=…viewBox="0 0 96 96"`.

- [ ] **Step 3: Commit**

```bash
git add assets/blueprint/logos/seerr.svg assets/seerr.png
git commit -m "Add Seerr logo assets (diagram SVG + crew emblem PNG)"
```

---

## Task 2: Seerr swap in crew data + amplifiers copy

**Files:**
- Modify: `_data/crew.yml:31-36`, `_includes/pirate/amplifiers.html:20`

- [ ] **Step 1: Rename the crew entry**

In `_data/crew.yml`, replace the jellyseerr block:

```yaml
- key: seerr
  name: Seerr
  role: The Ship's Log
  emblem: seerr.png
  accent: "#e2564a"
  blurb: Crew & guests request titles with a tap.
```

- [ ] **Step 2: Update the amplifiers line**

In `_includes/pirate/amplifiers.html`, line 20:

```html
      <div class="d">They ask in Seerr; the fleet delivers.</div>
```

- [ ] **Step 3: Verify no Jellyseerr remains on the landing page (blog posts are intentionally left)**

Run: `grep -rin "jellyseerr" _data/crew.yml _includes/pirate/`
Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add _data/crew.yml _includes/pirate/amplifiers.html
git commit -m "Rename Jellyseerr to Seerr in crew showcase"
```

---

## Task 3: Vendor svg-pan-zoom + copy diagram logos

**Files:**
- Create: `assets/js/svg-pan-zoom.min.js`, `assets/blueprint/logos/{8 logos}.svg`

- [ ] **Step 1: Copy the vendored lib and the 8 existing service/helper logos**

```bash
cd "$(git rev-parse --show-toplevel)"
HOME_SITE="/mnt/c/Users/woute/Dropbox/Personal/Programming/UnixCode/_personal/Home/site"
cp "$HOME_SITE/node_modules/svg-pan-zoom/dist/svg-pan-zoom.min.js" assets/js/svg-pan-zoom.min.js
for l in bazarr qbittorrent prowlarr flaresolverr radarr sonarr jellyfin jellystat; do
  cp "$HOME_SITE/public/logos/$l.svg" "assets/blueprint/logos/$l.svg"
done
```

- [ ] **Step 2: Verify all 9 diagram logos present (8 copied + seerr.svg from Task 1)**

Run: `ls assets/blueprint/logos/ | sort | tr '\n' ' '`
Expected: `bazarr.svg flaresolverr.svg jellyfin.svg jellystat.svg prowlarr.svg qbittorrent.svg radarr.svg seerr.svg sonarr.svg`

- [ ] **Step 3: Commit**

```bash
git add assets/js/svg-pan-zoom.min.js assets/blueprint/logos/
git commit -m "Vendor svg-pan-zoom and diagram logos for deck plan"
```

---

## Task 4: Port + transform the pirateflix SVG

The source blueprint is a static Astro build. Build it once, extract the pirateflix layer's `<svg>`, rewrite logo hrefs to the site path, rename Jellyseerr→Seerr, and add clickable hit-targets for the two helper nodes (which the source renders as non-interactive logo images).

**Files:**
- Create: `_includes/pirate/deck-plan-svg.html`

- [ ] **Step 1: Build the source blueprint (produces `dist/index.html` with every layer pre-rendered)**

```bash
HOME_SITE="/mnt/c/Users/woute/Dropbox/Personal/Programming/UnixCode/_personal/Home/site"
( cd "$HOME_SITE" && bun run build:internal )
```

Expected: ends with `[build] Complete!`.

- [ ] **Step 2: Extract + transform into the include**

Write this script to `$HOME_SITE/_deckplan_extract.mjs` (it runs there so `node-html-parser` resolves), then run it with `bun`:

```js
import { readFileSync, writeFileSync } from "fs";
import { parse } from "node-html-parser";

const OUT = process.argv[2]; // absolute path to the htpc-site include
const root = parse(readFileSync("dist/index.html", "utf8"));
const div = root.querySelector('div[data-floor="pirateflix"][data-flow="true"]');
let svg = div.querySelector("svg.floor-svg").outerHTML;

// 1. logo hrefs -> site-hosted path (baseurl is /htpc; the include is not run through relative_url)
svg = svg.replaceAll('href="/logos/', 'href="/htpc/assets/blueprint/logos/');

// 2. Jellyseerr -> Seerr (label, data-node/data-service, edge data-a/data-b, <title>, logo filename)
svg = svg.replaceAll("Jellyseerr", "Seerr").replaceAll("jellyseerr", "seerr");

// 3. make the two helper nodes clickable/hoverable (source emits them as bare <g><title>…)
//    circle centers read from the built SVG: FlareSolverr (677,258), Jellystat (218,594)
svg = svg.replace(
  "<g><title>FlareSolverr</title>",
  '<g data-node="FlareSolverr" data-cx="677" data-cy="258" style="cursor:pointer"><title>FlareSolverr</title>',
);
svg = svg.replace(
  "<g><title>Jellystat</title>",
  '<g data-node="Jellystat" data-cx="218" data-cy="594" style="cursor:pointer"><title>Jellystat</title>',
);

writeFileSync(OUT, "<!-- Generated: one-time port of blueprint ?floor=pirateflix. Do not hand-edit; see docs/superpowers/plans/2026-07-05-deck-plan-blueprint-and-seerr.md Task 4. -->\n" + svg + "\n");
console.log("wrote", svg.length, "bytes");
```

```bash
HOME_SITE="/mnt/c/Users/woute/Dropbox/Personal/Programming/UnixCode/_personal/Home/site"
INCLUDE="$(git rev-parse --show-toplevel)/_includes/pirate/deck-plan-svg.html"
# (write the script above to "$HOME_SITE/_deckplan_extract.mjs" first)
( cd "$HOME_SITE" && bun ./_deckplan_extract.mjs "$INCLUDE" && rm -f ./_deckplan_extract.mjs )
```

- [ ] **Step 3: Verify the transforms**

Run:
```bash
INCLUDE=_includes/pirate/deck-plan-svg.html
grep -c "jellyseerr\|Jellyseerr" "$INCLUDE"          # expect 0
grep -o 'data-service="Seerr"' "$INCLUDE" | head -1   # expect a match
grep -o 'href="/htpc/assets/blueprint/logos/seerr.svg"' "$INCLUDE" | head -1  # expect a match
grep -o 'data-node="FlareSolverr"' "$INCLUDE"         # expect a match
grep -o 'data-node="Jellystat"' "$INCLUDE"            # expect a match
grep -c 'href="/logos/' "$INCLUDE"                    # expect 0 (all rewritten)
```
Expected: first and last are `0`; the middle greps each print one match.

- [ ] **Step 4: Commit**

```bash
git add _includes/pirate/deck-plan-svg.html
git commit -m "Port pirateflix blueprint SVG into deck-plan include"
```

---

## Task 5: Panel content data — `_data/deck_plan.yml`

Keys must match the `data-node` values in the ported SVG: `Radarr, Sonarr, Prowlarr, qBittorrent, Bazarr, Seerr, Jellyfin, FlareSolverr, Jellystat`. Links hard-code the `/htpc` baseurl (data files aren't run through Liquid, matching the SVG include's hard-coded prefix). `screenshots` left empty (schema present for later).

**Files:**
- Create: `_data/deck_plan.yml`

- [ ] **Step 1: Write the file**

```yaml
# Detail-panel content for the /deck-plan/ diagram. Keys match the SVG node ids
# (data-node). Links hard-code the /htpc baseurl (YAML isn't processed by Liquid).
Radarr:
  title: Radarr
  logo: /htpc/assets/blueprint/logos/radarr.svg
  description: >
    The movie quartermaster. Watches for the films you want, grabs the best
    release the moment it appears, then renames and files it into your library.
  links:
    - { label: "Official site", url: "https://radarr.video" }
    - { label: "On the blog", url: "/htpc/blog/home-media-server/" }
  screenshots: []
Sonarr:
  title: Sonarr
  logo: /htpc/assets/blueprint/logos/sonarr.svg
  description: >
    The TV quartermaster. Follows your shows, grabs each new episode as it airs,
    and keeps every season tidily organised.
  links:
    - { label: "Official site", url: "https://sonarr.tv" }
    - { label: "On the blog", url: "/htpc/blog/home-media-server/" }
  screenshots: []
Prowlarr:
  title: Prowlarr
  logo: /htpc/assets/blueprint/logos/prowlarr.svg
  description: >
    The spyglass. One place to manage every indexer and tracker, feeding search
    results to Radarr and Sonarr so they always know where to look.
  links:
    - { label: "Official site", url: "https://prowlarr.com" }
    - { label: "On the blog", url: "/htpc/blog/home-media-server/" }
  screenshots: []
qBittorrent:
  title: qBittorrent
  logo: /htpc/assets/blueprint/logos/qbittorrent.svg
  description: >
    The cargo hold. Does the actual hauling — downloads the releases the *arr
    fleet orders and drops them where they can be imported.
  links:
    - { label: "Official site", url: "https://www.qbittorrent.org" }
    - { label: "On the blog", url: "/htpc/blog/home-media-server/" }
  screenshots: []
Bazarr:
  title: Bazarr
  logo: /htpc/assets/blueprint/logos/bazarr.svg
  description: >
    The translator. Follows your library and fetches matching subtitles in your
    languages, writing them alongside each film and episode.
  links:
    - { label: "Official site", url: "https://www.bazarr.media" }
    - { label: "On the blog", url: "/htpc/blog/home-media-server/" }
  screenshots: []
Seerr:
  title: Seerr
  logo: /htpc/assets/blueprint/logos/seerr.svg
  description: >
    The ship's log. The friendly request box for crew and guests — search a
    title, tap request, and the fleet takes it from there. The merged successor
    to Overseerr and Jellyseerr.
  links:
    - { label: "GitHub", url: "https://github.com/seerr-team/seerr" }
    - { label: "On the blog", url: "/htpc/blog/goodbye-ombi/" }
  screenshots: []
Jellyfin:
  title: Jellyfin
  logo: /htpc/assets/blueprint/logos/jellyfin.svg
  description: >
    Home port. The media server that streams everything the fleet brings in to
    every telly, phone and browser in the house.
  links:
    - { label: "Official site", url: "https://jellyfin.org" }
    - { label: "On the blog", url: "/htpc/blog/home-media-server/" }
  screenshots: []
FlareSolverr:
  title: FlareSolverr
  logo: /htpc/assets/blueprint/logos/flaresolverr.svg
  description: >
    Prowlarr's first mate. A proxy that clears Cloudflare challenges so indexers
    behind them stay reachable.
  links:
    - { label: "GitHub", url: "https://github.com/FlareSolverr/FlareSolverr" }
  screenshots: []
Jellystat:
  title: Jellystat
  logo: /htpc/assets/blueprint/logos/jellystat.svg
  description: >
    Jellyfin's logbook. Watch statistics and history for your media server —
    who watched what, and how often.
  links:
    - { label: "GitHub", url: "https://github.com/CyferShepard/Jellystat" }
  screenshots: []
```

- [ ] **Step 2: Verify it parses**

Run: `ruby -ryaml -e 'p YAML.load_file("_data/deck_plan.yml").keys' 2>/dev/null || bun -e 'import("yaml").then(async y=>{const {readFileSync}=await import("fs");console.log(Object.keys(y.parse(readFileSync("_data/deck_plan.yml","utf8"))))})'`
Expected: the 9 keys printed.

- [ ] **Step 3: Commit**

```bash
git add _data/deck_plan.yml
git commit -m "Add deck-plan panel content data"
```

---

## Task 6: Interactive JS — `blueprint.js` (+ unit tests, TDD)

Pure helpers first (tested), then DOM wiring. Loaded as an ES module; the guard `if (typeof document !== "undefined")` keeps `init()` from running under `bun test` (same pattern as `assets/js/image-zoom.js`).

**Files:**
- Create: `assets/js/blueprint.js`, `test/blueprint.test.js`

- [ ] **Step 1: Write the failing test**

`test/blueprint.test.js`:

```js
import { expect, test, describe } from "bun:test";
import { isTap, contentFor } from "../assets/js/blueprint.js";

describe("isTap", () => {
  test("true for a still, quick pointer gesture", () => {
    expect(isTap({ x: 100, y: 100, t: 0 }, { x: 103, y: 102, t: 120 })).toBe(true);
  });
  test("false when the pointer moved too far (a pan/drag)", () => {
    expect(isTap({ x: 100, y: 100, t: 0 }, { x: 140, y: 100, t: 120 })).toBe(false);
  });
  test("false when the gesture was too slow (a long press/drag)", () => {
    expect(isTap({ x: 100, y: 100, t: 0 }, { x: 101, y: 101, t: 900 })).toBe(false);
  });
  test("false when there was no pointerdown", () => {
    expect(isTap(null, { x: 100, y: 100, t: 10 })).toBe(false);
  });
});

describe("contentFor", () => {
  const data = { Radarr: { title: "Radarr" } };
  test("returns the entry for a known node id", () => {
    expect(contentFor("Radarr", data)).toEqual({ title: "Radarr" });
  });
  test("returns null for a node with no entry", () => {
    expect(contentFor("Torrents", data)).toBeNull();
  });
  test("returns null for a missing id", () => {
    expect(contentFor(undefined, data)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test test/blueprint.test.js`
Expected: FAIL — cannot resolve `../assets/js/blueprint.js`.

- [ ] **Step 3: Write `assets/js/blueprint.js`**

```js
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
  const panel = document.getElementById("deck-panel");
  if (!panel) return;
  const q = (sel) => panel.querySelector(sel);

  function openPanel(entry) {
    q(".dp-logo").src = entry.logo || "";
    q(".dp-logo").alt = entry.title || "";
    q(".dp-title").textContent = entry.title || "";
    q(".dp-desc").textContent = entry.description || "";
    q(".dp-links").innerHTML = (entry.links || [])
      .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join("");
    q(".dp-shots").innerHTML = (entry.screenshots || [])
      .map((s) => `<img src="${s}" alt="" loading="lazy">`).join("");
    panel.classList.add("open");
  }
  const closePanel = () => panel.classList.remove("open");

  function openFromTarget(target) {
    const node = target.closest?.("[data-node]");
    const entry = node && contentFor(node.dataset.node, data);
    if (entry) openPanel(entry);
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test test/blueprint.test.js`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add assets/js/blueprint.js test/blueprint.test.js
git commit -m "Add deck-plan interactive JS (pan/zoom, highlight, panel)"
```

---

## Task 7: Styles — `_blueprint.scss`

**Files:**
- Create: `_sass/_blueprint.scss`
- Modify: `assets/style.scss`

- [ ] **Step 1: Write `_sass/_blueprint.scss`**

```scss
// Deck Plan diagram + detail panel. The ported SVG paints its own #0f172a
// background, so these rules cover only sizing, the hover-highlight state, and
// the slide-in panel.

.deck-intro {
  text-align: center;
  padding: 1.5rem 1rem 0.5rem;

  h1 { margin: 0 0 .3rem; }
  p { margin: 0 auto; max-width: 46rem; color: #94a3b8; }
}

.deck-stage {
  position: relative;
  height: calc(100vh - 200px);
  min-height: 420px;
  margin: 0 1rem 1rem;
  border: 1px solid #1f2a3a;
  border-radius: 10px;
  overflow: hidden;
  background: #0f172a;
}

.floor-svg { width: 100%; height: 100%; }

// hover-highlight (mirrors the source blueprint's flow rules)
[data-node] { cursor: pointer; }
.conn { transition: opacity .12s ease, stroke .12s ease, stroke-width .12s ease; }
.conn.lit { stroke: #93c5fd; stroke-width: 2.5; opacity: 1; }
.group-box.lit { stroke: #93c5fd; stroke-width: 2.5; }
.lit .ring { stroke: #93c5fd; stroke-width: 3; }
.flow-node { cursor: default; }
.hl-svc.flow-node { cursor: pointer; }
.flow-back { display: none; } // the source's "← Kelder" pill is meaningless here

.deck-back {
  display: inline-block;
  margin: 0 1rem 2rem;
  color: #7dd3fc;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

// --- detail panel ---
#deck-panel {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: min(360px, 88vw);
  transform: translateX(100%);
  transition: transform .2s ease;
  background: #0b1220;
  border-left: 1px solid #1f2a3a;
  padding: 1.25rem 1.25rem 2rem;
  overflow-y: auto;
  color: #e2e8f0;
  z-index: 5;

  &.open { transform: translateX(0); }

  .dp-close {
    position: absolute; top: .5rem; right: .6rem;
    background: none; border: 0; color: #64748b;
    font-size: 1.5rem; line-height: 1; cursor: pointer;
    &:hover { color: #e2e8f0; }
  }
  .dp-logo { width: 48px; height: 48px; object-fit: contain; }
  .dp-title { margin: .5rem 0 .25rem; font-size: 1.3rem; }
  .dp-desc { color: #94a3b8; margin: 0 0 1rem; }
  .dp-links {
    display: flex; flex-wrap: wrap; gap: .5rem;
    a {
      padding: .35rem .7rem; border: 1px solid #334155; border-radius: 6px;
      color: #7dd3fc; text-decoration: none; font-size: .9rem;
      &:hover { border-color: #7dd3fc; }
    }
  }
  .dp-shots {
    margin-top: 1rem;
    img { width: 100%; border-radius: 6px; margin-bottom: .6rem; }
    &:empty { display: none; }
  }
}
```

- [ ] **Step 2: Wire the partial into the main stylesheet**

In `assets/style.scss`, add after the existing `@use "pirateflix";` line:

```scss
@use "blueprint";
```

- [ ] **Step 3: Verify Sass compiles (no build error, no warnings)**

Run: `bunx sass --quiet-deps _sass/_blueprint.scss:/dev/null 2>&1 | head; echo "exit: $?"`
Expected: no error output; exit `0`. (Standalone compile of the partial validates syntax; the site build in Task 10 validates full integration.)

- [ ] **Step 4: Commit**

```bash
git add _sass/_blueprint.scss assets/style.scss
git commit -m "Style the deck-plan diagram and detail panel"
```

---

## Task 8: Layout + page

**Files:**
- Create: `_layouts/deck-plan.html`, `deck-plan.html`

- [ ] **Step 1: Write `_layouts/deck-plan.html`**

Mirror the index chrome (`.pf` wrapper + pirate nav), then the diagram stage with the panel DOM, then the scripts. `svg-pan-zoom.min.js` loads as a classic script (sets `window.svgPanZoom`) before the module.

```html
---
layout: default
---
<div class="pf">
  {% include pirate/nav.html %}
  <div class="deck-intro">
    <h1>See how she sails.</h1>
    <p>The whole fleet at a glance — how a request becomes a film on your telly.
       Drag to pan, scroll to zoom, hover a rope to trace it, tap a crewmate to meet them.</p>
  </div>
  <div class="deck-stage">
    {% include pirate/deck-plan-svg.html %}
    <aside id="deck-panel" aria-label="Service details">
      <button class="dp-close" aria-label="Close">&times;</button>
      <img class="dp-logo" src="" alt="">
      <h2 class="dp-title"></h2>
      <p class="dp-desc"></p>
      <div class="dp-links"></div>
      <div class="dp-shots"></div>
    </aside>
  </div>
  <a class="deck-back" href="{{ '/' | relative_url }}">← Back to port</a>
  {% include pirate/footer.html %}
</div>

<script id="deck-plan-data" type="application/json">{{ site.data.deck_plan | jsonify }}</script>
<script src="{{ '/assets/js/svg-pan-zoom.min.js' | relative_url }}"></script>
<script type="module" src="{{ '/assets/js/blueprint.js' | relative_url }}"></script>
```

- [ ] **Step 2: Write `deck-plan.html` (the page)**

```html
---
layout: deck-plan
title: Deck Plan
permalink: /deck-plan/
---
```

- [ ] **Step 3: Verify front matter/layout resolve (built in Task 10)**

Run: `test -f _layouts/deck-plan.html && test -f deck-plan.html && echo OK`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add _layouts/deck-plan.html deck-plan.html
git commit -m "Add /deck-plan/ page and layout"
```

---

## Task 9: Repoint the hero button

**Files:**
- Modify: `_includes/pirate/hero.html:8`

- [ ] **Step 1: Change the button href from the `#how` anchor to the new page**

```html
    <a class="btn" href="{{ '/deck-plan/' | relative_url }}">See how she sails</a>
```

- [ ] **Step 2: Verify**

Run: `grep -n "See how she sails" _includes/pirate/hero.html`
Expected: the line now contains `href="{{ '/deck-plan/' | relative_url }}"`.

- [ ] **Step 3: Commit**

```bash
git add _includes/pirate/hero.html
git commit -m "Point hero 'See how she sails' at the deck-plan page"
```

---

## Task 10: Build + end-to-end verification

Jekyll runs on Windows Ruby; WSL can't reach a server bound on Windows. Use a **static build + local file/HTTP serve within WSL** for Playwright. (Do NOT rely on the Windows `jekyll serve` livereload from WSL — see the project's build-&-preview workflow.)

- [ ] **Step 1: Build the site (production, so livereload snippet is omitted)**

```bash
cd "$(git rev-parse --show-toplevel)"
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -15
```
Expected: `done in … seconds`, no errors. (If Ruby/Jekyll is Windows-only, run the build via the established Windows path per the build-&-preview workflow, outputting to `_site`.)

- [ ] **Step 2: Confirm the build artifacts exist and Seerr replaced Jellyseerr**

Run:
```bash
test -f _site/deck-plan/index.html && echo "page OK"
grep -c "jellyseerr\|Jellyseerr" _site/deck-plan/index.html   # expect 0
grep -o 'data-service="Seerr"' _site/deck-plan/index.html | head -1  # expect match
grep -c "Jellyseerr" _site/index.html                         # expect 0 (landing page)
ls _site/assets/blueprint/logos/ | wc -l                      # expect 9
```
Expected: `page OK`; the two counts are `0`; the middle grep matches; `9` logos.

- [ ] **Step 3: Drive it in a browser (verify skill / Playwright)**

Serve `_site` from WSL and open `/htpc/deck-plan/`:
```bash
( cd _site && python3 -m http.server 4000 >/dev/null 2>&1 & )
```
Then with Playwright verify:
1. Navigate to `http://localhost:4000/htpc/deck-plan/`.
2. `svg.floor-svg` is present and visible; logos render (no broken `<image>`).
3. Console has no errors; `window.svgPanZoom` is defined.
4. Hovering the `Radarr` node adds `.lit` to at least one `.conn` (evaluate: `document.querySelectorAll('.conn.lit').length > 0`).
5. Clicking the `Seerr` node opens the panel (`#deck-panel.open`) with title "Seerr" and the Seerr logo src ending `seerr.svg`.
6. Clicking a helper node (`[data-node="FlareSolverr"]`) opens the panel with title "FlareSolverr".
7. Pressing Escape closes the panel.
8. Navigate to `http://localhost:4000/htpc/` and confirm the hero "See how she sails" link points to `/htpc/deck-plan/`, and the crew grid shows "Seerr" with `assets/seerr.png`.

- [ ] **Step 4: Stop the server**

```bash
pkill -f "http.server 4000" || true
```

- [ ] **Step 5: Final commit (if verification required any fixes)**

```bash
git add -A && git commit -m "Verify deck-plan page end-to-end" || echo "nothing to commit"
```

---

## Self-review notes (already reconciled)

- **Spec coverage:** new page + layout (T8), hero repoint (T9), one-time SVG port with logo-rewrite + helper hit-targets + Jellyseerr→Seerr (T4), pan/zoom + highlight + panel (T6), panel content 9 nodes services+helpers (T5), Seerr swap in showcase (T1,T2), styles (T7), verification incl. "no Jellyseerr on landing/diagram" (T10). Blog posts untouched by design.
- **Node-id consistency:** `data-node` values confirmed from the built SVG — the 7 services carry `data-node`+`data-service`; helpers get `data-node` added in T4; `deck_plan.yml` keys (T5) match exactly, including `qBittorrent` capitalisation and `Seerr` (post-rename).
- **Data filename:** `_data/deck_plan.yml` (underscore) so `site.data.deck_plan` is valid Liquid.
- **Load order:** `svg-pan-zoom.min.js` (classic, global) before `blueprint.js` (module) — T8.
