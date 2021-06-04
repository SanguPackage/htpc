---
layout: post
author: Wouter Van Schandevijl
title: "Container Management"
subTitle: ""
date: 2020-07-17
desc: >
  What was that url again?
bigimg:
  url: Home Media Center-Management-Big.jpg
  desc: "Photo by Cameron Venti"
  origin: https://unsplash.com/photos/3rabTGLccwc
img:
  url: Home Media Center-Small.jpg
  desc: "Photo by Ian Battaglia"
  origin: https://unsplash.com/photos/9drS5E_Rguc
categories: 
tags: [tutorial,fun]
series: home-media-server
toc:
  title: Container Management
  icon: icon-docker
---


By now, there are so many containers, who can remember all those funky names/urls/ports.
The solution is, obviously, to add even more containers!

<!--more-->


# Launchers

A web page where you add tiles for all your docker containers and open them with a single click.
The basic launchers (ex: Minimux) are not much more than a pretty bookmarks site for your containers (or anything else really).
The more advanced ones (ex: Organizr) aggregate information from the other containers so that for some common
functionality you don't even have to leave your launcher at all.


## Muximux

{% include github-stars.html url="mescon/Muximux" desc="A lightweight way to manage your HTPC" %}

The simplest, most lightweight launcher. Has a small header with your most used apps and launches them
in an iframe. Pretty slick, works well, the settings UI is perhaps a bit lacking.

{% include post/image.html file="Home Media Center-MixuMux-Screenshot.png" alt="" title="" desc="Muximux" maxWidth="500px" %}



## Heimdall

![Heimdall Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Heimdall-Logo.png "Heimdall Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="linuxserver/Heimdall" desc="An Application dashboard and launcher" %}

The [one I went with](https://heimdall.site/). Definitely more feature rich compared to Muximux:

- Multiple users, authentication and multiple dashboards (called "Tags")
- Shows the project logo of all containers mentioned in this post
- Has API integration to show some dynamic data on the tiles for some containers (called "Enhanced apps")
  - Ombi: How many pending requests
  - Transmission: Current Upload/Download speeds
  - Sonarr/Radarr: Missing / Download Queue counts
- Drag & Drop UI, set your own background, optional Google search field
- Open apps in the same or in a new tab

{% include post/image.html file="Home Media Center-Heimdall-Screenshot.jpg" alt="" title="" desc="Heimdall" maxWidth="500px" %}



## Organizr

{% include github-stars.html url="causefx/Organizr" desc="HTPC/Homelab Services Organizer" %}

Even more feature rich, Organizr gives you unified dashboard(s) for all your containers.
Very good integration with Plex.

- Smooth UI, many customization options
- Deep integration
  - Sonarr/Radarr calendars
  - Ombi requests
  - Media Server activity
  - [Monitor](https://github.com/Monitorr/Monitorr) healthchecks
  - ...


## HTPC-Manager

{% include github-stars.html url="styxit/HTPC-Manager" desc="A fully responsive interface to manage all your favorite software on your Htpc." %}

Works best with XBMC, Usenet & Sick Beard / Couchpotato. So not a good match for our Jellyfin, Sonarr / Radarr setup.



# Docker Infrastructure

<!-- TODO: Add Watchtower, vault, duplicati, ... -->

This section is a work in progress 😃 But you definitely want Portainer:

{% include github-stars.html url="portainer/portainer" desc="Manage all those docker containers..." %}
