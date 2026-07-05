# PirateFlix Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the reverse-chron post dump with a showcase-first, pirate-themed ("Dark Sea-Chart") Jekyll landing page that sells the media-automation dream and funnels into the existing guide series, then reskin the post pages to match.

**Architecture:** Stay on Jekyll; drop `minima`. Port the validated mock `_mockups/a-sea-chart.html` into a custom theme: one SCSS partial (`_sass/_pirateflix.scss`) for all styling, a set of focused `_includes/pirate/*.html` components composed by a rewritten `_layouts/index.html`, and a data-driven crew grid from `_data/crew.yml`. Post pages get a dark reskin via `_layouts/post.html` + the same partial. Image URLs stay in HTML includes (Liquid `relative_url`, because the site has `baseurl: /htpc`); SCSS carries no site-image `url()`s.

**Tech Stack:** Jekyll, Liquid, SCSS (Sass), kramdown, highlight.js. No new gems.

---

## Verification model (read first)

This is a static site — there is no unit-test runner. "Test" for each task means:

1. **Build:** `bundle exec jekyll build` exits 0 with no `Error`/`Warning` lines.
2. **Output assertion:** `grep` the generated `_site/**` HTML for expected markup.
3. **Visual check:** serve and screenshot (a helper is set up in Task 1) at desktop (1280px) and mobile (390px).

Commit after each task. Per the user's rule, **do not `git push`**; committing locally is fine.

## Source of truth

`_mockups/a-sea-chart.html` (already updated with the real `logo.png` + `hero.png`) is the visual reference. Its `<style>` block and section markup are the canonical CSS/HTML to port. Where a task says "port from the mock", copy that exact CSS/markup and apply only the noted Jekyll adjustments. Delete `_mockups/` in the final task.

## Asset inventory (already generated, in `assets/`)

`logo.png`, `hero.png`, and crew emblems `radarr.png`, `sonarr.png`, `qbittorrent.png`, `bazarr.png`, `jellyseerr.png`, `jellyfin.png`. Textures `compass-rose.png`, `rope.png`, `cartouche-frame.png`, `cartouche-frame-for-text.png`, `aged-chart.png`. **Missing:** `prowlarr.png` (Task 6 wires a placeholder that swaps in automatically once the file exists).

## File structure

| File | Action | Responsibility |
|------|--------|----------------|
| `_config.yml`                        | Modify | Remove `theme: minima`. |
| `assets/style.scss`                  | Modify | `@import "pirateflix";` (after existing imports). |
| `_sass/_pirateflix.scss`             | Create | All theme CSS: tokens, landing components, post reskin. |
| `_data/crew.yml`                     | Create | The 7 *arr tools → role, emblem, accent, blurb. |
| `_layouts/index.html`                | Rewrite | Compose landing-page includes. |
| `_includes/pirate/nav.html`          | Create | Top nav: logo emblem + wordmark + CTA. |
| `_includes/pirate/hero.html`         | Create | Headline, subhead, CTAs, hero backdrop, voyage-map. |
| `_includes/pirate/voyage-map.html`   | Create | Inline-SVG animated pipeline. |
| `_includes/pirate/grind-vs-fleet.html` | Create | Before/after two-card section. |
| `_includes/pirate/crew-grid.html`    | Create | Data-driven crew medallion grid. |
| `_includes/pirate/amplifiers.html`   | Create | "Why you want it" feature row. |
| `_includes/pirate/easy.html`         | Create | "It's easy — one docker-compose" band. |
| `_includes/pirate/course-path.html`  | Create | "Chart your course" chapters + "Captain's log". |
| `_includes/pirate/footer.html`       | Create | Footer: GitHub + homelab blueprint link. |
| `_layouts/default.html`              | Modify | Drop Google Fonts, load favicon from logo, keep stylesheet chain. |
| `_layouts/post.html`                 | Rewrite | Sea-chart post shell; keep TOC + series nav. |
| `favicon.png`                        | Replace | Square crop of `logo.png`. |
| `_mockups/`                          | Delete  | Throwaway; removed at the end. |

---

## Task 1: Preview helper + baseline build

**Files:** none (tooling only).

- [ ] **Step 1: Confirm the site builds today**

Run: `bundle exec jekyll build`
Expected: exits 0, populates `_site/`. If it fails, fix env before continuing.

- [ ] **Step 2: Add a reusable preview script**

Create `scripts/preview.sh`:

```bash
#!/usr/bin/env bash
# Serve _site and print the URL. Ctrl-C to stop.
set -e
bundle exec jekyll build
cd _site && python3 -m http.server 8899 --bind 127.0.0.1
```

Run: `chmod +x scripts/preview.sh`

- [ ] **Step 3: Verify preview serves**

Run: `./scripts/preview.sh &` then `sleep 3 && curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8899/htpc/` then `kill %1`
Expected: `200`.

- [ ] **Step 4: Commit**

```bash
git add scripts/preview.sh
git commit -m "chore: add local preview script"
```

---

## Task 2: Theme scaffolding — drop minima, wire the partial, favicon

**Files:**
- Modify: `_config.yml`
- Modify: `assets/style.scss`
- Create: `_sass/_pirateflix.scss`
- Modify: `_layouts/default.html`
- Replace: `favicon.png`

- [ ] **Step 1: Remove the minima theme line**

In `_config.yml`, delete the line `theme: minima` (and its adjacent comment lines referencing minima). Leave `plugins:` untouched.

- [ ] **Step 2: Create the theme partial with design tokens**

Create `_sass/_pirateflix.scss`. Port the `:root{ ... }` custom properties and the base/reset rules from the mock's `<style>` block (`_mockups/a-sea-chart.html`). Keep them as CSS custom properties (do NOT convert to Sass vars). **Do not** copy any `url('../assets/...')` rules — those move to HTML includes in later tasks. Start with just the `:root`, `body`, `.wrap`, and typography rules so the build stays green; later tasks append their component CSS to this file.

- [ ] **Step 3: Import the partial**

In `assets/style.scss`, add after the existing `@import` lines:

```scss
@import "pirateflix";
```

- [ ] **Step 4: Generate the favicon from the logo**

Run: `bundle exec ruby -e 'nil' 2>/dev/null; magick assets/logo.png -resize 64x64 favicon.png` (if `magick` is unavailable, use `convert assets/logo.png -resize 64x64 favicon.png`).
Expected: `favicon.png` updated (64×64).

- [ ] **Step 5: Trim default.html head**

In `_layouts/default.html`, remove the two Google Fonts `<link>` tags (Roboto Condensed, Open Sans) — the theme uses Georgia + system monospace. Leave the vendor CSS (`bootstrap`, `font-awesome`, `flaticon`, `font-mfizz`) and `assets/style.css` links in place; post pages still use them until Task 9.

- [ ] **Step 6: Build & verify**

Run: `bundle exec jekyll build`
Expected: exits 0. Then `grep -c "minima" _site/index.html || true` → the page still renders (minima was already overridden by local layouts; this confirms nothing broke).

- [ ] **Step 7: Commit**

```bash
git add _config.yml assets/style.scss _sass/_pirateflix.scss _layouts/default.html favicon.png
git commit -m "feat: scaffold pirate theme, drop minima, favicon from logo"
```

---

## Task 3: Landing nav + hero + voyage-map

**Files:**
- Create: `_includes/pirate/nav.html`, `_includes/pirate/hero.html`, `_includes/pirate/voyage-map.html`
- Rewrite: `_layouts/index.html`
- Modify: `_sass/_pirateflix.scss` (append nav/hero/chart CSS)

- [ ] **Step 1: Create the nav include**

Create `_includes/pirate/nav.html`:

```html
<nav class="pf-nav">
  <a class="brand" href="{{ '/' | relative_url }}">
    <img src="{{ '/assets/logo.png' | relative_url }}" alt="PirateFlix emblem">Pirate<b>Flix</b>
  </a>
  <a class="btn solid" href="#course">⚓ Set Sail</a>
</nav>
```

- [ ] **Step 2: Create the voyage-map include**

Create `_includes/pirate/voyage-map.html` and paste the entire `<svg ...>…</svg>` block from the hero section of `_mockups/a-sea-chart.html` verbatim (it has no image URLs, so no changes needed).

- [ ] **Step 3: Create the hero include**

Create `_includes/pirate/hero.html`. Port the `<section class="hero">…</section>` markup from the mock, with these adjustments: set the hero backdrop inline (SCSS carries no site-image URLs) and pull in the voyage-map include:

```html
<section class="hero"
  style="--hero-img:url('{{ '/assets/hero.png' | relative_url }}')">
  <span class="tag">Home media server · the *arr fleet</span>
  <h1>Stop swabbing the deck.<br><em>Let the fleet do the plundering.</em></h1>
  <p class="lead">No more hunting torrents, sorting folders, renaming files or chasing subtitles by hand.
    You just ask for a film — your crew sails the high seas and brings it home to port, subtitled, on your telly.</p>
  <div class="cta-row">
    <a class="btn solid" href="#course">Chart the course →</a>
    <a class="btn" href="#how">See how she sails</a>
  </div>
  <div class="chart">
    {% include pirate/voyage-map.html %}
  </div>
</section>
```

- [ ] **Step 4: Append nav/hero/chart CSS to the partial**

Append to `_sass/_pirateflix.scss` the `.pf-nav`/`.brand`/`.btn`/`.tag`/`h1`/`.lead`/`.hero`/`.cta-row`/`.chart`/`.route`/`.wp*`/`.ship` rules from the mock. Change the `.hero::before` background to use the custom property instead of a hardcoded path:

```scss
.hero::before{
  content:'';position:absolute;z-index:-1;top:-24px;bottom:0;
  left:calc(50% - 50vw);right:calc(50% - 50vw);
  background:linear-gradient(90deg,rgba(10,24,38,.97) 34%,rgba(10,24,38,.55) 70%,rgba(10,24,38,.85) 100%),
    var(--hero-img) center/cover no-repeat;
}
```

(The mock's `.brand`/`.brand img` rules already style the logo; keep them.)

- [ ] **Step 5: Rewrite the index layout**

Replace `_layouts/index.html` entirely with:

```html
---
layout: default
---
<div class="pf">
  {% include pirate/nav.html %}
  <div class="wrap">
    {% include pirate/hero.html %}
  </div>
</div>
```

- [ ] **Step 6: Build & assert**

Run: `bundle exec jekyll build`
Then: `grep -q "Let the fleet do the plundering" _site/index.html && grep -q "assets/logo.png" _site/index.html && echo OK`
Expected: `OK`.

- [ ] **Step 7: Visual check**

Run `./scripts/preview.sh &`, screenshot `http://127.0.0.1:8899/htpc/` at 1280px and 390px, confirm the hero headline is legible over the galleon and the voyage-map ship animates. `kill %1` when done.

- [ ] **Step 8: Commit**

```bash
git add _includes/pirate/nav.html _includes/pirate/hero.html _includes/pirate/voyage-map.html _layouts/index.html _sass/_pirateflix.scss
git commit -m "feat: landing nav, hero and voyage-map pipeline"
```

---

## Task 4: Grind-vs-fleet section

**Files:**
- Create: `_includes/pirate/grind-vs-fleet.html`
- Modify: `_layouts/index.html`, `_sass/_pirateflix.scss`

- [ ] **Step 1: Create the include**

Create `_includes/pirate/grind-vs-fleet.html`; port the "The old way was mutiny…" `<section>` from the mock verbatim (no image URLs). Add `id="how"` to the `<section>` so the hero's "See how she sails" anchor lands here.

- [ ] **Step 2: Append CSS**

Append the `.two`/`.card`/`.grind`/`.magic`/`h2`/`.sub` rules from the mock to `_sass/_pirateflix.scss`.

- [ ] **Step 3: Wire into index**

In `_layouts/index.html`, add `{% include pirate/grind-vs-fleet.html %}` after the hero, inside `.wrap`.

- [ ] **Step 4: Build & assert**

Run: `bundle exec jekyll build`
Then: `grep -q 'id="how"' _site/index.html && grep -q "With the fleet" _site/index.html && echo OK`
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add _includes/pirate/grind-vs-fleet.html _layouts/index.html _sass/_pirateflix.scss
git commit -m "feat: grind-vs-fleet before/after section"
```

---

## Task 5: Crew data file

**Files:**
- Create: `_data/crew.yml`

- [ ] **Step 1: Create the data file**

Create `_data/crew.yml`:

```yaml
- key: radarr
  name: Radarr
  role: Quartermaster · Films
  emblem: radarr.png
  accent: "#f59e0b"
  blurb: Hunts, grabs & files every movie you want.
- key: sonarr
  name: Sonarr
  role: Quartermaster · TV
  emblem: sonarr.png
  accent: "#34d399"
  blurb: Follows your shows, grabs each new episode.
- key: prowlarr
  name: Prowlarr
  role: The Spyglass
  emblem: prowlarr.png
  accent: "#38bdf8"
  blurb: Scans every indexer on the high seas.
- key: qbittorrent
  name: qBittorrent
  role: The Cargo Hold
  emblem: qbittorrent.png
  accent: "#a78bfa"
  blurb: Does the actual hauling, quietly.
- key: bazarr
  name: Bazarr
  role: The Translator
  emblem: bazarr.png
  accent: "#22d3ee"
  blurb: Finds & syncs subtitles in your tongue.
- key: jellyseerr
  name: Jellyseerr
  role: The Ship's Log
  emblem: jellyseerr.png
  accent: "#e2564a"
  blurb: Crew & guests request titles with a tap.
- key: jellyfin
  name: Jellyfin
  role: Home Port
  emblem: jellyfin.png
  accent: "#e0b34a"
  blurb: Streams it all to every telly in the house.
```

- [ ] **Step 2: Build & assert**

Run: `bundle exec jekyll build` (exits 0 — data files can't break the build unless malformed YAML). Then `bundle exec ruby -ryaml -e 'YAML.load_file("_data/crew.yml").size == 7 or abort("bad")' && echo OK`.
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add _data/crew.yml
git commit -m "feat: crew roster data for the fleet grid"
```

---

## Task 6: Data-driven crew grid (with prowlarr placeholder)

**Files:**
- Create: `_includes/pirate/crew-grid.html`
- Modify: `_layouts/index.html`, `_sass/_pirateflix.scss`

- [ ] **Step 1: Create the crew-grid include**

Create `_includes/pirate/crew-grid.html`. It loops `site.data.crew` and renders emblem medallions. If an emblem file is absent (e.g. prowlarr), fall back to `logo.png` so the grid never shows a broken image:

```html
<section id="crew">
  <h2>Meet the crew.</h2>
  <p class="sub">Seven little containers, one <code>docker-compose up</code>, running by supper.</p>
  <div class="fleet">
    {% for c in site.data.crew %}
      {% assign emblem = '/assets/' | append: c.emblem %}
      {% unless site.static_files | where: "path", emblem | first %}
        {% assign emblem = '/assets/logo.png' %}
      {% endunless %}
      <div class="crew" style="--c:{{ c.accent }}">
        <img class="emblem" src="{{ emblem | relative_url }}" alt="{{ c.name }} emblem" loading="lazy">
        <div class="n">{{ c.name }}</div>
        <div class="r">{{ c.role }}</div>
        <div class="d">{{ c.blurb }}</div>
      </div>
    {% endfor %}
  </div>
</section>
```

- [ ] **Step 2: Append CSS**

Append the `.fleet`/`.crew`/`.crew .n`/`.crew .r`/`.crew .d` rules from the mock, plus a new emblem rule:

```scss
.crew .emblem{width:88px;height:88px;object-fit:contain;display:block;margin:0 auto 12px;
  filter:drop-shadow(0 3px 8px rgba(0,0,0,.45))}
.crew{text-align:center}
```

- [ ] **Step 3: Wire into index**

In `_layouts/index.html`, add `{% include pirate/crew-grid.html %}` after grind-vs-fleet.

- [ ] **Step 4: Build & assert**

Run: `bundle exec jekyll build`
Then: `grep -o 'assets/[a-z]*\.png' _site/index.html | sort -u` — expect radarr/sonarr/qbittorrent/bazarr/jellyseerr/jellyfin emblems present, and prowlarr rendered as `logo.png` fallback until its emblem lands.
Expected: 6 crew emblems + logo fallback, no `prowlarr.png` reference.

- [ ] **Step 5: Commit**

```bash
git add _includes/pirate/crew-grid.html _layouts/index.html _sass/_pirateflix.scss
git commit -m "feat: data-driven crew grid with emblem fallback"
```

---

## Task 7: Amplifiers + "it's easy" bands

**Files:**
- Create: `_includes/pirate/amplifiers.html`, `_includes/pirate/easy.html`
- Modify: `_layouts/index.html`, `_sass/_pirateflix.scss`

- [ ] **Step 1: Create the amplifiers include**

Create `_includes/pirate/amplifiers.html` — the "Why you actually want it" section. Reuse the existing `.fleet`/`.crew` card styling (no new CSS needed) with three cards:

```html
<section id="why">
  <h2>Why you actually want it.</h2>
  <p class="sub">The bits that turn "a media server" into "never think about it again".</p>
  <div class="fleet">
    <div class="crew" style="--c:#4fd8c4"><div class="n">Follow the tides</div><div class="r">Lists & watchlists</div><div class="d">Follow IMDb / Trakt lists — new releases sail in automatically.</div></div>
    <div class="crew" style="--c:#e0b34a"><div class="n">Word from the crow's nest</div><div class="r">Notifications</div><div class="d">Pinged the moment a title lands, however you like.</div></div>
    <div class="crew" style="--c:#e2564a"><div class="n">Requests from the crew</div><div class="r">Friends & family</div><div class="d">They ask in Jellyseerr; the fleet delivers.</div></div>
  </div>
</section>
```

- [ ] **Step 2: Create the easy include**

Create `_includes/pirate/easy.html`:

```html
<section id="easy" class="easy">
  <h2>And she's easy to launch.</h2>
  <p class="sub">One <code>docker-compose up</code>, a handful of containers, running by supper — the guides walk you through every line.</p>
  <a class="btn solid" href="#course">Chart your course →</a>
</section>
```

- [ ] **Step 3: Append CSS**

Append to `_sass/_pirateflix.scss`:

```scss
.easy{text-align:center}
.easy .btn{margin-top:22px}
```

- [ ] **Step 4: Wire into index**

In `_layouts/index.html`, add both includes after the crew grid, in order: amplifiers, then easy.

- [ ] **Step 5: Build & assert**

Run: `bundle exec jekyll build`
Then: `grep -q 'id="why"' _site/index.html && grep -q 'id="easy"' _site/index.html && echo OK`
Expected: `OK`.

- [ ] **Step 6: Commit**

```bash
git add _includes/pirate/amplifiers.html _includes/pirate/easy.html _layouts/index.html _sass/_pirateflix.scss
git commit -m "feat: amplifiers and it's-easy sections"
```

---

## Task 8: "Chart your course" + "Captain's log" + footer

**Files:**
- Create: `_includes/pirate/course-path.html`, `_includes/pirate/footer.html`
- Modify: `_layouts/index.html`, `_sass/_pirateflix.scss`

- [ ] **Step 1: Create the course-path include**

Create `_includes/pirate/course-path.html`. All posts carry `series: home-media-server`; the 2020 posts are the guided chapters, later posts are log entries. Split by year:

```html
<section id="course">
  <h2>Chart your course.</h2>
  <p class="sub">Follow the voyage from empty NAS to your own bottomless cinema.</p>
  {% assign series_posts = site.posts | where: "series", "home-media-server" | sort: "date" %}
  <ol class="course">
    {% for post in series_posts %}
      {% assign yr = post.date | date: "%Y" %}
      {% if yr == "2020" %}
        <li>
          <a href="{{ post.url | relative_url }}">
            <span class="ttl">{{ post.title | escape }}</span>
            {% if post.subTitle %}<span class="sub-ttl">{{ post.subTitle | escape }}</span>{% endif %}
          </a>
        </li>
      {% endif %}
    {% endfor %}
  </ol>

  <h3 class="logbook-heading">⚓ Captain's log — later ports of call</h3>
  <ul class="logbook">
    {% for post in series_posts %}
      {% assign yr = post.date | date: "%Y" %}
      {% unless yr == "2020" %}
        <li>
          <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
          <span class="log-date">{{ post.date | date: "%b %Y" }}</span>
        </li>
      {% endunless %}
    {% endfor %}
  </ul>
</section>
```

- [ ] **Step 2: Create the footer include**

Create `_includes/pirate/footer.html`:

```html
<footer class="pf-footer">
  <div class="wrap">
    <a href="https://github.com/SanguPackage/htpc">GitHub</a>
    <a href="https://blueprint.lan.sangu.be/?floor=pirateflix">Homelab blueprint</a>
    <span>PirateFlix · sail responsibly ☠</span>
  </div>
</footer>
```

- [ ] **Step 3: Append CSS**

Append to `_sass/_pirateflix.scss`:

```scss
.course{counter-reset:step;list-style:none;padding:0;margin:0}
.course li{counter-increment:step;border:1px solid var(--line);border-radius:8px;
  background:var(--panel);margin:10px 0;padding:16px 18px 16px 62px;position:relative}
.course li::before{content:counter(step);position:absolute;left:16px;top:50%;transform:translateY(-50%);
  width:30px;height:30px;border:1px solid var(--brass);border-radius:50%;color:var(--brass);
  display:flex;align-items:center;justify-content:center;font:600 14px var(--mono)}
.course a{display:block;text-decoration:none}
.course .ttl{color:#fff;font-family:var(--serif);font-size:19px}
.course .sub-ttl{display:block;color:var(--muted);font-size:13px;margin-top:2px}
.logbook-heading{font-family:var(--serif);color:#fff;margin:34px 0 12px}
.logbook{list-style:none;padding:0;margin:0}
.logbook li{display:flex;justify-content:space-between;gap:12px;padding:10px 4px;border-bottom:1px solid var(--line)}
.logbook a{color:var(--teal);text-decoration:none}
.logbook .log-date{color:var(--muted);font-size:12px;white-space:nowrap}
.pf-footer{border-top:1px solid var(--line);margin-top:20px;padding:34px 0;color:var(--muted);font-size:13px}
.pf-footer .wrap{display:flex;gap:22px;flex-wrap:wrap;align-items:center}
.pf-footer a{color:var(--teal);text-decoration:none}
```

- [ ] **Step 4: Wire into index**

In `_layouts/index.html`, add `{% include pirate/course-path.html %}` after `easy`, then close `.wrap`, then add `{% include pirate/footer.html %}` (footer is full-width, outside `.wrap`). Final index layout body:

```html
---
layout: default
---
<div class="pf">
  {% include pirate/nav.html %}
  <div class="wrap">
    {% include pirate/hero.html %}
    {% include pirate/grind-vs-fleet.html %}
    {% include pirate/crew-grid.html %}
    {% include pirate/amplifiers.html %}
    {% include pirate/easy.html %}
    {% include pirate/course-path.html %}
  </div>
  {% include pirate/footer.html %}
</div>
```

- [ ] **Step 5: Build & assert**

Run: `bundle exec jekyll build`
Then: `grep -q "Chart your course" _site/index.html && grep -q "Captain.s log" _site/index.html && grep -c "course\">" _site/index.html`
Expected: matches found; the ordered list contains the six 2020 chapters and the logbook contains the 2022/2026 entries. Spot-check counts against `ls _posts | grep 2020 | wc -l` (6).

- [ ] **Step 6: Visual check**

Screenshot the full landing page; verify numbered chapters render with brass step badges and the logbook lists later posts with dates.

- [ ] **Step 7: Commit**

```bash
git add _includes/pirate/course-path.html _includes/pirate/footer.html _layouts/index.html _sass/_pirateflix.scss
git commit -m "feat: chart-your-course path, captain's log and footer"
```

---

## Task 9: Post-page reskin

**Files:**
- Rewrite: `_layouts/post.html`
- Modify: `_sass/_pirateflix.scss`

- [ ] **Step 1: Rewrite the post layout in the theme**

Replace `_layouts/post.html` with a sea-chart shell that keeps the existing TOC and series includes but drops the Bootstrap big-header for a themed one:

```html
---
layout: default
---
<div class="pf pf-post">
  {% include pirate/nav.html %}
  <div class="wrap">
    <header class="post-head">
      <a class="post-back" href="{{ '/' | relative_url }}">← Back to port</a>
      <h1>{{ page.title | escape }}</h1>
      {% if page.subTitle %}<p class="post-sub">{{ page.subTitle | escape }}</p>{% endif %}
      <div class="post-date"><i class="fa fa-clock-o"></i> {{ page.date | date: "%-d %b %Y" }}</div>
    </header>
    <div class="post-body">
      <article class="post-content">
        {{ content }}
      </article>
      <aside class="post-aside">
        {% include toc.html html=content toc=page.toc %}
        {% include blog/post-series.html %}
      </aside>
    </div>
    {% include blog/post-prev-next-links.html %}
  </div>
  {% include pirate/footer.html %}
</div>
```

- [ ] **Step 2: Append post CSS**

Append to `_sass/_pirateflix.scss` the post-page rules — dark reading surface, two-column body/aside, code blocks on navy, comfortable measure:

```scss
.pf-post .post-head{padding:40px 0 10px}
.pf-post .post-back{color:var(--teal);text-decoration:none;font-size:13px}
.pf-post h1{font-family:var(--serif);color:#fff;margin:12px 0 6px}
.pf-post .post-sub{color:var(--muted);font-size:18px;margin:0 0 6px}
.pf-post .post-date{color:var(--muted);font-size:13px}
.post-body{display:grid;grid-template-columns:1fr 300px;gap:36px;padding:24px 0}
.post-content{color:var(--ink);max-width:72ch;line-height:1.75}
.post-content h1,.post-content h2,.post-content h3{font-family:var(--serif);color:#fff;margin-top:1.6em}
.post-content a{color:var(--teal)}
.post-content pre,.post-content code{background:#0c2136;border:1px solid var(--line);border-radius:6px}
.post-content pre{padding:16px;overflow:auto}
.post-content code{padding:1px 6px;color:var(--brass)}
.post-content pre code{border:0;padding:0;color:var(--ink)}
.post-content img{max-width:100%;border:1px solid var(--line);border-radius:6px}
.post-aside .sidebar-heading{font-family:var(--serif);color:var(--brass);margin-bottom:8px}
.post-aside a{color:var(--teal)}
@media(max-width:820px){.post-body{grid-template-columns:1fr}}
```

- [ ] **Step 3: Build & assert**

Run: `bundle exec jekyll build`
Then pick a post: `grep -q "Back to port" _site/blog/*/*/index.html | head` and confirm the TOC + "Also in this series" still render: `grep -rl "Also in this series" _site/blog | head`.
Expected: themed header present; series + TOC intact.

- [ ] **Step 4: Visual check**

Screenshot a content-heavy post (e.g. `home-media-server`) at 1280px and 390px. Verify: readable body, dark code blocks, TOC in the aside on desktop and collapsed below on mobile, working series nav.

- [ ] **Step 5: Commit**

```bash
git add _layouts/post.html _sass/_pirateflix.scss
git commit -m "feat: reskin post pages in the sea-chart theme"
```

---

## Task 10: Texture polish, responsive sweep, cleanup

**Files:**
- Modify: `_includes/pirate/*.html`, `_sass/_pirateflix.scss`
- Delete: `_mockups/`

- [ ] **Step 1: Add subtle textures**

Give alternating sections a faint compass-rose watermark and a rope divider, applied inline (baseurl-safe). Example on the crew section wrapper in `_includes/pirate/crew-grid.html`, add to the opening tag:

```html
<section id="crew" style="--rose:url('{{ '/assets/compass-rose.png' | relative_url }}')">
```

and in the partial:

```scss
#crew{position:relative}
#crew::after{content:'';position:absolute;inset:0;z-index:-1;opacity:.05;
  background:var(--rose) center/420px no-repeat}
```

Keep it subtle (opacity ≤ .06) — verify text contrast stays high.

- [ ] **Step 2: Responsive sweep**

Screenshot landing + one post at 390px, 768px, 1280px. Fix any horizontal overflow: wide tables/code blocks inside posts must scroll in their own container, not the page. Confirm the voyage-map SVG scales (it uses `viewBox`, so it should).

- [ ] **Step 3: Confirm prowlarr fallback note**

Run: `ls assets/prowlarr.png 2>/dev/null && echo "emblem present — grid now shows it" || echo "still using logo fallback (fine)"`. No code change needed either way (Task 6 handles it).

- [ ] **Step 4: Remove the mockups**

Run: `git rm -r _mockups && bundle exec jekyll build`
Expected: exits 0; `_mockups` gone.

- [ ] **Step 5: Final full-site build check**

Run: `bundle exec jekyll build 2>&1 | grep -iE "error|warning" || echo "clean"`
Expected: `clean`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "polish: textures, responsive fixes, remove mockups"
```

---

## Self-review notes

- **Spec coverage:** positioning/funnel → Tasks 3–8; Dark Sea-Chart aesthetic → Task 2 + per-section CSS; data-driven crew → Tasks 5–6; series "Chart your course" + "Captain's log" → Task 8; post reskin → Task 9; asset inventory + prowlarr gap → Tasks 5/6/10; drop minima / stay Jekyll → Task 2; keep TOC/series/gist/github-stars → Task 9 keeps includes intact. Textures → Task 10.
- **Deferred by design:** the standalone-vs-series distinction collapsed (all posts are in the series), resolved via the 2020-vs-later split in Task 8.
- **Prowlarr:** the only missing asset; the grid degrades to the logo emblem until `assets/prowlarr.png` exists — no code change needed when it lands.
