# Midjourney prompts

## Parchment card background — Deck Plan welcome / tour note

Aged vellum for the pinned parchment note that floats over the Deck Plan sea-chart.
Warm and weathered, but calm enough in the centre that the dark serif text stays legible.

**Prompt**

```
aged parchment paper texture, weathered antique vellum, warm cream and tan tones, faint fibrous grain, subtle foxing and soft coffee stains toward the edges, clean uncluttered centre, even top-down lighting, flat scanned document, no text, no writing, no border, antique nautical map paper --ar 4:3 --style raw --v 6
```

- Swap `--ar 4:3` for `--tile` if you'd rather have a seamless repeat than a single fitted image.
- Keep it **light** — it sits under `--brown` (`#3a2c1a`) serif text. The card still lays its translucent vellum gradient on top for contrast, so the image only needs to supply grain and stains.
- Export ~1600px wide → `assets/blueprint/parchment.webp`, then set it as the `.parchment` `background-image` (under the existing gradient).
