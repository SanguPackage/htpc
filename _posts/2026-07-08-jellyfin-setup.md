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
gallery_wizarr:
  - image: wizarr-invitation.png
    text: A Wizarr invitation
  - image: wizarr-onboarding.png
    text: Guided client onboarding
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
      # The data is a SQLite DB
      # Do not put this on Dropbox, NFS, SMB
      # As data corruption may occur!
      - /opt/jellyfin/config:/config
      - /opt/jellyfin/cache:/cache
      # :ro == read-only
      - /mnt/media:/data:ro
    environment:
      - TZ=Europe/Brussels
```


# Hardware transcoding

The moment a client can't handle the codec, container or bitrate (ex: a 4K HEVC file to a phone on mobile data),
Jellyfin has to **transcode**, and doing that on the CPU will melt a core per stream. An Intel iGPU with **QuickSync**
does it in hardware at a fraction of the power.

Two things make it work:

1. **Pass the GPU in.** `devices: - /dev/dri:/dev/dri` hands the container Intel's render node. That's it
   for Docker on bare metal. (If your Jellyfin lives in an LXC/VM the iGPU has to be passed through *there*
   first — that's a rabbit hole of its own; the container line stays the same.)
2. **Turn it on in Jellyfin.** **Dashboard → Playback → Hardware acceleration → VAAPI** (or Intel
   QuickSync), device `/dev/dri/renderD128`, tick H264/HEVC/VP9. Force a transcode from a client and the
   playback info overlay should read **"Transcode (hw)"**; `intel_gpu_top` on the host will show the video
   engine lighting up.


# The Companions

The ships that orbit Jellyfin:

## Seerr <small>- requests</small>

![Seerr Logo]({{ site.baseurl }}/assets/seerr.png "Seerr Logo"){: style="float: left; margin-right: 16px; width: 50px"}
{% include github-stars.html url="seerr-team/seerr" desc="Request app for friends and family" %}

The front door you give friends and family: they search, click *request*, and it lands in Sonarr/Radarr
(directly or after you approve).

{% include post/image.html file="seerr-preview.jpg" alt="" title="" desc="Seerr Requests" maxWidth="460px" %}



## Watch Analytics

There is the built-in **Playback Reporting** plugin for something lightweight and container-free.
It's very basic...

If you want more *who watched what, when, and how much got transcoded* stats, there is:

### Jellystat

![Jellystat Logo]({{ site.baseurl }}/assets/blueprint/logos/jellystat.svg "Jellystat Logo"){: style="float: left; margin-right: 16px; width: 50px"}
{% include github-stars.html url="CyferShepard/Jellystat" desc="Statistics app for Jellyfin" %}


### Streamystats

![Streamystats Logo]({{ site.baseurl }}/assets/blog-images/streamystats-logo.png "Streamystats Logo"){: style="float: left; margin-right: 16px; width: 50px"}
{% include github-stars.html url="fredrikburmester/streamystats" desc="Streamystats is a statistics service for Jellyfin, providing analytics and data visualization." %}

A newer stats alternative to Jellystat. I installed it for the heck of it... I'll get back here with conclusions sometime 😉


## Wizarr <small>- invitations & onboarding</small>

{% include github-stars.html url="wizarrrr/wizarr" desc="Invite and onboard users to Jellyfin/Plex" %}

I thought this was a bit silly but then I tried it and well... It's actually pretty nice, instead
of giving your mom a URL, create her login/password and do a whole lot of explaining, you just give her a link
and she gets onboarded with a wizard where she gets explained what it is, how to get going,
fill in her own login/password.

It works for Plex, Emby, Jellyfin and also for:

{% include github-stars.html url="advplyr/audiobookshelf" desc="Self-hosted audiobook and podcast server" %}
{% include github-stars.html url="rommapp/romm" desc="A beautiful, powerful, self-hosted rom manager and player." %}
{% include github-stars.html url="gotson/komga" desc="Media server for comics/mangas/BDs/magazines/eBooks" %}
{% include github-stars.html url="Kareadita/Kavita" desc="Kavita is a fast, feature rich, cross platform reading server." %}

If you are using more than just Jellyfin, then this really is a no-brainer.

Afterwards you can even use it to easily reset their passwords, because obviously they are still going to forget it.

{% include gallery.html items=page.gallery_wizarr id="wizarr" maxWidth="500px" %}

There is also an alternative inviter-app:  
{% include github-stars.html url="hrfee/jfa-go" desc="a bit-of-everything user management app for Jellyfin" %}


# Intro Skipper

![Intro Skipper Logo]({{ site.baseurl }}/assets/blog-images/intro-skipper-logo.png "Intro Skipper Logo"){: style="float: left; margin-right: 16px; width: 50px"}
{% include github-stars.html url="intro-skipper/intro-skipper" desc="Automatically detect and skip intro/credit sequences in Jellyfin" %}

Adding a **Skip Intro** button!? My god... I need to [install](https://github.com/intro-skipper/intro-skipper/wiki/Installation)
this right now...

- Jellyfin → Dashboard → Plugins
- Prerequisite: Available → Install "TheTVDB"
- Manage Repositories → + New Repository
- `https://intro-skipper.org/manifest.json`
- I had to F5 for it to show up
- Intro Skipper → Install
- Dashboard → Restart
- Dashboard → Scheduled Tasks → Detect and Analyze Media Segments
- Profit


# Clients

{% include github-stars.html url="jarnedemeulemeester/findroid" desc="Third-party native Jellyfin Android app" %}
{% include github-stars.html url="jellyfin/swiftfin" desc="Native Jellyfin Client for iOS and tvOS" %}
{% include github-stars.html url="jmshrv/finamp" desc="A Jellyfin music client for mobile" %}

And our [LG Smart TV]({{ site.baseurl }}/blog/lg-smart-tv/) installation guide.


# Other Plugins

The ecosystem is deep. These two I have installed in
**Dashboard → Plugins → Catalog**

- **Trakt** (scrobbling)
- **OpenSubtitles** downloader
