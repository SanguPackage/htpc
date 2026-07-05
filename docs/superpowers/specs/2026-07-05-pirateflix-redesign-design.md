# PirateFlix — HTPC site redesign

## Problem

The site is a reverse-chronological dump of blog posts. A visitor can't tell what it *is*
or why they'd want it. It should **sell the dream** (automate the entire media pipeline —
no manual torrent-hunting, sorting, renaming, or subtitle-chasing) and then **funnel** into
the existing guides that teach the how.

## Positioning

Showcase-first landing with a playful **pirate / nautical** theme — the pun writes itself:
`*arr = "arrr!"`, torrents = *sailing the high seas*, the payoff view is literally *pirateflix*.
Media **sets sail from the open sea (indexers/torrents) and comes home to port (your TV)**,
handled by the **\*arr crew**. Tone: fun, never at the expense of the actual information.

## Constraints / non-goals

- **Stay on Jekyll.** Drop the `minima` theme; build a custom theme. No content migration.
- Existing Markdown posts, front matter, gists, TOC, `series`, and `github-stars` includes must keep working.
- Keep current plugins (jemoji, jekyll-gist, jekyll-avatar, jekyll-redirect-from) and the manual highlight.js setup.
- Self-hosted; deployment pipeline unchanged.
- No unrelated refactoring of post content.

## Aesthetic — "Dark Sea-Chart"

Visual source of truth: `_mockups/a-sea-chart.html` (validated with real assets).

- **Palette:** sea `#0a1826`, panel `#102a40`, hairlines `#254a68`, ink `#cfe3f2`, muted `#7d9bb4`,
  brass `#e0b34a`, teal `#4fd8c4`, red `#e2564a`. Crew accents reuse the homelab node colors.
- **Type:** Georgia/serif display for headings (with brass italic emphasis), monospace for body/labels.
- **Motifs:** antique nautical chart — dashed sailing routes, compass rose, faint chart-line grid,
  brass hairline borders, engraving-style imagery.

## Information architecture

1. **Landing (`index`)** — the funnel:
   1. Hero: logo + headline + subhead + CTAs over the `hero.png` galleon backdrop (dark gradient overlay for legibility).
   2. Voyage-map pipeline: inline-SVG route with animated ship, `You → Fleet → Seas → Home Port → Your Telly`.
   3. The grind (before) vs the fleet (after) — two cards.
   4. Meet the crew — data-driven grid of the \*arr tools as medallion emblems, one line each.
   5. Why you want it — amplifiers: follow lists/watchlists, notifications, requests from friends & family.
   6. It's easy — one `docker-compose up`, N containers, running by supper.
   7. Start here — the series as a numbered path (see below).
   8. Footer — GitHub repo + link to the live homelab blueprint.
2. **Series presentation** — the `home-media-server` series becomes a numbered **"Chart your course"**
   path (Step 1…n), derived from posts carrying `series`, ordered by date. Standalone posts
   (goodbye-jackett, lists, notifications, LG TV, goodbye-transmission, recyclarr, goodbye-ombi,
   flaresolverr-byparr, …) group under **"Captain's log"** deep-dives. The list is derived, not hardcoded.
3. **Post pages** — reskinned in the theme: keep TOC + series prev/next nav, style code blocks on dark
   navy, comfortable reading measure. The voyage-map becomes a small recurring header motif.

## Assets (Midjourney)

Prompts live in `MIDJOURNEY_NEW_DESIGN.md`; consistency locked via `--sref` seeded from the logo/hero.

- **Done:** `logo.png`, `hero.png`; crew `radarr`, `sonarr`, `bazarr`, `qbittorrent`, `jellyseerr`.
- **TODO:** crew `prowlarr`, `jellyfin`; textures (compass watermark, rope divider, cartouche, chart paper).
- Wordmark stays CSS/SVG; the emblem is the raster logo (also traced to an SVG/PNG favicon).

## Build approach (Jekyll)

- Replace `minima`: new `_layouts/{default,index,post}.html` + `_sass` partials; remove the `theme:` line.
- Componentize via `_includes`: `nav`, `hero`, `voyage-map` (inline SVG), `crew-grid`, `course-path`,
  `captains-log`, `footer`. Keep each include focused.
- **Data-driven crew:** `_data/crew.yml` maps each tool → role name, emblem file, accent color, blurb,
  so the grid and any per-tool references render from data, not duplicated markup.
- Series path derived from `site.posts` filtered by `series` front matter, ordered by date.
- Keep `_mockups/` only until the real build lands, then delete.

## Testing / verification

- `bundle exec jekyll build` completes with no errors/warnings.
- Visual check of the landing page and one post page at desktop and mobile widths.
- TOC, series prev/next, `github-stars`, and gist embeds still render.
- All internal links resolve (no minima-era leftovers).

## Open items

- Generate the two missing crew emblems + the textures batch.
- Copy pass on crew blurbs and section headings.
