---
layout: post
author: Wouter Van Schandevijl
title: "Recyclarr: The Quality Upgrade I Said No To"
subTitle: "Sometimes quantity really is a feature"
date: 2026-07-05
description: >
  Recyclarr auto-syncs the TRaSH Guides quality tuning into Sonarr and Radarr.
  It's genuinely clever — and I decided not to use it. Here's both halves.
image: /assets/blog-images/recyclarr-big.webp
bigimg:
  url: recyclarr-big.webp
img:
  url: recyclarr-sm.webp
  desc: "A tool I admire from a safe distance"
categories: 
github: recyclarr/recyclarr
tags: [arr, automation]
toc:
  title: ♻️ Recyclarr
---

Every so often you find a tool that's obviously well-made, solves a real problem, and is beloved by people who
clearly know more than you — and you still walk away. **Recyclarr** is mine.

<!--more-->


# What It Does

Recyclarr automates the release grabbing process. It configures your custom formats and quality profiles,
much better than you ever can. If you do not want to spend time configuring all that, and keeping it up to date,
Recyclarr might be exactly what you need!

It will configure years of best practices and fine-tuning from the [**TRaSH Guides**](https://trash-guides.info/)
for you, automatically.


```yaml
recyclarr:
  image: ghcr.io/recyclarr/recyclarr:latest
  container_name: recyclarr
  user: ${PUID}:${PGID}
  environment:
    - TZ=${TZ}
    - CRON_SCHEDULE=${RECYCLARR_CRON}
  volumes:
    - ${CONFIG_PATH}/recyclarr:/config
  restart: ${RESTART_POLICY}
```

One-shot instead of cron? Just `docker compose run --rm recyclarr sync`.


# Why I Said No

I fall firmly on the **quantity over quality** side. Fill the terabytes, watch the thing, move on.
Recyclarr and the TRaSH guides point towards 4k releases or something, with 14GB movies as pretty much
the bare minimum. I'm typically aiming for a 2GB release, which, for me, is just good enough.

A side effect of me being so picky on "bad quality" is that it is often **more** difficult for me
to find a release...


# When You *Should* Use It

This is a "me" problem, not a Recyclarr problem. If any of this is you, go for it — it'll save you real time:

- You care about **specific encodes** — HDR/Dolby Vision done right, lossless audio, trusted release groups.
- Storage is plentiful and you'd rather **re-grab an upgrade** than settle.
- You've been **hand-maintaining custom formats** and are tired of it.

For that person Recyclarr is a no-brainer: the TRaSH Guides are the accumulated taste of thousands of hoarders, and
Recyclarr pipes it into your setup automatically.


# Conclusion

Recyclarr isn't going in my stack — not because it's bad, but because it's *good at something I don't want*.


# Recyclarr vs Configarr vs Profilarr

Recyclarr isn't the only tool piping TRaSH into your `arr`s. Two alternatives attack the same
problem from different directions:

|   | Tool | Stars | Source | Commits | Last |
|---|------|-------|--------|---------|------|
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/recyclarr-logo.png"> | Recyclarr | <img class="nb" src="https://img.shields.io/github/stars/recyclarr/recyclarr.svg?style=social&label=Star"> | [recyclarr/recyclarr][gh-rec] | 2,335 | 3 days ago |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/configarr-logo.webp"> | Configarr | <img class="nb" src="https://img.shields.io/github/stars/raydak-labs/configarr.svg?style=social&label=Star"> | [raydak-labs/configarr][gh-cfg] | 764 | yesterday |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/profilarr-logo.png"> | Profilarr | <img class="nb" src="https://img.shields.io/github/stars/Dictionarry-Hub/profilarr.svg?style=social&label=Star"> | [Dictionarry-Hub/profilarr][gh-prf] | 1,444 | yesterday |

[gh-rec]: https://github.com/recyclarr/recyclarr
[gh-cfg]: https://github.com/raydak-labs/configarr
[gh-prf]: https://github.com/Dictionarry-Hub/profilarr

**Recyclarr** is config-as-code, and only that. A YAML file, a CLI, and a one-way sync of TRaSH Guides
custom formats and quality profiles into Sonarr/Radarr. No UI, no database, no opinions of its own —
it does what the guides say and nothing more. The oldest and most focused of the three.

**Configarr** is "Recyclarr, but it doesn't stop at TRaSH". Same config-as-code spirit (YAML + container),
except it also pulls in Profilarr's databases *and* lets you define your own custom formats and profiles
inline. If you've hit the edges of Recyclarr's TRaSH-only scope, this is the drop-in with more room.

**Profilarr** is the odd one out: a web app, not a CLI. You run it as a container and click around a UI
backed by the curated [Dictionarry](https://dictionarry.dev) database — profiles and regex-based custom
formats with git-style versioning, import/export, and pull-to-update. It trades config-as-code for
approachability and a hand-tuned catalogue.

Rough decision:

- **Just want TRaSH, in a file you can commit** → Recyclarr
- **Want TRaSH *plus* your own tweaks, still as code** → Configarr
- **Don't want to touch YAML, want a curated GUI** → Profilarr

For me, none of them — see above. But if you land on the "quality" side of the fence I bailed from,
that's the map.
