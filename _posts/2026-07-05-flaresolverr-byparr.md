---
layout: post
author: Wouter Van Schandevijl
title: "Getting Past Cloudflare: FlareSolverr & Byparr"
subTitle: "When your indexer hides behind a bouncer, you bring a bigger bouncer"
date: 2026-07-05
desc: >
  Some torrent indexers sit behind Cloudflare and block Prowlarr outright.
  FlareSolverr solves the challenge for you — and Byparr is the drop-in
  alternative for when it can't.
bigimg:
  url: Integrations-Big.png
  desc: "Photo by Compare Fibre"
img:
  url: Home Media Center-Small.jpg
  desc: "Photo by Ian Battaglia"
  title: "You shall not pass. — Cloudflare, probably"
categories: 
tags: [tutorial,fun]
toc:
  title: ☁️ FlareSolverr
---

Some indexers put themselves behind [Cloudflare](https://www.cloudflare.com/)'s anti-bot wall. Point
[Prowlarr]({{ site.baseurl }}/blog/goodbye-jackett) at one and instead of results you get a "checking your browser"
challenge page — Prowlarr isn't a browser, so it just bounces off.

**FlareSolverr** is how you get past it.

<!--more-->

{% include github-stars.html url="FlareSolverr/FlareSolverr" desc="Proxy server to bypass Cloudflare protection" %}


# What FlareSolverr Does

FlareSolverr is a small proxy server whose one job is to **solve Cloudflare (and DDoS-GUARD) challenges**. When
Prowlarr hits a protected indexer, it forwards the request to FlareSolverr, which fires up a headless Chrome
(Selenium + `undetected-chromedriver`), lets it sit through the JavaScript challenge, and hands back the **HTML plus
the cookies and matching user-agent**. Prowlarr reuses those cookies and sails through — no challenge on the next
request.

The catch: every request spins up a real browser, so it's **hungry for RAM**. Give it its own little container and
don't be surprised when it idles heavier than your average \*arr.

```yaml
  flaresolverr:
    image: ghcr.io/flaresolverr/flaresolverr:latest
    container_name: flaresolverr
    environment:
      - LOG_LEVEL=info
      - TZ=${TZ}
    ports:
      - 8191:8191
    restart: unless-stopped
```

Default port is **8191**; the API lives at `POST /v1`, but you never call it by hand — Prowlarr does.


# Wiring It Into Prowlarr

FlareSolverr is added as an **indexer proxy**, and Prowlarr uses **tags** to decide which indexers route through it:

1. **Settings → Indexers → Indexer Proxies → `+` → FlareSolverr.**
2. **Host:** `http://flaresolverr:8191` (container name works if they share a Docker network; otherwise `IP:port`).
3. **Tags:** add a tag, e.g. `flaresolverr`. Save.
4. On each indexer that hides behind Cloudflare, add the **same** `flaresolverr` tag.

Prowlarr only routes an indexer through the proxy when **the tags match _and_ it actually detects Cloudflare** — so
tagging everything does no harm, and a proxy with no matching indexers is simply ignored. Set the **Request Timeout**
(FlareSolverr's `maxTimeout`) to taste; the default 60 s is plenty.


# The Byparr Alternative

For a long stretch FlareSolverr development stalled while Cloudflare's challenges kept evolving, which is exactly what
spawned alternatives. (It has picked up releases again in 2026, so it's not dead — but the alternatives stuck around,
and they're handy when a stubborn indexer won't crack.)

The best of them is **Byparr**. The selling point: it speaks the **exact same `/v1` API** on the **same port 8191**, so
it's a genuine drop-in. Under the hood it swaps Chrome for **Camoufox** (a Firefox-based anti-detection browser) served
by a FastAPI app, which tends to do better against newer fingerprinting.

{% include github-stars.html url="ThePhaseless/Byparr" desc="Drop-in FlareSolverr alternative built on Camoufox" %}

```yaml
  byparr:
    image: ghcr.io/thephaseless/byparr:latest
    container_name: byparr
    ports:
      - 8191:8191
    # shm_size: 512mb   # only needed on Proxmox LXC / OCI to avoid a camoufox multiprocessing error
    restart: unless-stopped
```

Because the API is identical, **migrating is a one-line change**: leave the FlareSolverr proxy in Prowlarr exactly as
it is and just point its **Host** at Byparr instead. No re-tagging, no re-configuring the indexers. (Don't copy
FlareSolverr's `LOG_LEVEL`/`TZ` env vars over — Byparr doesn't use them.)


# Conclusion

Reach for **FlareSolverr** first — it's the default, it's well-supported by Prowlarr, and it's active again. Keep
**Byparr** in your back pocket for the one indexer that FlareSolverr can't get past: because it's a drop-in, switching
costs you a single field and thirty seconds.
