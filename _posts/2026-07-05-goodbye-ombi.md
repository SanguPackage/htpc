---
layout: post
author: Wouter Van Schandevijl
title: "Goodbye Ombi, Hello Jellyseerr, ugh.. I mean Seerr"
subTitle: "The request box gets a glow-up (and a new name, twice)"
date: 2026-07-05
description: >
  Ombi still works, but development stalled and it never spoke fluent
  Jellyfin. Jellyseerr does — so we switched. Then Jellyseerr became Seerr.
image: /assets/blog-images/hello-seerr-big.webp
bigimg:
  url: hello-seerr-big.webp
img:
  url: hello-seerr-sm.webp
  desc: "Type a title, click request, done."
categories: 
github: seerr-team/seerr
tags: [arr, jellyfin]
series: swapping-tools
series_order: 3
toc:
  title: 🎬 Seerr
---

The [original setup]({{ site.baseurl }}/blog/home-media-server#seerr---requests) used **Ombi** as the request box:
the friendly search-and-click front door you hand to family so nobody makes you explain Sonarr's quality profiles
over Sunday dinner. Type a title, click request, and it lands in Sonarr/Radarr.

Ombi still does that. But it hasn't kept up...

<!--more-->


# Why Leave Ombi

Ombi isn't dead — it still ships the occasional bug-fix release. But development has slowed to a trickle: there are
no formal stable releases anymore (everything's tagged *pre-release*), and the team has openly been short on
maintainer time. More to the point for a Jellyfin house: Ombi treats Jellyfin as a second-class citizen next to its
Plex/Emby roots, and its UI feels its age next to what the Overseerr family is doing.

Enter **Jellyseerr** — a fork of [Overseerr](https://github.com/sct/overseerr) created specifically to add **Jellyfin
and Emby** support (Overseerr itself is Plex-only). For a Jellyfin setup that's the whole ballgame:

- **Native Jellyfin login** — it authenticates against Jellyfin and **imports your users straight from the server**, so you don't recreate accounts.
- **Modern, discovery-first UI** — the slick Overseerr interface, trending rows and all.
- **Sonarr/Radarr fulfillment** built in, plus proper request and issue management.


# Deploying Jellyseerr

Jellyseerr is refreshingly self-contained — **SQLite by default**, so no external database to babysit (Postgres is
optional via `DB_TYPE=postgres` if you outgrow it).

```yaml
jellyseerr:
  image: fallenbagel/jellyseerr
  container_name: jellyseerr
  environment:
    - TZ=${TZ}
    - LOG_LEVEL=info
  volumes:
    - ${CONFIG_PATH}/jellyseerr:/app/config
  ports:
    - 5055:5055
  restart: unless-stopped
```


# Plot Twist: It's Called Seerr Now

Here's the homelab special. Right around the time this swap went in, the **Jellyseerr and Overseerr projects merged
into a single successor: [Seerr](https://github.com/seerr-team/seerr)** (announced February 2026). Both Jellyseerr and
Overseerr were **sunset a few months later** — so I effectively migrated to Jellyseerr about a week after it stopped
being a thing. Classic.

{% include github-stars.html url="seerr-team/seerr" desc="The merged successor to Overseerr and Jellyseerr" %}

Nothing broke — the `fallenbagel/jellyseerr` image still runs — but if you're doing this **today**, skip straight to
**Seerr**. It's the same lineage (Overseerr's features + Jellyseerr's Jellyfin/Emby support in one codebase), it's the
one still getting updates, and Seerr ships a built-in auto-migration from Overseerr/Jellyseerr, so moving over later is
painless.

# The Seerr Migration

The new `compose.yaml`

```yaml
seerr:
  image: ghcr.io/seerr-team/seerr
  container_name: seerr
  user: "${PUID}:${PGID}"
  init: true
  environment:
    - TZ=${TZ}
    - LOG_LEVEL=info
  volumes:
    - ${CONFIG_PATH}/seerr:/app/config
  ports:
    - 5055:5055
  restart: unless-stopped
```

Data migration from Jellyseerr/Overseerr is pretty seamless:

```sh
CONFIG_PATH=/volume1/Media/config
mkdir "$CONFIG_PATH/seerr"
cp -a "$CONFIG_PATH/jellyseerr/." "$CONFIG_PATH/seerr/"
docker-compose up -d seerr
```


# Conclusion

Ombi was a good front door for years. But on a Jellyfin box, the request app that logs in with Jellyfin, imports your
Jellyfin users, and is actually being developed wins easily. Just aim for **Seerr** rather than Jellyseerr — save
yourself the extra hop I took.
