# PirateFlix — Midjourney asset prompts

Art for the **Dark Sea-Chart** redesign of the HTPC site. One cohesive house style:
antique nautical sea-chart engraving · deep navy + aged parchment · brass-gold & verdigris-teal
accents · fine etched copperplate linework · cinematic moody lighting.

## How to use

- Submit with the `midjourney-submit` skill: each fenced block below is one prompt.
  Filter to a section by passing its heading text as the 2nd arg (e.g. `crew`).
- **Style-lock workflow (do this in order):**
  1. Run **Batch 1 — Style anchors** first (no `--sref`).
  2. Pick the emblem/hero you like most → open it on midjourney.com → copy its image URL.
  3. Find-and-replace `https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png` in Batches 2–3 with that URL, then submit those.
     This forces the crew + textures to match the chosen look.
- Palette reference: navy `#0a1826`, panel `#102a40`, brass `#e0b34a`, teal `#4fd8c4`, red `#e2564a`.
- Emblems are generated on flat dark navy so they drop straight onto the site; the brand mark
  is also done flat/2-tone so it traces cleanly to SVG for the favicon + nav logo.

---

## Batch 1 — Style anchors

### Brand emblem (generate first — becomes the logo + the style seed)

```
emblem logo for "PirateFlix", a ship's helm wheel fused with a compass rose, a small skull at the hub, one spoke shaped like a media play triangle, flat 2-color vector engraving, brass gold on deep navy, bold clean minimal, centered, plain flat dark navy background, crest insignia --ar 1:1 --v 7 --stylize 150
```

```
emblem logo, a jolly-roger skull wearing headphones formed like a compass rose, crossed cutlass and film-reel behind, minimal flat vector engraving, brass gold and verdigris teal on deep navy, centered, plain background, nautical crest --ar 1:1 --v 7 --stylize 150
```

### Hero atmosphere (wide, low-contrast, text goes on the left)

```
cinematic wide banner, a lone tall pirate galleon sailing a dark moonlit sea, seen from afar, overlaid faintly with antique nautical chart lines and compass roses, deep navy and black with subtle brass moon-glow, heavy negative space on the left, low contrast atmospheric background art, engraving texture, no text --ar 21:9 --v 7 --stylize 200
```

```
antique sea chart of an imaginary archipelago at night, faded parchment gone deep navy, brass rhumb lines and compass roses, sea-monster in one corner, dark moody cinematic background, lots of empty water for text, no text --ar 21:9 --v 7 --stylize 200
```

---

## Batch 2 — The *arr crew (replace https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png first)

Seven matching medallion crests, one per tool. Same round engraved frame, same style, each in
its accent color, on flat dark navy so they sit in the "Meet the crew" grid.

### Radarr — Quartermaster of Films

```
round engraved medallion crest, a film reel crossed with a cutlass over an old movie clapper, antique nautical engraving, brass gold linework on flat deep navy, centered, symmetric, plain background --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 150
```

### Sonarr — Quartermaster of TV

```
round engraved medallion crest, a vintage television set rigged like a ship's mast with an antenna and pennant, antique nautical engraving, emerald green and brass linework on flat deep navy, centered, symmetric, plain background --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 150
```

### Prowlarr — The Spyglass (lookout)

```
round engraved medallion crest, a brass spyglass telescope over cresting waves scanning the horizon, antique nautical engraving, sky-blue and brass linework on flat deep navy, centered, symmetric, plain background --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 150
```

### qBittorrent — The Cargo Hold

```
round engraved medallion crest, an open treasure chest and stacked cargo crates in a ship's hold spilling gold coins, antique nautical engraving, violet-purple and brass linework on flat deep navy, centered, symmetric, plain background --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 150
```

### Bazarr — The Translator

```
round engraved medallion crest, an open book with a speech scroll and a perched parrot, antique nautical engraving, teal and brass linework on flat deep navy, centered, symmetric, plain background --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 150
```

### Jellyseerr — The Ship's Log (requests)

```
round engraved medallion crest, an open ship's logbook with a quill and a small jellyfish motif, antique nautical engraving, crimson red and brass linework on flat deep navy, centered, symmetric, plain background --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 150
```

### Jellyfin — Home Port

```
round engraved medallion crest, a coastal lighthouse over a safe harbor with a glowing jellyfish in the beam, antique nautical engraving, warm gold-green and brass linework on flat deep navy, centered, symmetric, plain background --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 150
```

---

## Batch 3 — Textures & dividers (replace https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png first)

### Compass rose watermark (faint, behind sections)

```
single ornate compass rose, fine brass engraving lines only, very faint low contrast, centered on flat deep navy, symmetric, plain background, no text --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 120
```

### Rope divider (thin horizontal rule)

```
a single horizontal length of nautical rope with a knot in the center, engraving style, brass on flat deep navy, wide thin strip, plain background, no text --ar 16:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 120
```

### Cartouche frame (empty ornate map label frame)

```
ornate antique map cartouche frame, empty center, nautical engraving with scrollwork and a tiny anchor, brass linework on flat deep navy, symmetric, plain background, no text --ar 4:3 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 120
```

### Aged chart paper texture (seamless-ish tile)

```
subtle aged nautical chart paper texture darkened to deep navy, faint rhumb lines and grid, low contrast, even lighting, background tile, no focal subject, no text --ar 1:1 --v 7 --sref https://cdn.midjourney.com/737ce76d-3c58-4fec-b779-44a7d8b4ee9a/0_3.png --stylize 100
```
