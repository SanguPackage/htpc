# Get Building — ship-cutaway redesign · port handoff

Redesign of `/get-sailing/` as a **"Get building."** hub: the page is the inside of a
pirate ship, cut away. Design is finished and signed off as a throwaway prototype;
this doc is the handoff to port it into the real Jekyll site in a fresh session.

## The finished design
`_prototypes/get-building.html` — standalone, open via `file://`. This IS the spec.
Everything below describes what it does so you can reproduce it in the layout.

## Naming
- Visible **H1: "Get building."** (subtitle: "Build her in the yard, then take her to the high seas.")
- **Keep the permalink `/get-sailing/`** — do NOT rename the URL (nav, inbound links, SEO).

## Port target
- Live page today: `_layouts/get-sailing.html` renders a "cargo hold" scene from
  `_data/get_sailing.yml` (crates/instruments per group). Replace that rendering with
  the ship structure below.
- Prototype content lives in a hardcoded `DATA` object; the real site keeps content in
  `_data/get_sailing.yml`. Reconcile: move the copy into the yml and wire the real blog
  URLs (currently `#` placeholders). Existing yml already has the guide URLs.
- Crate styling should match the live "lay the keel" boxes in `_sass/_pirateflix.scss`
  (planked wood, iron corner braces, name plate) — the prototype already mirrors it.

## Structure (three single-open, toggleable zones; deck open by default)
- **The Deck** (gold badge) — a drawn SVG ship, always visible:
  - Two SVG layers sharing viewBox `0 -80 1000 420`, `preserveAspectRatio="xMidYMax meet"`:
    `shipBack` (rigging `.rigging`, mast, crow's nest, pennant, one big **sail**) and
    `shipHull` (galleon hull: sheer up at bow/stern, bowsprit, gun ports, wale, gunwale).
  - The two **deckhouses are HTML overlays sandwiched between** the layers (z: back 0,
    deckhouses 1, hull 2) so the **bulwark renders in front of their bases** = grounded.
  - **Sail = Le Docker Compose**: Jolly Roger watermark painted on the canvas + a
    translucent parchment text box (cream text-halo for legibility over the skull).
  - **Chart Room deckhouse (left) = Home Media Server**: peaked-roof wood cabin, role +
    name + description + Briefing/Blueprint buttons. Description hidden (`visibility:hidden`)
    when deck closed, box keeps its size.
  - **Helm (right) = Container Management**: a ship's wheel + brown wood nameplate.
  - **Deck open** → bulwark (`.shiphull`) and rigging (`.rigging`) fade to `opacity:0`
    so the deckhouses show in full; closed → bulwark solid, deckhouse buttons tuck behind it.
- **The Cargo Hold** (silver badge) — below the waterline, in the hull:
  - Two floors of wooden crates (floor 1: Lists/Notifications/Requests; floor 2:
    Recyclarr/Watchtower), split by a solid plank divider spanning wall-to-wall.
  - Both floors show when closed (compact, role-only crates); open → full crates.
- **The Brig** (bronze badge) — bottom of the hull:
  - Two barred cells flanking an empty central walkway. Bars are metallic-cylinder SVG
    clipped to the hull path so they hug the walls + rounded keel. Closed → role only,
    compact; open → full cell content.

## Key SVG techniques (already solved in the prototype)
- **Per-band hull SVG** for hold/brig: `viewBox 0 0 100 100`, `preserveAspectRatio="none"`
  so walls stretch vertically with the accordion; adjacent bands share boundary widths
  (waterline 6..94, straight sides, rounded keel) so the hull is continuous, seam invisible.
- `vector-effect="non-scaling-stroke"` keeps outlines/bars crisp under the non-uniform scale.
- Brig bars + cells clipped to the exact hull `<path>` (same coordinate space) so they hug.
- Badges: shared `.badge` + `.gold`/`.silver`/`.bronze` modifiers.

## Open follow-ups
- Move `DATA` copy → `_data/get_sailing.yml`; wire real URLs.
- Responsive/mobile pass (prototype was tuned for desktop; overlay %s need mobile checks).
- Decide whether the deck should be independent of the hold/brig accordion (currently
  single-open with them — opening the hold closes the deck).
- Delete `_prototypes/get-building.html` (and `_prototypes/get-sailing-ship.html`) once ported.
