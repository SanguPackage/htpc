---
layout: post
author: Wouter Van Schandevijl
title: "Getting Past Cloudflare: FlareSolverr & Byparr"
subTitle: "When your indexer hides behind a bouncer, you bring a bigger bouncer"
date: 2026-07-05
description: >
  Some torrent indexers sit behind Cloudflare and block Prowlarr outright.
  FlareSolverr solves the challenge for you — and Byparr is the drop-in
  alternative for when it can't.
bigimg:
  url: flaresolverr-big.webp
img:
  url: flaresolverr-sm.webp
  desc: "You shall not pass. — Cloudflare, probably"
github: FlareSolverr/FlareSolverr
categories: 
tags: [torrents, docker]
toc:
  title: ☁️ FlareSolverr
---

Some indexers put themselves behind [Cloudflare](https://www.cloudflare.com/)'s anti-bot wall. Point
[Prowlarr]({{ site.baseurl }}/blog/goodbye-jackett) at one and instead of results you get a challenge page.

**FlareSolverr** helps you get past it.

<!--more-->


# What FlareSolverr Does

When Prowlarr hits a protected indexer, it lets FlareSolverr's solve the Cloudflare (and DDoS-GUARD) challenges and
gets back the HTML and cookies so that Prowlarr can sail through on the next requests.

```yaml
flaresolverr:
  image: ghcr.io/flaresolverr/flaresolverr
  container_name: flaresolverr
  environment:
    - LOG_LEVEL=info
    - TZ=${TZ}
  ports:
    - 8191:8191
```


# Wiring It Into Prowlarr

FlareSolverr is added as an **indexer proxy**, and Prowlarr uses **tags** to decide which indexers route through it:

1. **Settings → Indexers → Indexer Proxies → `+` → FlareSolverr.**
2. **Host:** `http://flaresolverr:8191` (container name works if they share a Docker network; otherwise `IP:port`).
3. **Tags:** add a tag, e.g. `flaresolverr`. Save.
4. On each indexer that hides behind Cloudflare, add the **same** `flaresolverr` tag.


# The Byparr Alternative

For a long stretch FlareSolverr development stalled while Cloudflare's challenges kept evolving, and so
alternatives spawned. It has picked up releases again in 2026, so it's not dead — but the alternatives stuck around,
and they're handy when a stubborn indexer won't crack.

The best of them is **Byparr**. The selling point: it speaks the **exact same `/v1` API** on the **same port 8191**, so
it's a genuine drop-in. Under the hood it swaps Chrome for **Camoufox** (a Firefox-based anti-detection browser) served
by a FastAPI app, which tends to do better against newer fingerprinting.

{% include github-stars.html url="ThePhaseless/Byparr" desc="Drop-in FlareSolverr alternative built on Camoufox" %}

```yaml
byparr:
  image: ghcr.io/thephaseless/byparr
  container_name: byparr
  ports:
    - 8191:8191
  # I needed the following on my Proxmox LXC / OCI
  # to avoid a camoufox multiprocessing error
  # shm_size: 512mb
```

Because the API is identical, **migrating is a one-line change**: leave the FlareSolverr proxy in Prowlarr exactly as
it is and just point its **Host** at Byparr instead. No re-tagging, no re-configuring the indexers.


# Conclusion

Reach for **FlareSolverr** first — it's the default, it's well-supported by Prowlarr, and it's active again. Keep
**Byparr** in your back pocket for the one indexer that FlareSolverr can't get past: switching
is a one-liner change.
