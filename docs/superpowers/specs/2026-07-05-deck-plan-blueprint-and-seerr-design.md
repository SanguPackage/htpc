# Deck Plan page (ported pirateflix blueprint) + Seerr swap

Date: 2026-07-05

## Goal

Two related changes to the pirate landing site:

1. **New "Deck Plan" page** at `/htpc/deck-plan/`, reached from the hero's **"See how she sails"** button (currently a `#how` anchor). It shows the pirateflix dataflow diagram — a **one-time static port** of the interactive display at `https://blueprint.lan.sangu.be/?floor=pirateflix` (source: Astro project in `_personal/Home/site`) — with working **pan/zoom**, **hover-highlight**, and a **click-to-open detail panel** carrying custom content.
2. **Rename Jellyseerr → Seerr** on the landing site (showcase only; blog posts keep their historical Jellyseerr references).

## Constraints

- The blog is public (`https://sangu.be/htpc`, Jekyll, `baseurl: /htpc`). The blueprint lives only at an internal `.lan` address, so **no live embed / iframe** — the diagram must be a self-contained copy.
- The source diagram is fully pre-rendered SVG at build time; the browser never fetches data. Pan/zoom and hover-highlight are self-contained. (Confirmed by tracing the Astro pipeline.)
- User rules: TDD where there's testable logic; no committing/dep-installs without asking; `bun`/`bunx` not npm; zero linter warnings.

## Non-goals

- No changes to the source Astro blueprint project (`_personal/Home`). This is a copy *into* the Jekyll site.
- The source panel's device-photo/service-chain content is **not** ported; the panel is repurposed with custom content (below).
- Blog posts (`goodbye-ombi`, `lists-part2`, `home-media-server`) are left as-is — they intentionally narrate the Ombi → Jellyseerr → Seerr history.

---

## Part A — Deck Plan page + blueprint port

### A1. The page and layout

- New page `deck-plan.html` → URL `/htpc/deck-plan/` (front matter `title: Deck Plan`, `permalink: /deck-plan/`).
- New layout `_layouts/deck-plan.html` mirroring the index chrome: `.pf` wrapper + `{% include pirate/nav.html %}`, a short pirate-themed intro heading, the diagram area, the detail-panel DOM, a "← Back to port" link, and the pirate footer. Loads `svg-pan-zoom.min.js` then `blueprint.js` at end of body.
- Hero change: `_includes/pirate/hero.html` line 8 — `href="#how"` → `href="{{ '/deck-plan/' | relative_url }}"`. Button text unchanged ("See how she sails"). The `#how` section stays reachable by scroll from the other CTA.

### A2. Porting the SVG (one-time copy)

- Build the Home Astro site once (`cd _personal/Home/site && bun run build:internal`), read `dist/index.html`, extract the inner HTML of `<div … data-floor="pirateflix" data-flow="true">` — the single `<svg class="floor-svg" viewBox="0 0 1040 740">…</svg>`. Store it in `_includes/pirate/deck-plan-svg.html`.
- Two transforms on the extracted markup:
  1. **Logo href rewrite:** the emitted `<image href="/logos/NAME.svg">` prefix → `{{ '/assets/blueprint/logos/' }}NAME.svg`. Because the include isn't run through relative_url per-image, hard-code the `/htpc/assets/blueprint/logos/` prefix (or wrap the include so Liquid resolves it — simplest: literal `/htpc/...` prefix, matching the site's baseurl).
  2. **Jellyseerr → Seerr:** global replace `jellyseerr` → `seerr` and `Jellyseerr` → `Seerr` within the SVG. This updates the node label, `data-node`/`data-service`, the edge `data-a`/`data-b` endpoints, the `<title>`, and the logo filename (`jellyseerr.svg` → `seerr.svg`) consistently, so hover-highlight and the panel key stay wired.

### A3. Assets

- **Logos** → `assets/blueprint/logos/` (SVG, referenced by the diagram): copy `bazarr, qbittorrent, prowlarr, flaresolverr, radarr, sonarr, jellyfin, jellystat` from `_personal/Home/site/public/logos/`, plus **`seerr.svg`** (fetched from the Seerr GitHub repo) replacing `jellyseerr.svg`.
- **svg-pan-zoom** → copy `svg-pan-zoom.min.js` (from Home `node_modules/svg-pan-zoom/dist/`) to `assets/js/`. UMD global `svgPanZoom`. (Vendored file, not a package-manager dep.)

### A4. Client JS — `assets/js/blueprint.js`

Three responsibilities, ported to plain browser JS (source is TypeScript):

1. **Pan/zoom:** `svgPanZoom(document.querySelector('svg.floor-svg'), { controlIconsEnabled:false, fit:true, center:true, minZoom:0.4, maxZoom:12, dblClickZoomEnabled:false, zoomScaleSensitivity:0.3 })`.
2. **Hover-highlight:** port `highlight.ts` — on `mouseenter`/`mouseleave` of every `[data-node]`, add/remove `.lit` on `.conn[data-a|data-b=id]`, the far-end `[data-node]`, `.reveal-line[data-reveal=id]`, and any `.group-box` whose rect (from `data-cx`/`data-cy`) contains the lit centers.
3. **Detail panel:** read an embedded `<script type="application/json" id="deck-plan-data">` blob (emitted by the page via `{{ site.data.deck_plan | jsonify }}`). Clickable nodes are the 9 service/helper nodes that have a data entry. On a genuine click (tap-vs-drag guarded, since svg-pan-zoom swallows clicks — port the pointerdown/up tap detector from `floorplan.ts`), populate and open the panel; close on the close button, `Escape`, or outside-click.

**Helper nodes:** verify during implementation whether the source emits individually-clickable targets for the sidecar helpers (FlareSolverr, Jellystat). If they render only as decorative circles inside the parent group, add `data-node`/click hit-targets for them in the ported SVG so they can open panels.

Extract pure helpers (tap-vs-drag detector, node→content lookup) so they're unit-testable.

### A5. Panel content — `_data/deck-plan.yml`

New data file authored for this page. One entry per clickable node, keyed by the node's `data-node` id as it appears in the ported SVG:

```yaml
Radarr:
  title: Radarr
  logo: /assets/blueprint/logos/radarr.svg
  description: >
    ...
  links:
    - { label: "Official site", url: "https://radarr.video" }
    - { label: "On the blog", url: "..." }
  screenshots: []   # optional; empty for now
```

Nodes: `Radarr, Sonarr, Prowlarr, qBittorrent, Bazarr, Seerr, Jellyfin, FlareSolverr, Jellystat`. `description` is short prose; `links` are label/url pairs (official site + relevant blog post where one exists); `screenshots` left empty initially (schema present so they can be added later without code change).

### A6. Styles — `_sass/_blueprint.scss`

`@use "blueprint";` added to `assets/style.scss`. Contains:
- Flow-diagram rules from the source (`.floor-layer` sizing → adapted to the page's diagram container height, `.floor-svg`, `.conn`/`.conn.lit`, `.group-box.lit`, `.reveal-line`, `.lit .ring`, `.flow-node`/`.hl-svc.flow-node`/`.flow-back`).
- Panel styles (slide-in `#deck-panel`, logo/title/description/links/screenshots layout, close button, backdrop) — themed to match the site's Dark Sea-Chart palette.
- Page intro/heading + back-link layout.

---

## Part B — Seerr swap (landing showcase)

- `_data/crew.yml`: the `jellyseerr` entry → `key: seerr`, `name: Seerr`, `emblem: seerr.png`. Role (`The Ship's Log`), accent, and blurb unchanged.
- `_includes/pirate/amplifiers.html` line 20: "They ask in Jellyseerr; the fleet delivers." → "They ask in Seerr; the fleet delivers."
- New `assets/seerr.png` — the Seerr logo as a PNG emblem (matching the other crew `.png` emblems), derived from / alongside the fetched Seerr SVG.
- The diagram's Jellyseerr → Seerr rename is handled in A2 (same swap, in the ported SVG).

---

## Data flow (page load)

1. Jekyll renders `deck-plan.html`: pirate nav + intro + `{% include pirate/deck-plan-svg.html %}` (static SVG) + panel DOM + `<script id="deck-plan-data">{{ site.data.deck_plan | jsonify }}</script>`.
2. Browser loads `svg-pan-zoom.min.js` then `blueprint.js`.
3. `blueprint.js`: inits pan/zoom on the SVG; wires hover-highlight on `[data-node]`; wires click → panel using the JSON blob.
4. Hover lights edges/nodes/groups; clicking a service node opens the panel with that node's logo/description/links/screenshots.

## Testing & verification

- **TDD** for the extractable pure JS: the tap-vs-drag detector and the node-id → content lookup (bun test against small pure functions split out of `blueprint.js`).
- **End-to-end** via the `verify`/`run` skill driving a local build in a browser (Playwright): `/deck-plan/` loads, SVG renders with logos, pan/zoom responds, hovering a node lights its edges, clicking a service node opens the panel with correct content, close works. Seerr appears (name + logo) in both the crew grid and the diagram; no "Jellyseerr" text remains on the landing page or diagram.
- Local Jekyll preview follows the project's build-&-preview workflow (Ruby runs on Windows; WSL can't reach Windows servers — use the established preview trick).

## Open implementation checks (resolve during build, not blocking design)

- Exact `data-node` string the source emits for each container node (to key `deck-plan.yml`) — read from the built SVG.
- Whether helper sidecars (FlareSolverr, Jellystat) are individually clickable or need added hit-targets.
- Confirm the logo href prefix produced by `build:internal` (base `/`) so the rewrite target is correct.
