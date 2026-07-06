---
name: blog-image-prompts
description: "Use when generating Midjourney prompts for a blog post's images on this htpc-site — the bigimg hero and img thumbnail. Triggers on 'midjourney prompt(s) for the images/blog/post', 'hero/thumbnail image', 'bigimg', writing into MIDJOURNEY.md."
---

# Blog image prompts

Produce Midjourney prompts for a post's two images and record them in `MIDJOURNEY.md` (a git-ignored, build-excluded working file), then convert the chosen renders to webp.

## The two images — match the existing files exactly

| slot     | front-matter | file                                 | Midjourney | final size |
| -------- | ------------ | ------------------------------------ | ---------- | ---------- |
| big hero | `bigimg.url` | `assets/blog-images/<slug>-big.webp` | `--ar 4:1` | 1600×400   |
| thumb    | `img.url`    | `assets/blog-images/<slug>-sm.webp`  | `--ar 5:4` | 600×480    |

Existing heroes are 1600×400 and thumbs 600×480 — keep those ratios (the thumb is 5:4, **not** 1:1).

## Unified style — cinematic high-seas

Every image on this blog shares one look. The established shots are **cinematic neon-noir** (teal/cyan shadows, warm amber glow, wet reflections, sea fog, filmic photoreal render). Keep that exact lighting and make the *subject* nautical — map the post's topic to a golden-age-of-sail / pirate metaphor.

Append this tail to **every** prompt (swap `<AR>` for `4:1` or `5:4`):

```
cinematic neon-noir, moody cyan-teal shadows with warm amber lantern glow, golden-age-of-sail pirate setting, wet reflective surfaces, volumetric sea fog, dramatic rim light, filmic photoreal 3D render, deep dark background, ultra detailed --ar <AR>
```

- **Big (4:1)** → a wide establishing *scene*: harbours, fleets, lighthouses, storms.
- **Small (5:4)** → a single glowing *hero object* centered on dark: lantern, spyglass, compass, sea chart. Mirrors the existing thumbnails.

## Steps

1. Read the post's front matter for `title`, `bigimg.url`, `img.url` (the slug is already in those filenames — use them verbatim).
2. Choose a nautical metaphor for the topic (e.g. Watchtower → a lighthouse keeping watch; a broken `:latest` → a storm at 4am).
3. Write **3 angle variations per slot** into `MIDJOURNEY.md` using the template below, with the style tail + `--ar` inlined so each line is copy-paste ready.
4. Tell the user to generate in Midjourney, then drop the chosen renders into `assets/blog-images/` as `<slug>-big.png` / `<slug>-sm.png`.
5. Convert + resize to the exact webp the front matter expects:

```sh
cd assets/blog-images
convert <slug>-big.png -resize 1600x400^ -gravity center -extent 1600x400 -quality 82 <slug>-big.webp
convert <slug>-sm.png  -resize 600x480^  -gravity center -extent 600x480  -quality 82 <slug>-sm.webp
rm <slug>-big.png <slug>-sm.png
```

`convert` is ImageMagick. If the webp delegate is missing, resize to png then `cwebp -q 82 in.png -o out.webp`.

## MIDJOURNEY.md entry template

```
## <Post title>

_Metaphor: <one line mapping the topic to a high-seas image>_

### bigimg → assets/blog-images/<slug>-big.webp  (--ar 4:1 → 1600×400)
1. <scene A>, <style tail> --ar 4:1
2. <scene B>, <style tail> --ar 4:1
3. <scene C>, <style tail> --ar 4:1

### img → assets/blog-images/<slug>-sm.webp  (--ar 5:4 → 600×480)
1. <hero object A>, <style tail> --ar 5:4
2. <hero object B>, <style tail> --ar 5:4
3. <hero object C>, <style tail> --ar 5:4
```

## Notes

- The unified style lives in one place (above). To pivot the whole blog's look (e.g. painterly pirate instead of neon-noir cinema), edit that tail — every future prompt follows.
- `MIDJOURNEY.md` is a scratch file: git-ignored and in `_config.yml` `exclude`, so it never ships.
