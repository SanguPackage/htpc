---
layout: post
author: Wouter Van Schandevijl
title: "Recyclarr: The Quality Upgrade I Said No To"
subTitle: "Sometimes quantity really is a feature"
date: 2026-07-05
desc: >
  Recyclarr auto-syncs the TRaSH Guides quality tuning into Sonarr and Radarr.
  It's genuinely clever — and I decided not to use it. Here's both halves.
bigimg:
  url: Home Media Center-Management-Big.jpg
  desc: "Photo by Cameron Venti"
img:
  url: Home Media Center-Small.jpg
  desc: "Photo by Ian Battaglia"
  title: "A tool I admire from a safe distance"
categories: 
tags: [tutorial,fun]
toc:
  title: ♻️ Recyclarr
---

Every so often you find a tool that's obviously well-made, solves a real problem, and is beloved by people who
clearly know more than you — and you still walk away. **Recyclarr** is mine.

<!--more-->

{% include github-stars.html url="recyclarr/recyclarr" desc="Automatically sync TRaSH Guides to Sonarr and Radarr" %}


# What Recyclarr Does

Sonarr and Radarr decide *which* release to grab using **custom formats** and **quality profiles** — scoring rules
that say "prefer this release group, this encode, this audio; avoid that garbage." The community has spent years
tuning those rules into the [**TRaSH Guides**](https://trash-guides.info/). Copying all of that in by hand is
hours of tedious clicking, and it drifts out of date the moment the guides change.

Recyclarr automates it. It's a small **CLI** (no web UI) that reads a `recyclarr.yml` pointing at your Sonarr/Radarr
instances and **syncs the TRaSH custom formats, quality definitions and profile scores straight in**. Run it on a
cron and your \*arrs stay tuned to the current best-practice with zero manual upkeep.

```yaml
  recyclarr:
    image: ghcr.io/recyclarr/recyclarr:latest
    container_name: recyclarr
    user: ${PUID}:${PGID}
    environment:
      - TZ=${TZ}
      - CRON_SCHEDULE=${RECYCLARR_CRON}   # e.g. "0 3 * * *" — nightly sync
    volumes:
      - ${CONFIG_PATH}/recyclarr:/config   # holds recyclarr.yml
    restart: ${RESTART_POLICY}
```

(One-shot instead of cron? Just `docker compose run --rm recyclarr sync`.)


# Why I Said No

Here's the thing: custom formats optimize **which** release you end up with. My problem has never been *which* — it's
*whether*. I'd rather have the episode in a merely-fine encode tonight than wait for the perfect one, or worse, have
Radarr turn its nose up at the only release that exists because it scores badly.

I fall firmly on the **quantity over quality** side. Fill the terabytes, watch the thing, move on. Against that
priority, TRaSH's careful scoring is effort spent optimizing a dimension I don't care about — and it isn't free:
pickier profiles mean more grabs rejected or delayed, plus one more config surface to understand and maintain. So
Recyclarr solves, very elegantly, a problem I don't have.


# When You *Should* Use It

This is a "me" problem, not a Recyclarr problem. If any of this is you, go for it — it'll save you real time:

- You care about **specific encodes** — HDR/Dolby Vision done right, lossless audio, trusted release groups.
- Storage is plentiful and you'd rather **re-grab an upgrade** than settle.
- You've been **hand-maintaining custom formats** and are tired of it.

For that person Recyclarr is a no-brainer: the TRaSH Guides are the accumulated taste of thousands of hoarders, and
Recyclarr pipes it into your setup automatically.


# Conclusion

Recyclarr isn't going in my stack — not because it's bad, but because it's *good at something I don't want*. I'm
filing it under "tools I admire from a safe distance," right next to the day I finally care which encode of a movie
I'm half-watching on the couch. If that day comes, I know exactly what to install.
