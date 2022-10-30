---
layout: post
author: Wouter Van Schandevijl
title: "Jellyfin on LG Smart TV"
subTitle: "Easy on webOS 6, not so much on pre 2021 TVs with webOS 5 or less."
date: 2022-10-29
desc: >
  For webOS 6, get it from the official LG Content Store. If not, get ready to
  become a webOS TV Developer!
bigimg:
  url: JellyfinLG-Big.png
  desc: "Photo by Dall-E"
img:
  url: JellyfinLG.png
  desc: "Photo by Anna Tsukanova"
  origin: https://unsplash.com/photos/Kzfo5Tq7c9A
categories: 
tags: [tutorial,fun]
series: home-media-server
toc:
  title: Jellyfin on LG TV
  icon: tv
interesting:
  - url: https://jellyfin.org/posts/webos-july2022/
    desc: Official announcement Jellyfin LG Content Store release
---

If you have a Smart TV with **webOS 6+**, do not follow these instructions
but install it from the **official LG Content Store** instead!
{: .notice--danger .hide-from-excerpt}

# TL&amp;DR
{: .hide-from-excerpt}

Following these steps should get you up & running in no time.

- PC: [Create a Developer Account](https://us.lgaccount.com/login/sign_in)
- TV: Install "Developer Mode" from the LG Content Store
    - Turn on Developer Mode and Key Server
    - (1): Write down the Passphrase
- TV (2): All Settings > Network > Wi-Fi Connection > Advanced Wi-Fi Settings > IP Address
- PC: Start [Device Manager for webOS](https://github.com/webosbrew/dev-manager-desktop/releases/latest)
    - Add Device: Use TV IP Address and Passphrase from steps (1) and (2)
    - Apps > Install > Available > Jellyfin
    - Launch and 🎉
- PC: Remedy 50h Developer Mode timeout

<!--more-->

# Installation

Follow the instructions from the TL&DR ;)  
If that's too cryptic, you can find step by step instructions
in the [official docs](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app).
They also cover configuring your CLI or IDE.



## Developer Mode

After installing "Developer Mode" from the LG Content Store:

![Developer Mode Settings]({{ site.baseurl }}/assets/blog-images/LG-DevMode.png "Developer Mode Settings")



## Device Manager for webOS

{% include github-stars.html url="webosbrew/dev-manager-desktop" desc="Device/DevMode Manager for webOS TV" %}

Many ways to install Jellyfin, this Desktop UI makes it particulary easy. Check the official docs for screenshots on installation.

Note that you can leave the settings in "Add Device" not mentioned in the TL&DR as is:  
- Port Number: 9992
- SSH Username: prisoner
- Authentication Method: Official Dev Mode

The others:  
- Host Address: The IP is hidden under "Advanced Wi-Fi Settings" on your TV.
- Passphrase: The one displayed in the "Developer Mode" app you downloaded in the LG Content Store


### Manual ipk

If you don't want to install it from the "Available" tab:

- Download [Jellyfin `org.jellyfin.webos_x.x.x_all.ipk`](https://github.com/jellyfin/jellyfin-webos/releases/latest)
- Device Manager for webOS > Apps > Install > Select `.ipk`


# Automated Refresh

You basically do not want to turn on Developer Mode again every 50 hours...

A few ways of remedying this:


## Device Manager for webOS

Again to the rescue!!

Info > Dev Mode > Renew Automatically...

It offers two possibilities:  
- Using [ifttt](https://ifttt.com/)
- Using a [shell script]({{ site.baseurl }}/assets/lgtv-renew-developer-mode.sh) (schedule with a cron job)


## RootMyTV

Open the TV browser and surf to [RootMy.Tv](https://rootmy.tv/)...  
This automatically extends Developer Mode, plus you can now install stuff from the unofficial [webOS Homebrew Project](https://www.webosbrew.org).

{% include github-stars.html url="RootMyTV/RootMyTV.github.io" desc="RootMyTV is a user-friendly exploit for rooting/jailbreaking LG webOS smart TVs." %}
{% include github-stars.html url="webosbrew/webos-homebrew-channel" desc="Unofficial webOS TV homebrew store and root-related tooling" %}



## Other

- [Script](https://gist.github.com/Raicuparta/f9cd299918e7280cc5c90c947b95de0f) using [Home Assistant](https://www.home-assistant.io/)
- [webOS App Club](https://webosapp.club/timer/): This is a Russian site without Github links, so I didn't try it out
- [Manual instructions](https://github.com/SR-Lut3t1um/Webos-renew-dev/) in this Github README
