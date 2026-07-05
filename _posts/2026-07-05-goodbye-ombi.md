---
layout: post
author: Wouter Van Schandevijl
title: "Goodbye Ombi, Hello Jellyseerr"
subTitle: "The request box gets a glow-up (and a new name, twice)"
date: 2026-07-05
desc: >
  Ombi still works, but development stalled and it never spoke fluent
  Jellyfin. Jellyseerr does — so we switched. Then Jellyseerr became Seerr.
bigimg:
  url: ombi-big.webp
img:
  url: ombi-sm.webp
  title: "Type a title, click request, done."
categories: 
tags: [tutorial,fun]
series: swapping-tools
toc:
  title: 🎬 Jellyseerr
---

The [original setup]({{ site.baseurl }}/blog/home-media-server#ombi---requests) used **Ombi** as the request box:
the friendly search-and-click front door you hand to family so nobody makes you explain Sonarr's quality profiles
over Sunday dinner. Type a title, click request, and it lands in Sonarr/Radarr.

Ombi still does that. But it hasn't kept up, and it never really spoke Jellyfin.

<!--more-->

{% include github-stars.html url="Ombi-app/Ombi" desc="Want a Movie or TV Show on Plex/Emby/Jellyfin? Use Ombi!" %}


# Why Leave Ombi

Ombi isn't dead — it still ships the occasional bug-fix release. But development has slowed to a trickle: there are
no formal stable releases anymore (everything's tagged *pre-release*), and the team has openly been short on
maintainer time. More to the point for a Jellyfin house: Ombi treats Jellyfin as a second-class citizen next to its
Plex/Emby roots, and its UI feels its age next to what the Overseerr family is doing.

Enter **Jellyseerr** — a fork of [Overseerr](https://github.com/sct/overseerr) created specifically to add **Jellyfin
and Emby** support (Overseerr itself is Plex-only). For a Jellyfin setup that's the whole ballgame:

- **Native Jellyfin login** — it authenticates against Jellyfin and **imports your users straight from the server**,
  so you don't recreate accounts.
- **Modern, discovery-first UI** — the slick Overseerr interface, trending rows and all.
- **Sonarr/Radarr fulfillment** built in, plus proper request and issue management.


# Deploying Jellyseerr

Jellyseerr is refreshingly self-contained — **SQLite by default**, so no external database to babysit (Postgres is
optional via `DB_TYPE=postgres` if you outgrow it).

```yaml
  jellyseerr:
    image: fallenbagel/jellyseerr:latest
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

WebUI is on **5055**. The `/app/config` volume holds the settings **and** the SQLite DB, so that's the folder to back
up. One footgun if you're on Windows/WSL: don't put `/app/config` on an SMB share — SMB has no file locking and will
happily corrupt SQLite. Keep it on a native Linux volume.


# Migrating the Requests

There's a catch worth saying out loud: **there is no Ombi → Jellyseerr importer**. Your old request history and user
accounts don't come across. You set Jellyseerr up fresh:

1. Point it at **Jellyfin** and **import the users** from the server.
2. Connect **Sonarr** and **Radarr**, setting a default **quality profile** and **root folder** for each.
3. Tell your users the URL changed.

Anything still in flight in Ombi either gets re-requested or is already being handled by Sonarr/Radarr, so in practice
you lose nothing but the history. Then you turn Ombi off.


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


# Conclusion

Ombi was a good front door for years. But on a Jellyfin box, the request app that logs in with Jellyfin, imports your
Jellyfin users, and is actually being developed wins easily. Just aim for **Seerr** rather than Jellyseerr — save
yourself the extra hop I took.
