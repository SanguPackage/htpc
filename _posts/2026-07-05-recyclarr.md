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
  url: recyclarr-big.webp
img:
  url: recyclarr-sm.webp
  desc: "A tool I admire from a safe distance"
categories: 
github: recyclarr/recyclarr
tags: [tutorial,fun]
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
