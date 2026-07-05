---
layout: post
author: Wouter Van Schandevijl
title: "Alternatives"
subTitle: "Don't fancy the crew? Every one has a stand-in"
date: 2020-07-15
updates:
  - date: "2026-07-05"
    desc: "Dropped dead Emby, OpenELEC, several discontinued Plex companions, CouchPotato and sonarr-sub-downloader; qBittorrent is now the default download client"
description: >
  Most projects can be swapped with any of these alternatives.
bigimg:
  url: Home Media Center-Alternatives-Big.png
  desc: "Photo by Daniele Levis Pelusi"
  origin: https://unsplash.com/photos/QSRXNv9kmus
img:
  url: alternatives-sm.webp
  linkUrl: 
categories: 
tags: [self-hosted, docker]
series: home-media-server
toc:
  title: Alternatives
  icon: docker
---

Don't like Sonarr/Radarr? Don't like Jellyfin?  
Check these alternative solutions, there is bound to be one you like.

<!--more-->

# Jellyfin <small>- The Media Server</small>

{% include github-stars.html url="jellyfin/jellyfin" desc="The Free Software Media System" %}

<br>

You can't really go wrong with any alternative:

{% include github-stars.html url="xbmc/xbmc" desc="Kodi Home theater/media center software and entertainment hub for digital media." %}
{% include github-stars.html url="osmc/osmc" desc="An OSMC (Open Source Media Center)" %}
{% include github-stars.html url="Red5/red5-server" desc="Red5 Server core" %}
{% include github-stars.html url="gerbera/gerbera" desc="UPnP Media Server for 2020: Stream your digital media through your home network" %}

## Plex

There is also [Plex](https://www.plex.tv/) of course. You'll find most plugins, addons, etc for Plex but for this series,
Plex was not really an option for me as it is not open-source.  

If you do decide to go with Plex, be sure to check out some companion projects:

{% include github-stars.html url="Tautulli/Tautulli" desc="monitoring and tracking tool for Plex Media Server" %}
{% include github-stars.html url="plexinc/pms-docker" desc="Plex Media Server Docker repo, for all your PMS docker needs." %}



# Sonarr & Radarr <small>- Library Management</small>

{% include github-stars.html url="Sonarr/Sonarr" desc="Smart PVR for newsgroup and bittorrent users." %}
{% include github-stars.html url="Radarr/Radarr" desc="A fork of Sonarr to work with movies à la Couchpotato." %}


<br>

I believe that Sonarr/Radarr is currently the way to go and that these alternatives
should not be considered unless you are already used to them.

{% include github-stars.html url="pymedusa/Medusa" desc="Automatic Video Library Manager for TV Shows." %}
{% include github-stars.html url="SickChill/SickChill" desc="Automatic Video Library Manager for TV Shows" %}
{% include github-stars.html url="sickgear/sickgear" desc="TV fork of Sick-Beard to fully automate TV enjoyment with innovation." %}



# qBittorrent <small>- Torrent Download Client</small>

{% include github-stars.html url="qbittorrent/qBittorrent" desc="qBittorrent BitTorrent client" %}

<br>

qBittorrent is the way to go these days with its built-in web UI.
Deluge is another download client with great integration in other projects.


{% include github-stars.html url="transmission/transmission" desc="Transmission BitTorrent client" %}
{% include github-stars.html url="deluge-torrent/deluge" desc="Deluge BitTorrent client" %}
{% include github-stars.html url="Novik/ruTorrent" desc="Yet another web front-end for rTorrent" %}
{% include github-stars.html url="aria2/aria2" desc="a lightweight multi-protocol & multi-source download utility" %}
{% include github-stars.html url="mayswind/AriaNg" desc="AriaNg, a modern web frontend making aria2 easier to use." %}




# Bazarr <small>- Subtitles</small>

{% include github-stars.html url="morpheus65535/bazarr" desc="A companion to Sonarr and Radarr to manage and download subtitles." %}

<br>

The beauty of Bazarr is that it's already integrated with Sonarr/Radarr. You can pick any subtitle-downloader,
like Subliminal, and connect it with a custom script (via Settings > Connect > Custom Script) in Sonarr/Radarr.

{% include github-stars.html url="Diaoul/subliminal" desc="Subliminal - Subtitles, faster than your thoughts" %}

Question is if you really need one because Jellyfin also has some subtitle support (but is it enough).
