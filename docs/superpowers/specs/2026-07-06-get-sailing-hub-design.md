# Get Sailing hub + homepage CTA restructure

## Problem

The homepage is a sales pitch, and that's fine — but the *how-to* ("Chart your
course") is section 5 of 6, near the bottom. The hero's primary button just
scrolls a sold visitor past four screens of persuasion to reach it. There's no
quick path from "I'm sold" to "I'm building".

Two secondary issues surfaced while digging in:

- **"Chart your course"** is a flat six-row list of the 2020 series, plus a
  "later ports of call" logbook that filtered on `series != home-media-server`
  **and** silently dropped any later-year series post (e.g. Watchtower fell into
  the gap and rendered nowhere).
- The blog (Captain's Log) is chronological only. There's no *task-oriented*
  index of the guides.

## Goals

1. Give the already-sold a one-click CTA into the guide, from the hero **and**
   the top nav.
2. Turn "Chart your course" into a tight, compelling teaser (3 cards) instead of
   a long list + stale logbook.
3. Build a new **Get Sailing** page: a curated, task-grouped hub of (almost) all
   the guide content — the front door the chronological blog can't be.

## Non-goals

- No changes to Deck Plan (the interactive SVG blueprint) or the blog archive.
- No post-content rewrites (the Watchtower series-wiring from issue #1 stays as
  already committed).
- No new images required to ship; per-card art is optional polish.

## The three homepage surfaces

The site keeps three distinct nav destinations, each with a clear job:

| Nav item        | Page          | Job                                            |
|-----------------|---------------|------------------------------------------------|
| Get Sailing     | `/get-sailing/` (new) | Curated, task-grouped action hub — "start here" |
| Deck Plan       | `/deck-plan/` | Interactive architecture blueprint             |
| Captain's Log   | `/blog/`      | Chronological archive                          |

## Change 1 — Hero CTA + nav

- Hero **primary** button: relabel to **"Get sailing →"**, point at
  `/get-sailing/` (was `#course`).
- Hero **secondary** button "See how she sails" → `/deck-plan/` — unchanged.
- Nav (`_includes/pirate/nav.html`): add **Get Sailing** → `/get-sailing/` as
  the first link, ahead of Deck Plan and Captain's Log.

Label "Get Sailing" is tentative — see Open items.

## Change 2 — "Chart your course" → 3 cards + one link

Replaces the entire body of `_includes/pirate/course-path.html` (including the
old date-filter logic and the logbook — the earlier Watchtower patch to this
include is discarded).

Three curated cards, hand-referenced via `{% post_url %}` (deliberate editorial
choice, not a feed — this is what retires the filter-gap bug class):

| # | Kicker      | Title                | Payoff (first pass)                              | Link(s)                                        |
|---|-------------|----------------------|--------------------------------------------------|------------------------------------------------|
| 01 | Understand | Home Media Server    | What each container does & why this crew.        | **Read the briefing →** (post) · **Study the blueprint →** (`/deck-plan/`) |
| 02 | Build      | Le Docker Compose    | 12 containers, one file, `up -d`, running by supper. | **Copy-paste it →** (post)                 |
| 03 | Command    | Container Management  | One dashboard so you never memorise a port again. | **Pick a dashboard →** (post)                 |

Card 01 is the only two-button card (a post has a natural blueprint companion;
the others don't).

Below the three cards, replace the logbook with:
- a link to the full hub: **"See every guide → Get Sailing"** → `/get-sailing/`
- a link to the archive: **"Or browse it all → Read the Captain's Log"** → `/blog/`

## Change 3 — New Get Sailing page

New page at `/get-sailing/` (`get-sailing.html` + a layout if the existing one
doesn't fit). A short page hero (title + one-line subtitle), then four grouped
sections, each a heading + a grid of cards using the same card component as the
homepage.

Content is curated in `_data/get_sailing.yml`, following the existing
`_data/deck_plan.yml` convention (hard-coded `/htpc/...` URLs with a header
comment explaining why — YAML isn't Liquid-processed). Each card: title, payoff
line, one or more links.

**13 cards, 4 groups:**

**⚓ Lay the keel** — *the required build*
- Home Media Server — `blog/home-media-server/`
- Le Docker Compose — `blog/home-media-server-docker-compose/`
- Container Management — `blog/home-media-server-management/`

**⛵ Trim the sails** — *optional, the "never think about it again" magic*
- Lists — `blog/lists/` (leads into part 2)
- Notifications — `blog/notifications/`
- Requests (Seerr) — `blog/goodbye-ombi/`
- Recyclarr — `blog/recyclarr/`
- Watchtower — `blog/watchtower/`

**🔁 Swap the crew** — *upgrades & migrations*
- Prowlarr (bye Jackett) — `blog/goodbye-jackett/`
- qBittorrent (bye Transmission) — `blog/goodbye-transmission/`
- FlareSolverr — `blog/flaresolverr-byparr/`

**🧭 Shore leave** — *detours*
- Alternatives — `blog/home-media-server-alternatives/`
- Prebuilt Boxes — `blog/home-media-server-prebuilt-boxes/`

Dropped from the hub (blog-only): **Out of scope**, **Jellyfin on LG TV**.

## Card component

A shared card used by both the homepage teaser and the hub:

- optional kicker / group tag
- title
- one payoff line (concrete outcome, not a subtitle restatement)
- one or more link buttons ("Read →" style)

Kept deliberately simple. Repo logos / star counts (as Deck Plan shows) are
possible later polish, not part of this pass.

## Open items (copy/polish, resolve during build or after first render)

- Final nav + hero label: "Get Sailing" vs alternative.
- Payoff-line copy across all 13 cards — first pass only; refine against rendered
  output.
- Card visual styling (CSS) — reuse/extend the existing `.course` card styles.
- Optional per-card icon/art.
