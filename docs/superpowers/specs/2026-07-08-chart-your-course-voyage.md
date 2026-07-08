# "Chart your course" → scroll-scrubbed treasure-map voyage

**Status:** **integrated & live** in the `#course` homepage block. `leg-prototype.html` (repo root) remains the standalone playground and is now superseded by the real files.
**Live files:** `_includes/pirate/course-path.html` (scene markup + `#i-ship` symbol + `<script>` tag), `_sass/_pirateflix.scss` (`#course` voyage rules), `assets/js/course-voyage.js` (scroll scrub, scoped to `#course`), `assets/pirate/{storm,skull-island,sea-serpent,treasure-island}.webp` (560px, transparent).
**Build note:** Jekyll/Ruby is Windows-only (WSL can't run it); SCSS validated with dart-sass (`bunx sass`), integration validated with a static harness (compiled CSS + real JS + resolved-Liquid markup) driven in a browser.

## Concept
Replace the flat 3-card "Chart your course" homepage block with a treasure-map **voyage**: the three step-cards (01 Understand / 02 Build / 03 Command) are ports scattered in a staggered layout, connected by a dashed nautical course the visitor "sails" by scrolling. The cards themselves are **unchanged** from the committed design — the map is built *around* them.

## Narrative / route (in order)
card 1 (Understand) → **storm** + a red **dead-end fork to the skull-cliffs** ("wrong way ✗") → card 2 (Build) → **sail around the sea-serpent** ("here be dragons") + whirlpool → card 3 (Command) → the course sails *on past Command* to the **treasure island where X marks the spot** (the payoff / end destination).

## Interaction mechanics (all working in the prototype)
- **Scroll-scrubbed**: a single progress value `--p` (0→1) is driven by scroll position (JS `frame()` on scroll, rAF-throttled). Ship position = `--p`. Fully **reversible** — scroll up retracts.
- **Ship draws the course behind it**: the dotted course is revealed by an SVG `<mask>` whose stroke-dashoffset follows `--p` (`1 - p`). Path ahead of the ship is undrawn.
- **One continuous path** (no `M` subpath jump) — the earlier two-subpath version broke retraction between cards 2 & 3. The ship passes *behind* cards 2 & 3 (z-index) = "docking".
- **Ship** uses CSS `offset-path` = the same path `d`; `offset-distance: calc(var(--p)*100%)`.
- **Props** (storm, cliffs, skull, serpent, island, whirlpool, waves) fade in via `opacity: clamp(0, calc((var(--p) - threshold)*k), max)` — reveal as the ship approaches, retract on scroll-up.
- **Sea = pure CSS** (no background image): graticule grid (`repeating-linear-gradient`) + a ghosted compass-rose watermark (inline SVG data-URI). Decision: do NOT use a generated background image; spend the art budget on the props.
- **Responsive**: the fixed 1000px-wide "leg" is `transform: scale(var(--scale))` to fit the viewport (`--scale` set in JS, `.legwrap` height compensates). Below 700px it drops to a plain vertical stack (cards + dashed spine, no scene).

## Art plan (decided)
- **Style: engraved chart** — dense antique nautical engraving, **brass-on-deep-navy**. Confirmed on real generations; a "playful line-art" alternative (SVG, see `prop-styles.html` style lab) was explored and **rejected** — user prefers the rich engraving despite the register gap with the minimal card icons.
- Prompts: `VOYAGE_MID.md` (engraved brass-on-black, ready to paste). **All four done & wired** — `assets/charts/{storm,skull-island,sea-serpent,treasure-island}.png`, black baked to alpha, dropped into the scene slots. No SVG placeholder props remain.
- **Integration trick**: generate light engraving on **solid black**, then bake black→alpha (ImageMagick recipe in `VOYAGE_MID.md`: luminance→CopyOpacity, erase corner watermark, `-fuzz -trim`). Placed as a plain transparent `<img>` — no `mix-blend-mode` needed. Originals backed up in the session scratchpad.
- Props are positioned `<img>` in the scene slots (`.p-storm/.p-skull/.p-serpent/.p-island`); the old SVG placeholder symbols were removed as each was replaced.
- **Housekeeping before real-site integration**: move `assets/charts/*` voyage art → `assets/pirate/`, convert to `.webp`.

## Preview / self-review workflow (for the AI)
Ruby/Jekyll are on Windows (see memory `build-preview-workflow`); the prototype is standalone HTML so no build needed. To self-review renders from WSL:
```
python3 -m http.server 8899 --bind 127.0.0.1   # from repo root, background
```
Then Playwright MCP: navigate to `http://127.0.0.1:8899/leg-prototype.html`, screenshot. Scroll-scrubbed states can't be seen at rest — drive them by scrolling (`el.scrollIntoView`) or set `--p` + mask `strokeDashoffset` via `browser_evaluate`, then screenshot. NB: `innerHeight` in the automation browser is taller than the requested viewport — read it live, don't assume.

## Open adjustments (TODO — fill/expand with the user)
- [x] Dropped props: "wrong way ✗", waves, "here be dragons" text, compass-rose watermark.
- [x] Red dead-end fork now branches **at the storm** and climbs **up** to the skull-mountain (was hugging card 02).
- [x] Ship rides higher (tracking line `vh*0.6`, was `0.72`) → bottom margin so its motion is visible.
- [x] Ship banks toward horizontal travel (±25°, JS from path tangent), mast always up — never upside-down. `offset-rotate:0deg`.
- [x] Serpent centered on the direct card2→card3 line (~500,995); course detours wide (right + below) fully around it.
- [ ] Ship starts a touch early (before it's on-screen) — start it slightly later.
- [ ] Overall scroll length / scrub speed feel.

## Next steps
1. Work through the adjustments list against `leg-prototype.html` (self-review via the preview workflow above).
2. Draft engraved-art Midjourney prompts (brass-on-navy, on black for screen-blend); user generates; slot assets into the prop `<img>` positions.
3. Wire into the real `#course` section: port markup to `_includes/pirate/course-path.html`, styles into `_sass/_pirateflix.scss`, add the scroll JS file; keep the <700px stacked fallback.

## Not part of this work (leave alone)
Uncommitted parallel work exists in the tree: get-sailing "cargo hold" rewrite (`_layouts/get-sailing.html`, `gs-cargo-art.html`, `_data/get_sailing.yml`, `.pf.gs-page` SCSS) and a recyclarr post — another session's WIP. The committed voyage v1 (numbered step-cards, `#course`) is at commit `cf04448`; this redesign supersedes its layout.
