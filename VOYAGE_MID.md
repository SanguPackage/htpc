## Chart-your-course voyage — map props

Engraved-chart art to replace the four SVG placeholder props in `leg-prototype.html`
(storm, skull-cliffs, sea-serpent, treasure-island). Generate **light brass linework on a
pure solid black background**, then bake the black into transparency (below) and drop it in as a
plain `<img>` — the gold engraving glows on the navy sea and the hatching gaps show it through.

**Post-processing (ImageMagick 6)** — black → alpha, erase corner watermark, trim margins:
```
convert in.png \
  -fill black -draw "rectangle <x1>,<y1> <x2>,<y2>" \      # erase watermark corner
  -alpha off \( +clone -colorspace Gray \) -compose CopyOpacity -composite \
  -fuzz 18% -trim +repage  out.png
```
(luminance→alpha keeps the soft engraved edges; no `mix-blend-mode` needed once it's transparent.)

### storm → assets/pirate/storm.webp
1. a roiling thundercloud hurling three forked lightning bolts and slanting sheets of rain down onto churning sea swells, engraved storm symbol, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 1:1 --no background scenery, frame, grid, text, colour fill --style raw
2. a fierce spiral storm cloud with jagged lightning striking a heaving ocean, wind gusts etched as curved lines, old-map tempest motif, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 1:1 --no background scenery, frame, grid, text, colour fill --style raw

### skull-cliffs → assets/pirate/skull.webp
1. a jagged rocky island cliff carved into the shape of a snarling skull, crashing waves breaking white at its base, a dead-end hazard on an old sea chart, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 4:3 --no background scenery, frame, grid, text, colour fill --style raw
2. a menacing skull-shaped crag of sharp reef rocks jutting from the sea, hollow eye-caves, foaming surf below, engraved warning landmark, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 4:3 --no background scenery, frame, grid, text, colour fill --style raw

### sea-serpent → assets/pirate/serpent.webp
1. a coiling sea serpent rising from the waves in three looping humps, scaled body, jaws agape with a forked tongue, a classic here-be-dragons chart monster, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 5:4 --no background scenery, frame, grid, text, colour fill --style raw
2. a great horned sea-serpent arching over and under the swells, sinuous ridged spine, curling tail, waves rendered as etched scallops around it, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 5:4 --no background scenery, frame, grid, text, colour fill --style raw

### treasure-island → assets/pirate/island.webp
1. a small treasure island with a leaning palm tree and a bold X marking buried gold, ringed by gentle etched waves, engraved map vignette, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 1:1 --no background scenery, frame, grid, text, colour fill --style raw
2. a compact desert isle, single palm and a scatter of rocks, a dotted trail leading to an X, surf lines curling round the shore, old-chart treasure marker, antique nautical chart engraving, fine etched copperplate linework, luminous brass-gold lines on a pure solid black background, monochrome single-hue line art, hand-inked cross-hatching, cartographic map-symbol motif, crisp consistent thin strokes, no colour wash, no photoreal shading, isolated centered motif --ar 1:1 --no background scenery, frame, grid, text, colour fill --style raw
