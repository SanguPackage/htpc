---
layout: post
author: Wouter Van Schandevijl
title: "Prebuilt Boxes"
subTitle: "Why create when you can borrow"
date: 2020-07-16
desc: >
  Give in some control over your setup but gain a
  ready to go solution out of the box.
bigimg:
  url: Home Media Center-Boxes-Big.jpg
  desc: "Photo by chuttersnap"
  origin: https://unsplash.com/photos/fyaTq-fIlro
img:
  url: Home Media Center-Small.jpg
  desc: "Photo by Ian Battaglia"
  origin: https://unsplash.com/photos/9drS5E_Rguc
  title: ""
  linkUrl: 
categories: dev-setup
tags: [tutorial,fun]
series: home-media-server
toc:
  title: Prebuilt Boxes
  icon: lightbulb
---


If you don't want to manage all those containers and configuration,
this plumbing has been done time and time again and you can decide to build upon an existing
project that has done most of the heavy lifting already or you could just opt for a
complete out-of-the-box solution.

<!--more-->


# Cloudbox

![Cloudbox Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Cloudbox-Logo.png "Cloudbox Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="Cloudbox/Cloudbox" desc="Rapidly deploy a Docker containerized cloud media server." %}

The [Cloubox](https://cloudbox.works/) has you completely covered with Plex (+ Tautulli, ...), Sonarr, Radarr, Lidarr,
Jackett/ruTorrent, NZBGet/nzbhydra2, Organizr, Ombi, Portainer and optionally also Emby, Traktarr, Heimdall etc.

This setup focusses on cloud integration and comes with the following assumptions, prerequisites and features:
- The files are actually stored in the cloud (GDrive)
- You need a custom domain for pretty urls like radarr.your-domain.com
- You need a Plex or Emby account
- Builtin Https with Let's Encrypt
- Backup/Restore
- An Ubuntu Server 16.04 or 18.04 with root access and at least 100GB HD (500GB+ preferred)

For me Cloudbox wasn't a good fit primarily because I do not want to sync/backup with the cloud which is basically the whole
philosophy of this setup. I've seen some testimonials that it just works though, even for giant libraries (60TB) stored on GDrive.

However it's not like Cloudbox will just deploy itself with an easy installation wizard and clicking next, next, next...
Their [Wiki](https://github.com/Cloudbox/Cloudbox/wiki), has step by step installation instructions, and while it is much
longer than you'd hope, it is really necessary to read them and actually follow them step by step.
If you do, you'll have the whole system setup in less time compared to trying to do so yourself: You don't need to figure out how to link everything nor do you need
to learn all the applications, you can just follow their installation wiki which also contains screenshots of the required configuration for each project.


# FlexGet

{% include github-stars.html url="Flexget/Flexget" desc="a multipurpose automation tool for content like torrents, nzbs, podcasts, comics, series, movies, etc." %}

At first glance, this seems to be more a thing for tech savvy users, built with the philosophy of "get stuff from anywhere".
And that shows by their [plugins](https://www.flexget.com/Plugins). They have integration with TrakTV, TheTvDb, IMDB, RottenTomatoes, and
much much more like for example CSV, HTML, FTP, Apple Trailers, ...

If you are looking for something hands on, this might be for you. There is work in progress for a Web UI that can already be used.


# Docker-Compose

{% include github-stars.html url="htpcBeginner/docker-traefik" desc="Docker Compose, Traefik, Swarm Mode, Google OAuth2/Authelia, and LetsEncrypt" %}
{% include github-stars.html url="sebgl/htpc-download-box" desc="Sonarr / Radarr / Jackett / NZBGet / Deluge / OpenVPN / Plex" %}
{% include github-stars.html url="tom472/mediabox" desc="Container based media tools configuration" %}
{% include github-stars.html url="phikai/htpc-docker-standup" desc="docker-compose configuration to start a HTPC w/ Plex, Deluge, Sonarr, Radarr and more!" %}
{% include github-stars.html url="funkypenguin/docker-htpc-suite" desc="A suite of tools for HTPC, nicely dockerized" %}


# Other

{% include github-stars.html url="GhostWriters/DockSTARTer" desc="DockSTARTer helps you get started with running apps in Docker." %}
{% include github-stars.html url="liaralabs/swizzin" desc="A simple, modular seedbox solution" %}
{% include github-stars.html url="iam4x/bobarr" desc="The all-in-one alternative for Sonarr, Radarr, Jackett... with a VPN and running in docker" %}


## Openflixr

[Openflixr](https://www.openflixr.com/) uses VM instead of Docker.

Currently under [new management](https://www.reddit.com/r/seedboxes/comments/ixbc12/what_happened_to_openflixr/):
their website is down, the alternative [url](http://openflixr.olympitech.co.uk/).
Check out their [Discord](https://discord.gg/vGkVqDBvSc) if interested!


## QuickBox

{% include github-stars.html url="QuickBox/QB" desc="A simplistic approach to achieving easy seedbox and services management from a beautifully designed dashboard." %}

There is now a QuickBox Pro which most of the attention of the maintainer goes to, so keep that in mind when choosing this option.
A nice web UI to [install software](https://quickbox.io/knowledge-base/list-of-applications-you-can-install-on-quickbox/) (ie Sonarr, Radarr, ...),
monitor your server (CPU, RAM, ...) and easy user management.


## Discontinued

{% include github-stars.html url="htpcBeginner/AtoMiC-ToolKit" desc="AtoMiC Toolkit simplifies HTPC / Home Server setup and management on Ubuntu and Debian variants including Raspbian." %}
