---
layout: post
author: Wouter Van Schandevijl
title: "Goodbye Transmission, Hello qBittorrent"
subTitle: "The download client that made me bring my own UI, and then made me leave"
date: 2026-07-05
desc: >
  How Transmission 4.0 quietly killed the web UI, the linuxserver
  bring-your-own-UI dance that followed, and why I ended up on qBittorrent.
bigimg:
  url: transmission-big.webp
img:
  url: transmission-sm.webp
  desc: "It's not you, it's me. Actually, it's you."
categories: 
tags: [tutorial,fun]
series: swapping-tools
github: transmission/transmission
toc:
  title: 🧲 qBittorrent
---

Way back in the [original setup]({{ site.baseurl }}/blog/home-media-server#transmission---download-client)
I went with **Transmission** and picked the familiar
[`transmission-web-control`](https://github.com/ronggang/transmission-web-control) UI because it looks like
a regular desktop client. That served me well for years.

Then one day it just... stopped.

<!--more-->


# The v4 Troubles

On 2023-02-08 Transmission v4.0.0 happened, they rewrote the entire UI and it didn't ship with
my `transmission-web-control` anymore.

Because this whole thing is supposed to save you time, I took the easy way out:

```yaml
transmission:
  image: linuxserver/transmission:version-3.00-r8
```

Which served me well enough for these last 3 years.


# The Homelab Trigger

As I was seriously upgrading my homelab, it was time to also have a look at my beloved Pirateflix to
see what happened in the world of *arr.


## Bringing back my UI

It turned out to be pretty easy to get my good ol' web-control back:

```yaml
transmission:
  image: linuxserver/transmission
  environment:
    - DOCKER_MODS=linuxserver/mods:transmission-transmission-web-control
```

## What have the other UIs been up to

A quick look at the other UIs...

<details markdown="1">
<summary>docker-compose.yml — spin up all four UIs side by side</summary>

```yaml
x-transmission: &base
  image: lscr.io/linuxserver/transmission:latest
  environment: &env
    PUID: 1000
    PGID: 1000

services:
  floodui:
    <<: *base
    container_name: tr-floodui
    environment:
      <<: *env
      DOCKER_MODS: linuxserver/mods:transmission-floodui
    ports:
      - 9101:9091

  webcontrol:
    <<: *base
    container_name: tr-webcontrol
    environment:
      <<: *env
      DOCKER_MODS: linuxserver/mods:transmission-transmission-web-control
    ports:
      - 9102:9091

  transmissionic:
    <<: *base
    container_name: tr-transmissionic
    environment:
      <<: *env
      DOCKER_MODS: linuxserver/mods:transmission-transmissionic
    ports:
      - 9103:9091

  trguing:
    <<: *base
    container_name: tr-trguing
    environment:
      <<: *env
      DOCKER_MODS: linuxserver/mods:transmission-trguing
    ports:
      - 9104:9091
```

</details>

Four contenders, same daemon underneath. Here's what they look like:

<div class="ui-gallery">
  <figure><a href="{{ site.baseurl }}/assets/blog-images/transmission-ui-flood.png"><img src="{{ site.baseurl }}/assets/blog-images/transmission-ui-flood.png" alt="Flood for Transmission"></a><figcaption>Flood for Transmission</figcaption></figure>
  <figure><a href="{{ site.baseurl }}/assets/blog-images/transmission-ui-web-control.png"><img src="{{ site.baseurl }}/assets/blog-images/transmission-ui-web-control.png" alt="Transmission Web Control"></a><figcaption>Transmission Web Control</figcaption></figure>
  <figure><a href="{{ site.baseurl }}/assets/blog-images/transmission-ui-transmissionic.png"><img src="{{ site.baseurl }}/assets/blog-images/transmission-ui-transmissionic.png" alt="Transmissionic"></a><figcaption>Transmissionic</figcaption></figure>
  <figure><a href="{{ site.baseurl }}/assets/blog-images/transmission-ui-trguing.png"><img src="{{ site.baseurl }}/assets/blog-images/transmission-ui-trguing.png" alt="TrguiNG"></a><figcaption>TrguiNG</figcaption></figure>
</div>

And where each one lives — with how much love it's still getting:

|   | UI | Stars | Source |
|---|----|-------|--------|
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/transmission-ui-flood-icon.png"> | Flood for Transmission | <img class="nb" src="https://img.shields.io/github/stars/johman10/flood-for-transmission.svg?style=social&label=Star"> | [johman10/flood-for-transmission](https://github.com/johman10/flood-for-transmission) |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/transmission-ui-web-control-icon.ico"> | Transmission Web Control | <img class="nb" src="https://img.shields.io/github/stars/ronggang/transmission-web-control.svg?style=social&label=Star"> | [ronggang/transmission-web-control](https://github.com/ronggang/transmission-web-control) |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/transmission-ui-transmissionic-icon.png"> | Transmissionic | <img class="nb" src="https://img.shields.io/github/stars/6c65726f79/Transmissionic.svg?style=social&label=Star"> | [6c65726f79/Transmissionic](https://github.com/6c65726f79/Transmissionic) |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/transmission-ui-trguing-icon.png"> | TrguiNG | <img class="nb" src="https://img.shields.io/github/stars/openscopeproject/TrguiNG.svg?style=social&label=Star"> | [openscopeproject/TrguiNG](https://github.com/openscopeproject/TrguiNG) |


# Why Leave Transmission

Turns out that the integration between qBittorrent and the *arr family is better compared to Transmission.

- **Categories & tags**: qBittorrent's categories map each to a save path *and* line up exactly with the "category" field the *arr apps use.
- **Built-in search**
- **Sequential download**: download first & last pieces first
- **Built-in RSS auto-downloader** with filter rules.

{% include github-stars.html url="qbittorrent/qBittorrent" desc="qBittorrent BitTorrent client" %}


# Migrating to qBittorrent

The [`linuxserver/qbittorrent`](https://docs.linuxserver.io/images/docker-qbittorrent/) service that replaced it:

```yaml
qbittorrent:
  image: lscr.io/linuxserver/qbittorrent
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
```

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
