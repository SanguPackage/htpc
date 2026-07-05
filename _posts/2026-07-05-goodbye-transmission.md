---
layout: post
author: Wouter Van Schandevijl
title: "Goodbye Transmission, Hello qBittorrent"
subTitle: "The download client that made me bring my own UI, and then made me leave"
date: 2026-07-05
desc: >
  How Transmission 4.0 quietly killed our web UI, the linuxserver
  bring-your-own-UI dance that followed, and why we ended up on qBittorrent.
bigimg:
  url: Home Media Center-HolyGrail-Big.png
  desc: "Photo from Once upon a time"
img:
  url: Home Media Center-Transmission-Logo.png
  desc: "Transmission"
  title: "It's not you, it's me. Actually, it's you."
categories: 
tags: [tutorial,fun]
series: swapping-tools
toc:
  title: 🧲 qBittorrent
---

Way back in the [original setup]({{ site.baseurl }}/blog/home-media-server#transmission---download-client)
I went with **Transmission** and was horrified by the default `combustion-release` UI, so I swapped in
[`transmission-web-control`](https://github.com/ronggang/transmission-web-control) which looks like a proper
desktop client. That served us well for years.

Then one day it just... stopped.

<!--more-->

{% include github-stars.html url="transmission/transmission" desc="Transmission BitTorrent client" %}


# The Last Good Version

On **2023-02-08** two things happened on the exact same day, and together they broke the setup:

1. Upstream shipped [**Transmission 4.0.0**](https://github.com/transmission/transmission/releases/tag/4.0.0),
   which *rewrote* the web client from scratch. No more jQuery, the whole gzipped bundle is now 68K, and it
   finally works on mobile. Nice, except it **replaces** the classic UI — it doesn't sit next to it.
2. The [`linuxserver/transmission`](https://docs.linuxserver.io/images/docker-transmission/) image rebased
   onto Alpine Edge and **removed the bundled third-party UI packages**. The `transmission-web-control` and
   `combustion` folders that used to just be *there* were gone.

So the last image where my UI came for free was **`linuxserver/transmission:version-3.00-r8`**. I pinned there
and froze the setup in amber — everything kept working, but no updates, forever. Not a great place to live.


# Bring Your Own Web UI

The post-4.0 world moved to *bring your own UI*. There are two ways to do it with the linuxserver image.

**Option 1 — `TRANSMISSION_WEB_HOME`.** Download an alternative UI, bind-mount it into the container, and point
the env var at the folder. This is the manual route and works for **any** UI, including ones without an official
mod (`kettu`, `combustion`, `shift`, ...).

```yaml
services:
  transmission:
    image: lscr.io/linuxserver/transmission:latest
    environment:
      - TRANSMISSION_WEB_HOME=/transmission-web-control
    volumes:
      - /opt/appdata/transmission/twc:/transmission-web-control
```

**Option 2 — `DOCKER_MODS`.** linuxserver's [docker-mods](https://github.com/linuxserver/docker-mods) system
downloads and *keeps updated* a UI every time the container starts. Much less to babysit. Chain multiple mods
with `|`.

```yaml
    environment:
      - DOCKER_MODS=linuxserver/mods:transmission-transmission-web-control
```

The UIs that have a first-class mod:

| UI                       | `DOCKER_MODS` value                                        |
|--------------------------|------------------------------------------------------------|
| Flood for Transmission   | `linuxserver/mods:transmission-floodui`                    |
| Transmission Web Control | `linuxserver/mods:transmission-transmission-web-control`   |
| Transmissionic           | `linuxserver/mods:transmission-transmissionic`             |
| TrguiNG                  | `linuxserver/mods:transmission-trguing`                    |

Anything else (`kettu`, `combustion`, ...) is `TRANSMISSION_WEB_HOME`-only these days. The mod approach got me
back to a familiar UI, but by now I was staring at a download client that needs a mod just to look presentable,
and started wondering what else was out there.


# Why Leave Transmission At All

The BYO-UI dance was the *trigger*. The actual *reason* to jump ship was everything qBittorrent does out of the box
that Transmission still doesn't:

- **Categories & tags** — Transmission 4.0 added basic labels, but qBittorrent's categories map each to a save
  path *and* line up exactly with the "category" field the \*arr apps use. That last bit is why the whole
  Sonarr/Radarr crowd standardises on it.
- **Built-in RSS auto-downloader** with filter rules. Transmission has no native RSS.
- **Built-in search** (plugin based). Transmission has none.
- **Sequential download** / download first & last piece first.
- A **full-featured WebUI** that ships in the box — no mods, no bind-mounts.

{% include github-stars.html url="qbittorrent/qBittorrent" desc="qBittorrent BitTorrent client" %}


# Migrating to qBittorrent

The [`linuxserver/qbittorrent`](https://docs.linuxserver.io/images/docker-qbittorrent/) service that replaced it:

```yaml
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:5.2.1_v2.0.12-ls459
    container_name: qbittorrent
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
```

The WebUI is on `8080` by default. To change it you have to update **both** sides of the port mapping **and** set
`WEBUI_PORT` — the image checks them against each other as a CSRF guard, so setting only one locks you out.

## The First-Login Gotcha

Since qBittorrent **4.6.1** the WebUI no longer ships with the old `admin` / `adminadmin` default — too many people
exposed those straight to the internet. Instead a **temporary password is printed to the container log on startup**:

```bash
docker logs qbittorrent | grep -i password
```

Set a real password immediately, or a fresh temporary one is regenerated on every restart. And a footgun for the
history books: the very first 4.6.1 build (2023-11-22) had a bug where the generated password *wasn't* printed at
all, locking everyone out. If you ever hit that, run tag `:version-4.6.0-r0`, log in with `admin` / `adminadmin`,
set a password, then move back to latest. Fixed in **4.6.2**.

## Moving the Torrents Across

There is **no state import** — you can't hand qBittorrent Transmission's resume files and call it a day. But because
both clients point `/data` at the same NFS export, no bytes have to move:

1. Point qBittorrent's default save path at the **same** download folder Transmission used.
2. Re-add the torrents (Transmission keeps its `.torrent` files under `.../transmission/torrents/`, so you can bulk-add them).
3. **Force-recheck** each one. qBittorrent sees the completed files already sitting there and picks straight back up
   seeding — no re-download.
4. Recreate your **categories** (e.g. `tv-sonarr`, `radarr`), each with its save path.

## Repointing the \*arrs

Last step, in each of Sonarr / Radarr / ... under **Settings → Download Clients**: drop the Transmission client, add a
**qBittorrent** one (host, `WEBUI_PORT`, credentials), and set the **Category** to match what you created above. From
then on every grab lands in qBittorrent under the right category. Anything still mid-download in Transmission is
easiest to just let finish and import there before you pull the plug.


# Conclusion

If you're setting up fresh: skip the detour and **start on qBittorrent**. The \*arr integration alone is worth it.

If Transmission still does everything you need, the `DOCKER_MODS` UI is a perfectly fine band-aid — no shame in
staying. But once I was already editing compose files to make the UI show up, moving to a client that just *works*
out of the box was an easy call.
