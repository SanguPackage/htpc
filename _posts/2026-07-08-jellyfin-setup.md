---
layout: post
author: Wouter Van Schandevijl
title: "Jellyfin Setup"
subTitle: "You need that transcoding"
date: 2026-07-08
description: >
  A docker-compose for Jellyfin with Intel QuickSync hardware transcoding,
  and the companions that make it sing: Seerr, Jellystat and Wizarr.
image: /assets/blog-images/JellyfinLG-big.png
bigimg:
  url: JellyfinLG-big.png
img:
  url: JellyfinLG.png
  linkUrl: 
github: jellyfin/jellyfin
categories: 
tags: [jellyfin, docker, self-hosted, media]
toc:
  title: Jellyfin Setup
  icon: tv
---

The [original setup]({{ site.baseurl }}/blog/home-media-server#jellyfin---the-media-server) picked
**Jellyfin** as the media server and the [docker-compose post]({{ site.baseurl }}/blog/home-media-server-docker-compose)
folded the whole fleet into one `compose.yml` — except Jellyfin: it runs on
its own so it can reach the iGPU for **hardware transcoding**.

<!--more-->


# The compose

The official `jellyfin/jellyfin` image:

```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin
    container_name: jellyfin
    restart: unless-stopped
    network_mode: host
    devices:
      # Intel QuickSync render node — hardware transcoding
      - /dev/dri:/dev/dri
    volumes:
      - /opt/jellyfin/config:/config
      - /opt/jellyfin/cache:/cache
      - /mnt/media:/data:ro
    environment:
      - TZ=Europe/Brussels
```


# Hardware transcoding <small>- the whole point</small>

Direct play (client just streams the file) needs no CPU. But the moment a client can't handle the codec,
container or bitrate — a 4K HEVC file to a phone on mobile data — Jellyfin has to **transcode**, and doing
that on the CPU will melt a core per stream. An Intel iGPU with **QuickSync** does it in hardware at a
fraction of the power.

Two things make it work:

1. **Pass the GPU in.** `devices: - /dev/dri:/dev/dri` hands the container Intel's render node. That's it
   for Docker on bare metal. (If your Jellyfin lives in an LXC/VM the iGPU has to be passed through *there*
   first — that's a rabbit hole of its own; the container line stays the same.)
2. **Use the image's own ffmpeg.** The official image ships a current `jellyfin-ffmpeg` with the Intel
   **iHD** driver baked in. Don't fight with the distro's `intel-media-va-driver` — verify the *image's*
   driver instead:

   ```sh
   docker run --rm --device /dev/dri:/dev/dri \
     --entrypoint /usr/lib/jellyfin-ffmpeg/vainfo \
     jellyfin/jellyfin:latest --display drm --device /dev/dri/renderD128
   ```

   You want `Driver version: Intel iHD … 25.x` and a list of profiles — H264/HEVC encode+decode, VP9,
   and **AV1 decode** on recent chips (no AV1 *encode* below Arc, that's fine).

Then in Jellyfin: **Dashboard → Playback → Hardware acceleration → VAAPI** (or Intel QuickSync), device
`/dev/dri/renderD128`, tick H264/HEVC/VP9. Force a transcode from a client and the playback info overlay
should read **"Transcode (hw)"**; `intel_gpu_top` on the host will show the video engine lighting up.

> **Pass the render node, not the card node.** If you're passing individual devices rather than the whole
> `/dev/dri`, pass `renderD128` and *not* `cardN` — the `cardN` number isn't stable across reboots and
> the container won't come back up after a host restart.


# Storage: two ways to lose your data

**Keep `/config` on local disk. Never on NFS, SMB or a Dropbox/GDrive-synced folder.** Jellyfin's library
is a **SQLite** database, and SQLite's file locking does not survive network/synced filesystems — you will
get a corrupted `library.db`. (Same reason the [`.env` in the compose post]({{ site.baseurl }}/blog/home-media-server-docker-compose#the-env-first)
shouts about `CONFIG_PATH`.) This is the single most common way people nuke a Jellyfin install.

**Mount the library read-only** — `/mnt/media:/data:ro`. Jellyfin only ever *reads* your media; the `:ro`
means a misconfigured library scan, a plugin, or a bad day can't touch the files that Sonarr/Radarr worked
so hard to organise. If you run Jellyfin on a different box than the library (I do — library on the NAS,
Jellyfin near the GPU), export the share read-only from the source too and let the *arrs be the only writers.


# Coming from the LinuxServer image?

If you're migrating off `linuxserver/jellyfin` onto the official image, the config layout is **nested one
level deeper** in LinuxServer. Copy with this mapping, **databases first**:

| LinuxServer (`/config/…`)      | Official (`/config/…`)      | What                    |
|--------------------------------|-----------------------------|-------------------------|
| `data/data/*.db`               | `data/`                     | databases (`library.db`)|
| `data/{metadata,plugins,root}` | `{metadata,plugins,root}`   | data-dir contents       |
| `*.xml`, `*.json`              | `config/`                   | settings                |

Point the official image at the wrong level and it silently creates **fresh empty databases** — you'll log
in to an empty server while your real library sits unused at `data/data/`. Copy the DBs first, metadata
last, and watch `df -h` — a metadata copy that fills the disk mid-run truncates the DBs.

> **Upgrade one major at a time.** `10.9 → 10.10 → 10.11`, not `10.9 → 10.11`. A two-major jump migrates
> the DB in one start and crashes mid-migration. Back up `/config` before each hop.


# The companions

Three little ships that orbit Jellyfin:

## Seerr <small>- requests</small>

{% include github-stars.html url="seerr-team/seerr" desc="Request app for friends and family" %}

The front door you give friends and family: they search, click *request*, and it lands in Sonarr/Radarr
(directly or after you approve). Covered already — see the [Seerr section]({{ site.baseurl }}/blog/home-media-server#seerr---requests)
and why I moved to it in [Goodbye Ombi]({{ site.baseurl }}/blog/goodbye-ombi). Its compose service lives in
the [docker-compose post]({{ site.baseurl }}/blog/home-media-server-docker-compose); point its `Jellyfin`
setting at this server's `:8096`.

## Jellystat <small>- watch analytics</small>

{% include github-stars.html url="CyferShepard/Jellystat" desc="Statistics app for Jellyfin" %}

A Grafana-ish dashboard for *who watched what, when, and how much got transcoded*. Note it's really **two**
containers — Jellystat plus its own Postgres — so it's a small stack, not a one-liner (the
[compose post]({{ site.baseurl }}/blog/home-media-server-docker-compose) has both services). Give it an API
key from **Dashboard → API Keys** and it backfills your whole history.

## Wizarr <small>- invitations & onboarding</small>

{% include github-stars.html url="wizarrrr/wizarr" desc="Invite and onboard users to Jellyfin/Plex" %}

Handing out Jellyfin accounts by hand gets old fast. **Wizarr** gives you an **invite link** instead: the
guest opens it, creates their own account, optionally gets walked through installing a client — and you
never touch the Users page. Set expiries, per-invite library access, and a request-app hand-off to Seerr.

{% include post/image.html file="wizarr-invitation.png" alt="" title="" desc="A Wizarr invitation" maxWidth="500px" %}


# Anything else Jellyfin-flavoured?

The ecosystem is deep. The ones actually worth adding:

- {% include icon.html name="tv" %} **Intro Skipper** ([`intro-skipper/intro-skipper`](https://github.com/intro-skipper/intro-skipper)) — a plugin that fingerprints episode intros/credits and adds the *Skip Intro* button. Single biggest quality-of-life upgrade for binge-watching series.
- {% include icon.html name="list" %} **Streamystats** ([`fredrikburmester/streamystats`](https://github.com/fredrikburmester/streamystats)) — a newer, prettier stats alternative to Jellystat if you want to shop around. Or the built-in **Playback Reporting** plugin for something lightweight and container-free.
- {% include icon.html name="user" %} **JFA-GO** ([`hrfee/jfa-go`](https://github.com/hrfee/jfa-go)) — the other invite/account manager, if Wizarr's onboarding flow isn't your taste.
- {% include icon.html name="tv" %} **Clients worth installing**: [Findroid](https://github.com/jarnedemeulemeester/findroid) (Android, gorgeous), [Swiftfin](https://github.com/jellyfin/swiftfin) (iOS/tvOS), [Jellyfin Media Player](https://github.com/jellyfin/jellyfin-media-player) (desktop, MPV-based). Most smart TVs (my LG included) have a native app in their store.
- {% include icon.html name="lightbulb" %} **Finamp** ([`jmshrv/finamp`](https://github.com/jmshrv/finamp)) — if you also point Jellyfin at a music library, this is the offline-capable music client.

Plugins like **Trakt** (scrobbling) and the **OpenSubtitles** downloader are one click from **Dashboard →
Plugins → Catalog** — no compose changes needed.


# Casting off

Jellyfin is the ship everything else exists to feed. Get the GPU passed in, keep `/config` on a real disk,
mount the library read-only, and hang Seerr, Jellystat and Wizarr off the side — and you've got a media
server your whole crew can sail without ever bothering the captain.

For the rest of the fleet — Sonarr, Radarr, Prowlarr, qBittorrent and the single `compose.yml` that runs
them — start back at the [Home Media Server]({{ site.baseurl }}/blog/home-media-server) series.
