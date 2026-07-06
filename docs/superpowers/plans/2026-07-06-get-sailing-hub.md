# Get Sailing hub + homepage CTA restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add a curated, task-grouped "Get Sailing" hub page (nav + hero CTA into it) and convert the homepage's "Chart your course" list into 3 teaser cards, retiring the stale logbook.

**Architecture:** Jekyll static site. Reuse the existing `#why` accent-card pattern (`.fleet` grid of `.crew` cards) for both the homepage teaser and the hub. Hub content is data-driven from `_data/get_sailing.yml` (hard-coded `/htpc/...` URLs, matching the `_data/deck_plan.yml` convention). The homepage's 3 cards are hand-referenced via `{% post_url %}`.

**Tech Stack:** Jekyll / Liquid / SCSS (`_sass/_pirateflix.scss`), baseurl `/htpc`.

**Testing note:** This is static markup — there is no unit-test harness, and Ruby lives on Windows (WSL can't run `jekyll serve`). Per-task verification is: Liquid/HTML sanity by inspection, then a Jekyll **build** (attempted in WSL; if Ruby is unavailable, the user builds/previews on Windows) with **zero Liquid errors/warnings**, and a visual eyeball by the user. No Playwright screenshots (user eyeballs).

---

### Task 1: Hub data manifest

**Files:**
- Create: `_data/get_sailing.yml`

- [ ] **Step 1: Create the data file**

```yaml
# Card manifest for the /get-sailing/ hub. Rendered by _layouts/get-sailing.html.
# Links hard-code the /htpc baseurl (YAML isn't processed by Liquid) — same
# convention as _data/deck_plan.yml. Keep groups in build order (keel → sails →
# swaps → shore leave). Curated on purpose: adding a blog post does NOT auto-add
# a card here.
groups:
  - icon: "⚓"
    title: "Lay the keel"
    tagline: "The required build — do these three and you're sailing."
    accent: "#e0b34a"
    cards:
      - glyph: "🗺️"
        kicker: "Understand"
        title: "Home Media Server"
        payoff: "What each container does & why this crew."
        links:
          - { label: "Read the briefing →", url: "/htpc/blog/home-media-server/" }
          - { label: "Study the blueprint →", url: "/htpc/deck-plan/" }
      - glyph: "🧱"
        kicker: "Build"
        title: "Le Docker Compose"
        payoff: "Twelve containers, one file, docker compose up -d."
        links:
          - { label: "Copy-paste it →", url: "/htpc/blog/home-media-server-docker-compose/" }
      - glyph: "🧭"
        kicker: "Command"
        title: "Container Management"
        payoff: "One dashboard so you never memorise a port again."
        links:
          - { label: "Pick a dashboard →", url: "/htpc/blog/home-media-server-management/" }
  - icon: "⛵"
    title: "Trim the sails"
    tagline: "Optional — but this is the never-think-about-it-again magic."
    accent: "#4fd8c4"
    cards:
      - glyph: "🌊"
        kicker: "Lists & watchlists"
        title: "Follow the tides"
        payoff: "Follow IMDb / Trakt lists — new releases sail in on their own."
        links:
          - { label: "Follow the tides →", url: "/htpc/blog/lists/" }
      - glyph: "🔔"
        kicker: "Notifications"
        title: "Word from the crow's nest"
        payoff: "Pinged the moment a title lands, however you like."
        links:
          - { label: "Set the watch →", url: "/htpc/blog/notifications/" }
      - glyph: "📜"
        kicker: "Requests"
        title: "Requests from the crew"
        payoff: "Crew & guests ask in Seerr; the fleet delivers."
        links:
          - { label: "Open the request box →", url: "/htpc/blog/goodbye-ombi/" }
      - glyph: "♻️"
        kicker: "Recyclarr"
        title: "The quality quartermaster"
        payoff: "Auto-tuned quality profiles from the TRaSH guides — and why I said no."
        links:
          - { label: "Weigh it up →", url: "/htpc/blog/recyclarr/" }
      - glyph: "🗼"
        kicker: "Watchtower"
        title: "The self-updating fleet"
        payoff: "Auto-update the crew — and which containers to keep off it."
        links:
          - { label: "Set the watchtower →", url: "/htpc/blog/watchtower/" }
  - icon: "🔁"
    title: "Swap the crew"
    tagline: "Upgrades & migrations — trade a mate for a better one."
    accent: "#e2564a"
    cards:
      - glyph: "🦅"
        kicker: "Prowlarr"
        title: "Bye, Jackett"
        payoff: "One indexer manager that syncs every tracker into Sonarr/Radarr."
        links:
          - { label: "Make the swap →", url: "/htpc/blog/goodbye-jackett/" }
      - glyph: "🌀"
        kicker: "qBittorrent"
        title: "Bye, Transmission"
        payoff: "A faster, tidier download client that plays nicer with the fleet."
        links:
          - { label: "Make the swap →", url: "/htpc/blog/goodbye-transmission/" }
      - glyph: "☁️"
        kicker: "FlareSolverr"
        title: "Past the bouncer"
        payoff: "Clear Cloudflare challenges so blocked indexers stay reachable."
        links:
          - { label: "Get past the wall →", url: "/htpc/blog/flaresolverr-byparr/" }
  - icon: "🧭"
    title: "Shore leave"
    tagline: "Detours worth a wander before (or after) you sail."
    accent: "#8fb3c9"
    cards:
      - glyph: "🔄"
        kicker: "Alternatives"
        title: "Don't fancy the crew?"
        payoff: "Every crew member has a stand-in — here are the swaps."
        links:
          - { label: "Browse stand-ins →", url: "/htpc/blog/home-media-server-alternatives/" }
      - glyph: "📦"
        kicker: "Prebuilt Boxes"
        title: "Rather borrow than build?"
        payoff: "The all-in-one boxes, if you'd sooner not roll your own."
        links:
          - { label: "See the shortcuts →", url: "/htpc/blog/home-media-server-prebuilt-boxes/" }
```

- [ ] **Step 2: Verify YAML parses**

Run: `ruby -ryaml -e "YAML.load_file('_data/get_sailing.yml'); puts 'ok'"` (or any YAML linter available)
Expected: `ok` — no parse error. If Ruby is unavailable in WSL, skip; the Jekyll build in Task 6 will surface any YAML error.

- [ ] **Step 3: Commit**

```bash
git add _data/get_sailing.yml
git commit -m "Add Get Sailing hub card manifest"
```

---

### Task 2: Hub page + layout

**Files:**
- Create: `_layouts/get-sailing.html`
- Create: `get-sailing.html`

Models the header/back-to-port pattern from `_layouts/deck-plan.html`, then renders the groups from `site.data.get_sailing`.

- [ ] **Step 1: Create the layout**

`_layouts/get-sailing.html`:

```html
---
layout: default
---
<div class="pf gs-page">
  <header class="pf-nav deck-header">
    {% include pirate/brand.html %}
    <div class="deck-title">
      <h1 class="deck-heading">Get sailing.</h1>
      <p class="deck-subtitle">Every guide, shelved by the job it does<span class="subtitle-more"> — not the day it was written.</span></p>
    </div>
    <a class="btn" href="{{ '/' | relative_url }}">← Back to port</a>
  </header>

  <div class="wrap">
    {% for group in site.data.get_sailing.groups %}
    <section class="gs-group">
      <h2 class="gs-group-title">{{ group.icon }} {{ group.title }}</h2>
      <p class="sub">{{ group.tagline }}</p>
      <div class="fleet">
        {% for card in group.cards %}
        <div class="crew" style="--c:{{ group.accent }}">
          <div class="big">{{ card.glyph }}</div>
          <div class="n">{{ card.title }}</div>
          <div class="r">{{ card.kicker }}</div>
          <div class="d">{{ card.payoff }}</div>
          <div class="more">
            {% for link in card.links %}<a class="btn" href="{{ link.url }}">{{ link.label }}</a>{% endfor %}
          </div>
        </div>
        {% endfor %}
      </div>
    </section>
    {% endfor %}

    <p class="gs-footnote">Looking for the raw, chronological archive? <a href="{{ '/blog/' | relative_url }}">Read the Captain's Log →</a></p>
  </div>
  {% include pirate/footer.html %}
</div>
```

- [ ] **Step 2: Create the page stub**

`get-sailing.html`:

```html
---
layout: get-sailing
title: Get Sailing
permalink: /get-sailing/
---
```

- [ ] **Step 3: Verify by inspection**

Confirm: front matter references `layout: get-sailing`; the layout iterates `site.data.get_sailing.groups`; each card's `links` loop emits `.btn`s. (Rendered check happens in Task 6.)

- [ ] **Step 4: Commit**

```bash
git add _layouts/get-sailing.html get-sailing.html
git commit -m "Add Get Sailing hub page and layout"
```

---

### Task 3: Card + hub styles

**Files:**
- Modify: `_sass/_pirateflix.scss:163` (extend the shared accent-card selector) and `:186-202` (repurpose the course/logbook block)

- [ ] **Step 1: Extend the accent-card selector to the hub and homepage course cards**

Change line 163 from:

```scss
.pf #why, .pf #charts{
```

to:

```scss
.pf #why, .pf #charts, .pf #course, .pf .gs-group{
```

This gives the homepage "Chart your course" cards (now inside `#course`) and every hub card the same accent-washed `.crew` look (big faded glyph, per-card `--c`, CTA buttons) for free.

- [ ] **Step 2: Replace the dead course/logbook rules with hub layout + two-button support**

Replace lines 186-202 (the `// --- chart your course + captain's log + footer ---` block, i.e. the `.course`/`.course li`/`.course li::before`/`.course a`/`.course .ttl`/`.course .sub-ttl`/`.logbook*` rules) with:

```scss
// --- chart your course (homepage teaser) + get-sailing hub + footer ---
.pf{
  // #course and .gs-group cards borrow the #why accent-card look (see selector above).
  // Extras below: multi-button card footers and the course section's out-links.
  #why, #charts, #course, .gs-group{
    .more{display:flex;flex-wrap:wrap;gap:10px}   // two-button cards (card 01) wrap cleanly
  }
  .course-out{margin:22px 0 0;font-size:14px;color:var(--muted)}
  .course-out a{color:var(--teal);text-decoration:none}
  .course-out a + a{margin-left:18px}

  // get-sailing page
  .gs-group{margin:0 0 44px}
  .gs-group-title{font-family:var(--serif);color:#fff;font-size:26px;margin:0 0 4px}
  .gs-group .sub{margin:0 0 18px}
  .gs-footnote{color:var(--muted);font-size:14px;margin:8px 0 40px}
  .gs-footnote a{color:var(--teal);text-decoration:none}
}
```

Note: the `#course::after` compass-rose watermark (currently ~lines 205-208) stays untouched.

- [ ] **Step 3: Verify no stray references to removed classes**

Run: `grep -rn 'logbook\|\.course li\|sub-ttl\|log-date' _includes _layouts _sass`
Expected: no matches in `_includes`/`_layouts` (Task 4 removes the last `.logbook`/`.course li` markup). A remaining match means that template still uses a class we just deleted — fix it in Task 4.

- [ ] **Step 4: Commit**

```bash
git add _sass/_pirateflix.scss
git commit -m "Reuse accent-card styling for course teaser and Get Sailing hub"
```

---

### Task 4: Homepage "Chart your course" → 3 cards

**Files:**
- Modify (full body replace): `_includes/pirate/course-path.html`

Replaces the entire include — the date-filter `<ol class="course">`, the appended later-series loop (the earlier Watchtower patch), and the `<ul class="logbook">` all go away.

- [ ] **Step 1: Replace the include contents**

```html
<section id="course" style="--rose:url('{{ '/assets/compass-rose.webp' | relative_url }}')">
  <h2>Chart your course.</h2>
  <p class="sub">Three steps from empty NAS to your own bottomless cinema.</p>
  <div class="fleet">
    <div class="crew" style="--c:#e0b34a">
      <div class="big">🗺️</div>
      <div class="n">Home Media Server</div>
      <div class="r">01 · Understand</div>
      <div class="d">What each container does & why this crew.</div>
      <div class="more">
        <a class="btn" href="{% post_url 2020-07-19-home-media-server %}">Read the briefing →</a>
        <a class="btn" href="{{ '/deck-plan/' | relative_url }}">Study the blueprint →</a>
      </div>
    </div>
    <div class="crew" style="--c:#4fd8c4">
      <div class="big">🧱</div>
      <div class="n">Le Docker Compose</div>
      <div class="r">02 · Build</div>
      <div class="d">Twelve containers, one file, <code>up -d</code>, running by supper.</div>
      <div class="more">
        <a class="btn" href="{% post_url 2020-07-18-home-media-server-docker-compose %}">Copy-paste it →</a>
      </div>
    </div>
    <div class="crew" style="--c:#e2564a">
      <div class="big">🧭</div>
      <div class="n">Container Management</div>
      <div class="r">03 · Command</div>
      <div class="d">One dashboard so you never memorise a port again.</div>
      <div class="more">
        <a class="btn" href="{% post_url 2020-07-17-home-media-server-management %}">Pick a dashboard →</a>
      </div>
    </div>
  </div>
  <p class="course-out">
    <a href="{{ '/get-sailing/' | relative_url }}">See every guide → Get Sailing</a>
    <a href="{{ '/blog/' | relative_url }}">Or browse it all → Captain's Log</a>
  </p>
</section>
```

- [ ] **Step 2: Verify the referenced posts exist**

Run: `ls _posts/2020-07-19-home-media-server.md _posts/2020-07-18-home-media-server-docker-compose.md _posts/2020-07-17-home-media-server-management.md`
Expected: all three list without error (a bad `{% post_url %}` slug fails the Jekyll build).

- [ ] **Step 3: Commit**

```bash
git add _includes/pirate/course-path.html
git commit -m "Rework Chart your course into three teaser cards"
```

---

### Task 5: Hero CTA + nav

**Files:**
- Modify: `_includes/pirate/hero.html` (the `.cta-row` block)
- Modify: `_includes/pirate/nav.html` (the `.pf-nav-links` block)

- [ ] **Step 1: Repoint the hero primary button**

In `_includes/pirate/hero.html`, replace:

```html
    <a class="btn solid" href="#course">Chart the course →</a>
```

with:

```html
    <a class="btn solid" href="{{ '/get-sailing/' | relative_url }}">Get sailing →</a>
```

(The secondary "See how she sails" button is unchanged.)

- [ ] **Step 2: Add the Get Sailing nav link**

In `_includes/pirate/nav.html`, replace the `.pf-nav-links` block:

```html
  <div class="pf-nav-links">
    <a href="{{ '/blog/' | relative_url }}"{% if page.url contains '/blog/' %} class="active" aria-current="page"{% endif %}>Captain's Log</a>
    <a href="{{ '/deck-plan/' | relative_url }}"{% if page.url contains '/deck-plan/' %} class="active" aria-current="page"{% endif %}>Deck Plan</a>
  </div>
```

with:

```html
  <div class="pf-nav-links">
    <a href="{{ '/get-sailing/' | relative_url }}"{% if page.url contains '/get-sailing/' %} class="active" aria-current="page"{% endif %}>Get Sailing</a>
    <a href="{{ '/deck-plan/' | relative_url }}"{% if page.url contains '/deck-plan/' %} class="active" aria-current="page"{% endif %}>Deck Plan</a>
    <a href="{{ '/blog/' | relative_url }}"{% if page.url contains '/blog/' %} class="active" aria-current="page"{% endif %}>Captain's Log</a>
  </div>
```

- [ ] **Step 3: Commit**

```bash
git add _includes/pirate/hero.html _includes/pirate/nav.html
git commit -m "Point hero CTA and nav at the Get Sailing hub"
```

---

### Task 6: Build + eyeball

**Files:** none (verification only)

- [ ] **Step 1: Build the site**

Run (WSL, if Ruby/Jekyll present): `bundle exec jekyll build 2>&1 | tail -20`
Expected: `done in Ns` with **no** Liquid `Warning`/`Error` and no `Liquid Exception`. If Ruby is Windows-only, run the equivalent build/preview on Windows instead.

- [ ] **Step 2: Eyeball (user)**

Hand off to the user to preview and confirm:
- Homepage: "Chart your course" shows 3 accent cards; card 01 has both buttons; the two out-links render.
- Nav shows Get Sailing / Deck Plan / Captain's Log.
- Hero primary button reads "Get sailing →" and lands on `/get-sailing/`.
- `/get-sailing/` renders 4 groups / 13 cards, back-to-port works, footnote links to the blog.

- [ ] **Step 3: Confirm no orphaned Watchtower-image break**

The Watchtower card links to `/blog/watchtower/`; that post references `watchtower-*.webp` art that doesn't exist yet (known, tracked separately). Not a blocker for this plan.

---

## Notes

- The earlier standalone edits from issue #1 — the Watchtower section trim in `2020-07-18-...docker-compose.md` and the Container Management link in `2020-07-17-...management.md` — are **unrelated to this plan and stay as-is**. Only the `course-path.html` portion of that work is superseded here.
- Copy in the cards is first-pass; refine against the rendered page.
