---
layout: post
author: Wouter Van Schandevijl
title: "Alternatives"
subTitle: ""
date: 2020-07-15
desc: >
  Most projects can be swapped with any of these alternatives.
bigimg:
  url: Home Media Center-Alternatives-Big.png
  desc: "Photo by Daniele Levis Pelusi"
  origin: https://unsplash.com/photos/QSRXNv9kmus
img:
  url: Home Media Center-Small.jpg
  desc: "Photo by Ian Battaglia"
  origin: https://unsplash.com/photos/9drS5E_Rguc
  title: ""
  linkUrl: 
categories: 
tags: [tutorial,fun]
series: home-media-server
toc:
  title: Alternatives
  icon: icon-docker
---

Don't like Sonarr/Radarr? Don't like Jellyfin?  
Check these alternative solutions, there is bound to be one you like.

<!--more-->

# Jellyfin <small>- The Media Server</small>

{% include github-stars.html url="jellyfin/jellyfin" desc="The Free Software Media System" %}

<br>

You can't really go wrong with any alternative:

{% include github-stars.html url="xbmc/xbmc" desc="Kodi Home theater/media center software and entertainment hub for digital media." %}
{% include github-stars.html url="MediaBrowser/Emby" desc="Emby Server is a personal media server with apps on just about every device." %}
{% include github-stars.html url="osmc/osmc" desc="An OSMC (Open Source Media Center)" %}
{% include github-stars.html url="Red5/red5-server" desc="Red5 Server core" %}
{% include github-stars.html url="gerbera/gerbera" desc="UPnP Media Server for 2020: Stream your digital media through your home network" %}
{% include github-stars.html url="OpenELEC/OpenELEC.tv" desc="OpenELEC - The living room PC for everyone" %}

## Plex

There is also [Plex](https://www.plex.tv/) of course. You'll find most plugins, addons, etc for Plex but for this series,
Plex was not really an option for me as it is not open-source.  

If you do decide to go with Plex, be sure to check out some companion projects:

{% include github-stars.html url="Boerderij/Varken" desc="Standalone application to aggregate data from the Plex ecosystem into InfluxDB using Grafana" %}
{% include github-stars.html url="Tautulli/Tautulli" desc="monitoring and tracking tool for Plex Media Server" %}
{% include github-stars.html url="trakt/Plex-Trakt-Scrobbler" desc="Add what you are watching on Plex to trakt.tv" %}
{% include github-stars.html url="pannal/Sub-Zero.bundle" desc="Subtitles for Plex, as good you would expect them to be." %}
{% include github-stars.html url="ukdtom/WebTools.bundle" desc="WebTools is a collection of tools for Plex Media Server." %}
{% include github-stars.html url="Electronickss/TheaterTrailers" desc="Watch the same trailers as the movie theater plays before their movies" %}
{% include github-stars.html url="plexinc/pms-docker" desc="Plex Media Server Docker repo, for all your PMS docker needs." %}



# Sonarr & Radarr <small>- Library Management</small>

{% include github-stars.html url="Sonarr/Sonarr" desc="Smart PVR for newsgroup and bittorrent users." %}
{% include github-stars.html url="Radarr/Radarr" desc="A fork of Sonarr to work with movies à la Couchpotato." %}


<br>

I believe that Sonarr/Radarr is currently the way to go and that these alternatives
should not be considered unless you are already used to them.

{% include github-stars.html url="CouchPotato/CouchPotatoServer" desc="Automatic Movie Downloading via NZBs & Torrents" %}
{% include github-stars.html url="pymedusa/Medusa" desc="Automatic Video Library Manager for TV Shows." %}
{% include github-stars.html url="SickChill/SickChill" desc="Automatic Video Library Manager for TV Shows" %}
{% include github-stars.html url="sickgear/sickgear" desc="TV fork of Sick-Beard to fully automate TV enjoyment with innovation." %}



# Transmission <small>- Torrent Download Client</small>

{% include github-stars.html url="transmission/transmission" desc="Transmission BitTorrent client" %}

<br>

Not sure why I went with Transmission but I'm quite happy with the `/transmission-web-control/` UI.
Deluge is another download client with great integration in other projects.


{% include github-stars.html url="deluge-torrent/deluge" desc="Deluge BitTorrent client" %}
{% include github-stars.html url="qbittorrent/qBittorrent" desc="qBittorrent BitTorrent client" %}
{% include github-stars.html url="Novik/ruTorrent" desc="Yet another web front-end for rTorrent" %}
{% include github-stars.html url="aria2/aria2" desc="a lightweight multi-protocol & multi-source download utility" %}
{% include github-stars.html url="mayswind/AriaNg" desc="AriaNg, a modern web frontend making aria2 easier to use." %}




# Bazarr <small>- Subtitles</small>

{% include github-stars.html url="morpheus65535/bazarr" desc="A companion to Sonarr and Radarr to manage and download subtitles." %}

<br>

The beauty of Bazarr is that it's already integrated with Sonarr/Radarr. You can pick any subtitle-downloader,
like Subliminal, and connect it with a custom script (via Settings > Connect > Custom Script) in Sonarr/Radarr.

{% include github-stars.html url="Diaoul/subliminal" desc="Subliminal - Subtitles, faster than your thoughts" %}
{% include github-stars.html url="ebergama/sonarr-sub-downloader" desc="Sonarr custom post processor script for handling subtitle download" %}

Question is if you really need one because Jellyfin also has some subtitle support (but is it enough).
