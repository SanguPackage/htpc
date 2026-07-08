---
layout: post
author: Wouter Van Schandevijl
title: "Container Management"
subTitle: "One dashboard to command the fleet — who remembers all those ports anyway"
date: 2020-07-17
description: >
  What was that url again?
image: /assets/blog-images/container-management-big.webp
bigimg:
  url: container-management-big.webp
img:
  url: container-management-sm.webp
categories: 
tags: [docker, self-hosted]
series: home-media-server
series_order: 3
toc:
  title: Container Management
  icon: docker
updates:
  - date: "2026-07-05"
    desc: "Homarr moved to homarr-labs, added Homepage and Prismarr, dropped dead HTPC-Manager"
  - date: "2022-10-30"
    desc: "Added Homarr"
---


By now, there are so many containers, who can remember all those funky names/urls/ports.  
The solution is, obviously, to add even more containers!

<!--more-->


# Launchers

A web page where you add tiles for all your docker containers and open them with a single click.
The basic launchers (ex: Minimux) are not much more than a pretty bookmarks site for your containers (or anything else really).
The more advanced ones (ex: Organizr) aggregate information from the other containers so that for some common
functionality you don't even have to leave your launcher at all.


## TL&amp;DR

You probably want to pick one of these:

- **Homepage**: Highly customizable and configured entirely in YAML (config-as-code)
- **Homarr**: Simple bookmarks with deeper integrations: a built-in calendar, healthchecks etc
- **Organizr**: If you want the ultimate dashboard and are willing to spend time on it
- **Heimdall**: Simple bookmarks with some small integrations

They know all your favourite containers and are pre-configured with icons/ports for easy setup.  
Integrations are something like showing coming-up shows/movies, the current download speed, active downloads and more.

Maintenance health at a glance (as of this update):

|   | Launcher | Stars | Source | Commits | Last commit |
|---|----------|-------|--------|---------|-------------|
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/homepage-logo.png"> | Homepage | <img class="nb" src="https://img.shields.io/github/stars/gethomepage/homepage.svg?style=social&label=Star"> | [gethomepage/homepage][gh-homepage] | 7,200 | 3 days ago |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/Homarr-Logo.png"> | Homarr | <img class="nb" src="https://img.shields.io/github/stars/homarr-labs/homarr.svg?style=social&label=Star"> | [homarr-labs/homarr][gh-homarr] | 5,174 | today |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/organizr-logo.png"> | Organizr | <img class="nb" src="https://img.shields.io/github/stars/causefx/Organizr.svg?style=social&label=Star"> | [causefx/Organizr][gh-organizr] | 4,237 | 7 weeks ago |
| <img class="nb" height="26" src="{{ site.baseurl }}/assets/blog-images/Home Media Center-Heimdall-Logo.png"> | Heimdall | <img class="nb" src="https://img.shields.io/github/stars/linuxserver/Heimdall.svg?style=social&label=Star"> | [linuxserver/Heimdall][gh-heimdall] | 1,267 | 8 months ago |
{: .full}

[gh-homepage]: https://github.com/gethomepage/homepage
[gh-homarr]: https://github.com/homarr-labs/homarr
[gh-organizr]: https://github.com/causefx/Organizr
[gh-heimdall]: https://github.com/linuxserver/Heimdall



## Homepage

{% include github-stars.html url="gethomepage/homepage" desc="A highly customizable dashboard, configured entirely in YAML" %}

[Homepage](https://gethomepage.dev/): my personal favourite. It's ridiculously customizable and, for me, its killer feature,
configured **entirely in YAML**, so your whole dashboard is config-as-code you can version alongside the rest of your
stack. It ships native widgets for loads of \*arr services.

I run this for my own homelab and love it.

{% include post/image.html file="homepage.png" alt="" title="" desc="Example Homepage Dashboard" maxWidth="500px" %}



## Homarr

![Homarr Logo]({{ site.baseurl }}/assets/blog-images/Homarr-Logo.png "Homarr Logo"){: style="float: left; margin-right: 16px; width: 50px"}

{% include github-stars.html url="homarr-labs/homarr" desc="Customizable home page to interact with your Docker containers (e.g. Sonarr/Radarr)" %}


[Homarr](https://homarr.dev/): One of the new *Arr kids on the block, with mobile support.  
Initial setup felt like work but if you enter the name of a known container (ex: Jellyfin, qBittorrent, ...) it will auto-fill in the details like Heimdall does.

Some notable features why you may want to go with Homarr instead of Heimdall:

- Calendar: Show coming up shows/movies in a calendar widget
- Docker: Start/Stop containers, Pin a running container to the dashboard
- Customizations: Light/Dark themes, background image, dashboard icon size, or just inject custom CSS

{% include post/image.html file="Homarr-Dashboard.png" alt="" title="" desc="Homarr Dashboard with calendar, ping, search, Transmission and docker integrations" maxWidth="500px" %}

{% include post/image.html file="Homarr-Settings.png" alt="" title="" desc="The Settings in Homarr" maxWidth="242px" %}



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


**Disclaimer**:  
I spent some time trying to get this to work and got a few things setup but eventually gave up.
You can create that one complete dashboard, but it's gonna take some time setting it up!



## Heimdall

![Heimdall Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Heimdall-Logo.png "Heimdall Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="linuxserver/Heimdall" desc="An Application dashboard and launcher" %}

The [one I went with](https://heimdall.site/). Definitely more feature rich compared to Muximux:

- Multiple users, authentication and multiple dashboards (called "Tags")
- Shows the project logo of all containers mentioned in this post
- Has API integration to show some dynamic data on the tiles for some containers (called "Enhanced apps")
  - qBittorrent: Current Upload/Download speeds
  - Sonarr/Radarr: Missing / Download Queue counts
- Drag & Drop UI, set your own background, optional Google search field
- Open apps in the same or in a new tab

{% include post/image.html file="Home Media Center-Heimdall-Screenshot.jpg" alt="" title="" desc="Heimdall" maxWidth="500px" %}


**Disclaimer**:  
While it works pretty well overall, editing an existing tile can be challenging at times. It's also on the slow
side and development has gone quiet (last release was ~8 months ago). Still, it works and everything Pirateflix
still runs on Heimdall in my setup.



## Muximux

{% include github-stars.html url="mescon/Muximux" desc="A lightweight way to manage your HTPC" %}

The simplest, most lightweight launcher. Has a small header with your most used apps and launches them
in an iframe. Pretty slick, works well, the settings UI is perhaps a bit lacking.

{% include post/image.html file="Home Media Center-MixuMux-Screenshot.png" alt="" title="" desc="Muximux" maxWidth="500px" %}



## Prismarr

{% include github-stars.html url="Shoshuo/Prismarr" desc="A unified dashboard for Radarr, Sonarr, Prowlarr, Seerr, qBittorrent and TMDb." %}

The new kid: rather than a generic launcher, Prismarr is an *arr-focused unified frontend that stitches
the containers into one interface. Ships as a single container. Small and young
(a single-developer project), so weigh that against the established options above before committing.




# Docker Infrastructure

This section is a work in progress 😃 But you definitely want:

{% include github-stars.html url="portainer/portainer" desc="Portainer to manage all those docker containers..." %}

And for keeping every one of those containers up to date, [Watchtower]({{ site.baseurl }}/blog/watchtower)
pulls fresh images and recreates them on a cron — with the honest trade-offs (and which containers to keep
*off* it) in its own post.
