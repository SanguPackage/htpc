---
layout: post
author: Wouter Van Schandevijl
title: "Prebuilt Boxes"
subTitle: "Why create when you can borrow"
date: 2020-07-16
updates:
  - date: "2026-07-05"
    desc: "Added Saltbox, SEEDbox, mediastack, YAMS, media-stack, docker-compose-nas, seedbox, Buildarr, Deployrr and a homeserver-platforms section (Umbrel/CasaOS/Runtipi/Cosmos); Cloudbox/QuickBox/bobarr moved to discontinued; dropped dead docker-standup and docker-htpc-suite"
description: >
  Give in some control over your setup but gain a
  ready to go solution out of the box.
bigimg:
  url: prebuilt-boxes-big.webp
img:
  url: pre-built-sm.webp
  linkUrl: 
categories: 
tags: [self-hosted, hardware]
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


# Saltbox

![Saltbox Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Saltbox-Logo.png "Saltbox Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="saltyorg/Saltbox" desc="Ansible-based solution for rapidly deploying a Docker containerized cloud media server." %}

The spiritual successor to the now deprecated [Cloudbox](#cloudbox) and the one to reach for if you want that same
one-command Ansible experience: a single `sb install` turns a bare Ubuntu server into a full *arr + Plex/Emby/Jellyfin
stack behind Traefik/Authelia, complete with SABnzbd, NZBHydra2, Jackett, Tautulli, Organizr and Portainer.

{% include github-stars.html url="Pro-Tweaker/SEEDbox" desc="Ansible-based Docker containerized cloud media server — a lighter alternative to swizzin/Cloudbox/Saltbox (not the same project as jfroment/seedbox)." %}


# FlexGet

![FlexGet Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-FlexGet-Logo.png "FlexGet Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="Flexget/Flexget" desc="a multipurpose automation tool for content like torrents, nzbs, podcasts, comics, series, movies, etc." %}

At first glance, this seems to be more a thing for tech savvy users, built with the philosophy of "get stuff from anywhere".
And that shows by their [plugins](https://www.flexget.com/Plugins). They have integration with TrakTV, TheTvDb, IMDB, RottenTomatoes, and
much much more like for example CSV, HTML, FTP, Apple Trailers, ...

If you are looking for something hands on, this might be for you. There is work in progress for a Web UI that can already be used.


# Docker-Compose

{% include github-stars.html url="htpcBeginner/docker-traefik" desc="Docker Compose, Traefik, Swarm Mode, Google OAuth2/Authelia, and LetsEncrypt" %}
{% include github-stars.html url="sebgl/htpc-download-box" desc="Sonarr / Radarr / Jackett / NZBGet / Deluge / OpenVPN / Plex" %}
{% include github-stars.html url="tom472/mediabox" desc="Container based media tools configuration" %}
{% include github-stars.html url="rogsme/yams" desc="Yet Another Media Server. Full arr stack + Jellyfin/Emby/Plex, installed with a single bash script." %}
{% include github-stars.html url="navilg/media-stack" desc="Self-hosted media stack with AI-powered recommendations (Recommendarr), Sonarr/Radarr/Prowlarr/Jellyfin/Seerr and VPN." %}
{% include github-stars.html url="AdrienPoupa/docker-compose-nas" desc="Simple Docker Compose NAS: Sonarr, Radarr, Prowlarr, Jellyfin, qBittorrent, PIA VPN and Traefik with SSL support." %}
{% include github-stars.html url="jfroment/seedbox" desc="A Docker-powered seedbox with persistent data and more cool stuff." %}


# mediastack

![mediastack Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-mediastack-Logo.png "mediastack Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="geekau/mediastack" desc="The ultimate Docker Compose files and configs to build your desired media stack, quickly and easily." %}

Ships full-VPN, mini-VPN and no-VPN Compose variants plus a `restart.sh` helper to deploy 40+ apps: the complete *arr
suite (including Readarr, Mylar and Whisparr), qBittorrent + SABnzbd, Jellyfin + Plex and Seerr for requests, all with
secure outbound traffic and MFA-protected remote access out of the box.


# Homeserver Platforms

These are not media-specific: they are general-purpose self-hosted homeserver OSes with an app store, where Jellyfin
and the *arr suite are just some of the hundreds of available apps. You trade the media-specific opinionation of a
Saltbox or mediastack for a nicer UI and a lot more flexibility.

{% include github-stars.html url="getumbrel/umbrel" desc="An elegant home server OS with over 300 apps in the Umbrel App Store." %}
{% include github-stars.html url="IceWhaleTech/CasaOS" desc="A simple, easy-to-use, elegant open-source Personal Cloud system." %}
{% include github-stars.html url="runtipi/runtipi" desc="A homeserver for everyone: one command setup, one click installs." %}
{% include github-stars.html url="azukaar/Cosmos-Server" desc="A secure, easy self-hosted home server with an app store, reverse proxy and built-in authentication/anti-DDoS." %}


# Other

{% include github-stars.html url="GhostWriters/DockSTARTer" desc="DockSTARTer helps you get started with running apps in Docker." %}
{% include github-stars.html url="liaralabs/swizzin" desc="A simple, modular seedbox solution" %}
{% include github-stars.html url="SimpleHomelab/Deployrr" desc="Automates Homelab setup using Docker and Docker Compose." %}


## Buildarr

{% include github-stars.html url="buildarr/buildarr" desc="Constructs and configures Arr PVR stacks." %}

The odd one out here: rather than deploying containers, Buildarr does configuration-as-code. You declare your Sonarr,
Radarr, Prowlarr, ... settings in YAML and it applies them (and keeps them in sync) against running instances, fetching
API keys for you. Pair it with their example Ansible playbooks to spin up and fully configure a brand new stack from
scratch with a single command.

{% include github-stars.html url="buildarr/ansible-playbooks" desc="Example Ansible playbooks for deploying Arr stacks using Buildarr." %}


## Openflixr

Openflixr uses VM instead of Docker.

Not much seems to be happening here anymore,
but they still have an active [Discord](https://discord.gg/vGkVqDBvSc).



## Discontinued

{% include github-stars.html url="htpcBeginner/AtoMiC-ToolKit" desc="AtoMiC Toolkit simplifies HTPC / Home Server setup and management on Ubuntu and Debian variants including Raspbian." %}
{% include github-stars.html url="iam4x/bobarr" desc="The all-in-one alternative for Sonarr, Radarr, Jackett... with a VPN and running in docker" %}


### QuickBox

{% include github-stars.html url="QuickBox/QB" desc="A simplistic approach to achieving easy seedbox and services management from a beautifully designed dashboard." %}

There is now a QuickBox Pro which most of the attention of the maintainer goes to, so keep that in mind when choosing this option.
A nice web UI to [install software](https://quickbox.io/knowledge-base/list-of-applications-you-can-install-on-quickbox/) (ie Sonarr, Radarr, ...),
monitor your server (CPU, RAM, ...) and easy user management.


### Cloudbox

![Cloudbox Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Cloudbox-Logo.png "Cloudbox Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="Cloudbox/Cloudbox" desc="Rapidly deploy a Docker containerized cloud media server." %}

Cloudbox was [deprecated in March 2025](https://github.com/Cloudbox/Cloudbox) and is no longer maintained.

The [Cloubox](https://cloudbox.works/) had you completely covered with Plex (+ Tautulli, ...), Sonarr, Radarr, Lidarr,
Jackett/ruTorrent, NZBGet/nzbhydra2, Organizr, Ombi, Portainer and optionally also Emby, Traktarr, Heimdall etc.

<details markdown="1">
<summary>Assumptions, prerequisites and features</summary>

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

</details>
