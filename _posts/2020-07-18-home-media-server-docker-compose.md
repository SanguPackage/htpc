---
layout: post
author: Wouter Van Schandevijl
title: "Le Docker Compose"
subTitle: "Can it really be as easy as `docker-compose up`"
date: 2020-07-18
updates:
  - date: "2026-07-05"
    desc: "Rewrote from stub with the real 12-service compose in use on the NAS: single /data root for hardlinks, Prowlarr + FlareSolverr, Seerr/Jellystat, Recyclarr and Watchtower"
description: >
  Now that we have determined what our setup should look like,
  let's combine them in a single docker-compose file.
image: /assets/blog-images/Home%20Media%20Center-HolyGrail-Big.png
bigimg:
  url: Home Media Center-HolyGrail-Big.png
  desc: "Photo from Once upon a time"
img:
  url: containers-sm.webp
  linkUrl: 
categories: 
github: Laoujin/Htpc
tags: [docker, self-hosted]
series: home-media-server
toc:
  title: Docker Compose
  icon: docker
---

We've picked the crew and drawn the map. All that's
left is to actually cast off. This is where the whole fleet gets folded into a single `compose.yml`
and — spoiler — it really is close to `docker compose up -d` easy.

<!--more-->

# The `.env` first

The [Linuxserver.io](https://linuxserver.io) images all speak the same three variables, and everything
paths off two folders. Get these right and the rest is copy-paste.

```sh
COMPOSE_PROJECT_NAME=htpc

# > id
PUID=1026
PGID=100

# > curl https://ipapi.co/timezone
TZ=Europe/Brussels

# Media files (movies, series, downloads) — one root, see below
DATA_PATH=./htpc

# Container config. Do NOT put this in a Dropbox/GDrive-synced/SMB folder.
# !! This will corrupt the Radarr SQLite DB!!
CONFIG_PATH=./config

# no | on-failure | always | unless-stopped
RESTART_POLICY=unless-stopped

# For automatic updates with Watchtower
DOCKER_SOCKET=/var/run/docker.sock

# If you remember one port, make it Heimdall's:
HEIMDALL_PORT=9999
SONARR_PORT=8989
RADARR_PORT=7878
PROWLARR_PORT=9696
BAZARR_PORT=6767
QBITTORRENT_PORT=8080
FLARESOLVERR_PORT=8191
SEERR_PORT=5055
JELLYSTAT_PORT=3000

# Jellystat brings its own Postgres
JELLYSTAT_DB_USER=jellystat
JELLYSTAT_DB_PASSWORD=changeme
# openssl rand -hex 32
JELLYSTAT_JWT_SECRET=replace-with-a-long-random-string

# Recyclarr sync cron
RECYCLARR_CRON=0 4 * * *
```

`PUID`/`PGID` are *your* user's ids (run `id`), so the containers write files you actually own instead of
`root`. The [full `.env-example`](https://github.com/Laoujin/Htpc/blob/master/.env-example) has the
Watchtower notification block too (Slack/e-mail), left blank here.


# The one thing you must not get wrong

Give every download-and-media container the **same `/data` root**:

```yaml
volumes:
  - ${DATA_PATH}:/data
```

qBittorrent downloads into `/data/downloads`, Sonarr/Radarr import into `/data/media/...` — all on one
filesystem, one mount. That's what lets them **hardlink** and do **atomic (instant) moves** instead of a
slow, space-doubling copy on every import.

The classic beginner mistake is mounting `/downloads` in the torrent client and `/movies` in Radarr as
*separate* volumes. To the containers those are different filesystems, so every import becomes a full copy
and seeding a file you've also imported costs you the space twice. One `/data` root and the problem
disappears.
{: .notice--info}


# The compose file

Nothing exotic — the same shape repeated per service: the LSIO trinity, a config volume, the shared
`/data`, a port, a restart policy, and a Watchtower label.

```yaml
version: "3"

services:
  # Dashboard — the one URL you actually bookmark
  heimdall:
    image: linuxserver/heimdall
    container_name: htpc-heimdall
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
    volumes:
      - ${CONFIG_PATH}/heimdall:/config
    ports:
      - ${HEIMDALL_PORT}:80
      - ${HEIMDALL_PORT_SSH}:443
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # TV series
  sonarr:
    image: linuxserver/sonarr
    container_name: htpc-sonarr
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
    volumes:
      - ${CONFIG_PATH}/sonarr:/config
      - ${DATA_PATH}:/data
    ports:
      - ${SONARR_PORT}:8989
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Movies — same recipe, different port
  radarr:
    image: linuxserver/radarr
    container_name: htpc-radarr
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
    volumes:
      - ${CONFIG_PATH}/radarr:/config
      - ${DATA_PATH}:/data
    ports:
      - ${RADARR_PORT}:7878
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Indexer aggregator (syncs indexers into Sonarr/Radarr)
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:develop
    container_name: htpc-prowlarr
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
    volumes:
      - ${CONFIG_PATH}/prowlarr:/config
    ports:
      - ${PROWLARR_PORT}:9696
    restart: unless-stopped
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Subtitles
  bazarr:
    image: linuxserver/bazarr
    container_name: htpc-bazarr
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
    volumes:
      - ${CONFIG_PATH}/bazarr:/config
      - ${DATA_PATH}:/data
    ports:
      - ${BAZARR_PORT}:6767
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Torrent client — same /data root → hardlinks kept
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent
    container_name: htpc-qbittorrent
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
      - WEBUI_PORT=${QBITTORRENT_PORT}
    volumes:
      - ${CONFIG_PATH}/qbittorrent:/config
      - ${DATA_PATH}:/data
    ports:
      - ${QBITTORRENT_PORT}:${QBITTORRENT_PORT}
      - 6881:6881
      - 6881:6881/udp
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Solves Cloudflare challenges for Prowlarr (proxy: http://flaresolverr:8191)
  flaresolverr:
    image: ghcr.io/flaresolverr/flaresolverr
    container_name: htpc-flaresolverr
    environment:
      - LOG_LEVEL=info
      - TZ=${TZ}
    ports:
      - ${FLARESOLVERR_PORT}:8191
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Requests — point it at wherever Jellyfin lives
  seerr:
    image: ghcr.io/seerr-team/seerr
    container_name: htpc-seerr
    user: "${PUID}:${PGID}"
    init: true
    environment:
      - TZ=${TZ}
      - LOG_LEVEL=info
    volumes:
      - ${CONFIG_PATH}/seerr:/app/config
    ports:
      - ${SEERR_PORT}:5055
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Jellyfin watch analytics — needs its own Postgres
  jellystat-db:
    image: postgres:16
    container_name: htpc-jellystat-db
    environment:
      - POSTGRES_USER=${JELLYSTAT_DB_USER}
      - POSTGRES_PASSWORD=${JELLYSTAT_DB_PASSWORD}
    volumes:
      - ${CONFIG_PATH}/jellystat-db:/var/lib/postgresql/data
    restart: ${RESTART_POLICY}

  jellystat:
    image: cyfershepard/jellystat
    container_name: htpc-jellystat
    environment:
      - TZ=${TZ}
      - POSTGRES_USER=${JELLYSTAT_DB_USER}
      - POSTGRES_PASSWORD=${JELLYSTAT_DB_PASSWORD}
      - POSTGRES_IP=jellystat-db
      - POSTGRES_PORT=5432
      - JWT_SECRET=${JELLYSTAT_JWT_SECRET}
    volumes:
      - ${CONFIG_PATH}/jellystat/backup:/app/backend/backup-data
    ports:
      - ${JELLYSTAT_PORT}:3000
    depends_on:
      - jellystat-db
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Syncs TRaSH-guides quality profiles into Sonarr/Radarr on a cron
  recyclarr:
    image: ghcr.io/recyclarr/recyclarr
    container_name: htpc-recyclarr
    user: ${PUID}:${PGID}
    environment:
      - TZ=${TZ}
      - CRON_SCHEDULE=${RECYCLARR_CRON}
    volumes:
      - ${CONFIG_PATH}/recyclarr:/config
    restart: ${RESTART_POLICY}
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  # Auto-updates every labelled container above
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: ${RESTART_POLICY}
    environment:
      - TZ=${TZ}
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_LABEL_ENABLE=${WATCHTOWER_LABEL_UPDATE}
      - 'WATCHTOWER_SCHEDULE=${WATCHTOWER_SCHEDULE}'
    volumes:
      - ${DOCKER_SOCKET}:/var/run/docker.sock
```

I trimmed the `expose:` blocks and Watchtower's full notification env for readability — the
[unabridged file is in the repo](https://github.com/Laoujin/Htpc/blob/master/docker-compose.yml).


# The bits worth pointing at

A few services earn their own paragraph — most already have a full write-up elsewhere in the series:

- **qBittorrent** replaced Transmission — [here's why]({{ site.baseurl }}/blog/goodbye-transmission). Note
  `6881` is published verbatim (not via `.env`) it is the BitTorrent listen port.
- **Seerr** and **Jellystat** both point at a **Jellyfin that isn't in this file** — mine runs in a
  separate LXC. Requests > Sonarr/Radarr is why [Ombi got retired]({{ site.baseurl }}/blog/goodbye-ombi).
- **Recyclarr** runs `user: ${PUID}:${PGID}` directly (no LSIO wrapper) and syncs the
  [TRaSH guides]({{ site.baseurl }}/blog/recyclarr) on a cron.

Notice there's **no Jellyfin, no Prowlarr indexer secrets, no API keys** in here. Media serving lives
elsewhere and every credential is entered in each app's own UI on first boot. The compose only wires up
the plumbing.


# Watchtower: the self-updating fleet

Every service carries the same label:

```yaml
labels:
  - 'com.centurylinklabs.watchtower.enable=true'
```

With `WATCHTOWER_LABEL_ENABLE=true`, Watchtower only touches containers wearing that label — so a stray
container on the same host won't get surprise-upgraded. It pulls fresh images on the schedule,
recreates the container with the *same* env/volumes, and `WATCHTOWER_CLEANUP=true` bins the old image.
The full `.env` wires up Slack/e-mail so you get a ping when it does.

Watchtower is the lazy option, not the safe one — it can pull a breaking `:latest`. If you'd rather
update on your own terms, drop it and run `docker compose pull && docker compose up -d` by hand. More on
keeping the fleet in check in [Container Management]({{ 'blog/home-media-server-management' | relative_url }}).
{: .notice--info}


# Casting off

```sh
cp .env-example .env    # then edit PUID/PGID/TZ/paths
docker compose up -d
```

That's genuinely it. `docker compose logs -f sonarr` if something sulks, `docker compose down` to stop the
lot. Then open Heimdall on port `9999` and start configuring — which, as promised way back at the start,
is where the *real* time goes.


# Conclusion

Twelve containers, two files, one command. The compose file is deliberately boring: every service is the
same handful of lines, all the variety lives in `.env`, and the only genuinely load-bearing decision is
that shared `/data` root. Everything clever — quality profiles, indexers, requests — happens *after*
`up -d`, in each app's own UI.

Fair winds, and may your terabytes fill responsibly. 🏴‍☠️
