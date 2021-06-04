---
layout: post
author: Wouter Van Schandevijl
title: "Home Media Server"
subTitle: "How to fill all the terabytes and get on the FBI most wanted list without ever leaving your sofa"
date: 2020-07-19
desc: >
  How to setup your own media server using Linuxserver.io docker images.
bigimg:
  url: Home Media Center-Big.png
  desc: "Photo by Paweł Czerwiński"
  origin: https://unsplash.com/photos/Yjp0TshmIUI
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
  title: Home Media Server
  icon: bookmark
---

[Linuxserver.io](https://linuxserver.io) provides docker images of popular projects that work very well together.
Coincidentally they provide all the images one needs to setup a complete "Home Media Server" (and then some)
on your NAS, on a HTPC (Home Theater PC) or even on your main system.


This first part covers:

- Explaining what the different containers do and how they work together
- Which project I chose for each job. [Some possible alternatives can be found in this part](../home-media-server-alternatives)
- Some beginner tips & Configuration


<!--more-->


Other parts:

- All these containers are becoming unwieldy fast: [Container Management](../home-media-server-management)
- Looking for a complete out-of-the-box opinionated solution instead: [Prebuilt boxes](../home-media-server-prebuilt-boxes)
- If you do not want to stop at series/movies, take a look at [Out of scope](../home-media-server-out-of-scope) for inspiration



Actually setting up the containers is covered in the second part. You'll find the docker-compose file there! 😃


# The Goal

My goal was to have a system in place that downloads content and then have it available in a pretty UI,
ready to cast anything downloaded to my TV via the Google Chromecast from my tablet. Preferably completely
free and open-source.

Luckily many developers have been busy bees so that proved pretty easy, everything is out there and I was positively thrilled
to find out that most UIs seem to be written in React.  
On the way I even got myself a little extra: When I add a movie to my IMDB watchlist, it will start downloading it.

{% include post/image.html file="Home Media Center-High Level.png" alt="" title="" desc="" %}


## Filling in the dots

While it may seem daunting at first, it was pretty easy and fast to setup really (if you already know what you're going to
use anyway). The real fun begins after installation, it's the configuration that will take most time - tinkering with the settings
till everything is just right for you. Do you want to download 600MB-2GB movies? Or 4GB movies? 16GB? Do you need subtitles?
What **do** you want to watch?

Anyway, I came up with something that looks like this:

![The Goal]({{ site.baseurl }}/assets/blog-images/Home Media Center-In Depth.png "The Goal"){: .img-responsive}

## Breakdown

Some choices needed to be made because pretty much every docker container in the diagram above has [other open-source or
proprietary alternatives](../home-media-server-alternatives) you could opt for instead.

Need more details? Reddit is an excellent source of information for everything Sonarr/Radarr.


# Jellyfin <small>- The Media Server</small>

![Jellyfin Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Jellyfin-Logo.png "Jellyfin Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="jellyfin/jellyfin" desc="The Free Software Media System" %}

Went with the new kid on the block [**Jellyfin**](https://jellyfin.org/). Point it to a folder with movies and series and watch it go!
Has apps for Android, Apple and a website with Chromecast support.
There are also some [plugins](https://jellyfin.org/docs/general/server/plugins/index.html) like for OpenSubtitles,
Playback statistics. For me there were no must-have plugins though.


## What it looks like

Basically exactly what you'd expect:

{% include post/image.html file="Home Media Center-Jellyfin.png" alt="" title="" desc="Jellyfin Movie Library" maxWidth="360px" %}

{% include post/image.html file="Home Media Center-Jellyfin2.jpg" alt="" title="" desc="Jellyfin Movie Details" maxWidth="360px" %}


# Sonarr & Radarr <small>- Library Management</small>

![Sonarr Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Sonarr-Logo.png "Sonarr Logo"){: style="float: left; margin-right: 16px"}
{% include github-stars.html url="Sonarr/Sonarr" desc="Smart PVR for newsgroup and bittorrent users." %}
[**Sonarr**](https://sonarr.tv/): Keep track of what series you want to follow. It will download new episodes as they are aired.
There is even a calendar so you can keep track of things to watch each week :)

<br>

![Radarr Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Radarr-Logo.png "Radarr Logo"){: style="float: left; margin-right: 16px"}
{% include github-stars.html url="Radarr/Radarr" desc="A fork of Sonarr to work with movies à la Couchpotato." %}
[**Radarr**](https://radarr.video/): Pretty much Sonarr but for movies. Monitor announced movies and even lists, like the IMDB Top250 or
[these TrakTV lists of famous directors](https://trakt.tv/users/origin14/lists).



Point the `/movies` and `/series` folders to an empty folder, not to a directory with existing content.
You're best off first configuring the apps and then importing any existing files from somewhere else.
It's probably not a bad idea to try stuff out with a copy of some of your files first 😀
{: .notice--info}


Some other features:

- Settings > Media Management: <i class="fa fa-sitemap"></i> Automatic renaming and organizing
- **Settings > Profiles & Quality**: Define file sizes and profiles which you want/don't want
- **Wanted > Manual Import**: Import existing content from your filesystem
- <i class="fa fa-search"></i> Automatic Search and <i class="fa fa-user"></i> Manual Search for downloading new content
- Activity: Visualization and basic manipulation of content being downloaded
- Settings > Connect: Send notifications of events to API, Email, Slack, Growl, Jellyfin, ...
- Settings > Lists: Define an automatic instream of new movies by following IMDB, TrakTV, RSS, ... lists & feeds
- <i class="fa fa-bookmark"></i> Monitored or <i class="fa fa-bookmark-o"></i> Not Monitored: Should it download automatically
- A nice web UI for all that

One predefined instream is [StevenLU](https://github.com/sjlu/popular-movies): a list of popular movies based on a series of heuristics (theater visits).
Which sounds pretty cool but is currently broken due to Corona 😃

You'll definitely want to tinker with the profiles & quality because if you don't, it will just go for the biggest and
baddest Remux-2160p release and you are looking at 40-80 gigs for one movie.

## Extra's

{% include github-stars.html url="roboticsound/Pulsarr" desc="Browser extension to add movies/series directly from IMDB & TVDB" %}
{% include github-stars.html url="l3uddz/traktarr" desc="Script to add new series & movies based on Trakt lists." %}
{% include github-stars.html url="faulander/P4S" desc="Premieres for Sonarr - find all the new shows you've never known you're interested in!" %}
{% include github-stars.html url="gilbN/theme.park" desc="A collection of themes/skins for your favorite apps." %}


# Downloading Stuff

> Those movies aren't gonna download themselves.

Sonarr/Radarr don't know where to find content nor how to download said content.
You'll need Indexer(s) and Download Client(s) for that and configure them in Sonarr/Radarr.


But first you'll have to choose between Torrents and Usenet, or you can go for both.


## Torrents

There are free indexers out there (one starts with pirate and ends with bay😃) or you may already have access
to a private indexer. A few, for example [PassThePopcorn](https://passthepopcorn.me/), can be configured directly in Sonarr
but if you are relying on free offerings, you may not want to maintain the connection to multiple indexers manually
(after all they tend to change urls every so often).

### Jackett <small>- Indexers</small>

![Jackett Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Jackett-Logo.png "Jackett Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="Jackett/Jackett" desc="API Support for your favorite torrent trackers." %}
Jackett is the perfect companion for this. It maintains a list of preconfigured indexers for you.
Its uniform search API is used by Sonarr and Radarr.


If you're not sure which indexers to add from Jacketts list, check
[Reddit: Some free indexer recommendations](https://www.reddit.com/r/torrents/comments/5ok0yd/torrent_sites/)

Once you've added one/some indexers in Jackett, you can configure them in Sonarr in Settings > Indexers > Torznab > Presets.

{% include github-stars.html url="Prowlarr/Prowlarr" desc="Jackett alternative but for both Usenet & Torrents (early development)" %}

### Transmission <small>- Download Client</small>

![Transmission Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Transmission-Logo.png "Transmission Logo"){: style="float: left; margin-right: 16px"}
{% include github-stars.html url="transmission/transmission" desc="Transmission BitTorrent client" %}

<br>

Once Sonarr has received matching torrents from your favorite indexers, it will figure out which
one to pick based on your Quality/Profile settings and put the torrent in a folder for your
Download Client to pick up.

I went with Transmission and was simply horrified by the default `combustion-release` UI.
Luckily there is the alternative [`transmission-web-control`](https://github.com/ronggang/transmission-web-control)
UI which is very similar to a classic desktop BitTorrent client.
You could also go with the [`kettu`](https://github.com/endor/kettu) UI if you prefer something very basic.


## Usenet

**TL&DR**: Pay cash for a [Provider](https://www.reddit.com/r/usenet/wiki/providers) and
[Indexer](https://www.reddit.com/r/usenet/wiki/indexers) and worry no more about seeding, slow download speeds or third
parties snooping in on your download history.

**Longer Version**

Usenet? Yes, that's still a thing. Unfortunately it's no longer a thing. Meaning that there is lots and lots of content out there
but also that your ISP most likely does not include a [Usenet Provider](https://www.reddit.com/r/usenet/wiki/providers).
So you may need to pay for that (around $8 to $13 per month for unlimited download). Once you've got a Usenet provider,
you have access to the content but no idea where to
find it. Another, potentially not-free solution here: A [Usenet Indexer](https://www.reddit.com/r/usenet/wiki/indexers).
While for the usenet provider you're looking at a monthly subscription, for the indexer you can usually get off the hook
for a one time fee. A provider also has **retention**, ranging from about 1 year to up to 10 years after which content
posted earlier will no longer be available for download.

So with all that hassle why would you ever opt for Usenet at all?

- A provider usually provides a download speed above that of your ISP
- There are no seeders/leechers nor download/upload ratios nor abandoned torrents (but there is retention)
- Could use Usenet by default and fallback to Torrents when the content is not available
- Use SSL to connect with your provider and your ISP nor the government can see what you're downloading from Usenet


### Download Clients

[NZBGet](https://nzbget.net/) is the latest and greatest in both speed and UI but
[SABnzbd](https://sabnzbd.org/) still has most features and most integration support with other projects.

{% include github-stars.html url="nzbget/nzbget" desc="Efficient Usenet Downloader" %}
{% include github-stars.html url="sabnzbd/sabnzbd" desc="The automated Usenet download tool" %}

### Indexers

{% include github-stars.html url="theotherp/nzbhydra2" desc="Usenet meta search. The usenet counterpart of Jackett" %}


### Torrents vs Usenet

| What         | Usenet                                                 | Torrents |
|--------------|--------------------------------------------------------|----------|
| Availability | Only content uploaded within Provider retention        | Torrent must have seeders
| Download     | Probably limited only by your own hardware             | Limited to the upload speed of seeders and peers
| Security     | SSL. You're good.                                      | You probably want a VPN to stay anonymous
| Costs        | Usenet Provider (+/- $10/month) and Usenet Indexer entree fee | VPN cost ($2 to $5 / month)
{: .table-code}


# Bazarr <small>- Subtitles</small>

![Bazarr Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Bazarr-Logo.png "Bazarr Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="morpheus65535/bazarr" desc="A companion to Sonarr and Radarr to manage and download subtitles." %}

I've had varying success with Bazarr so far but that's just with free subtitle providers. There are many preconfigured
subtitle sites you can connect to with login credentials or an API key. It even has built-in Anti-Captcha options.


# Ombi <small>- Requests</small>

![Ombi Logo]({{ site.baseurl }}/assets/blog-images/Home Media Center-Ombi-Logo.png "Ombi Logo"){: style="float: left; margin-right: 16px"}

{% include github-stars.html url="tidusjar/Ombi" desc="Want a Movie or TV Show on Plex or Emby? Use Ombi!" %}

Anyone you give access to Ombi can request movies/series (with voting!) and those shows and movies get imported
in Sonarr/Radarr directly or after you approve.

This extra step can be handy because Sonarr/Radarr are pretty sophisticated applications. You probably do not want to start
explaining all that to your mother. The Ombi UI on the other hand is pretty much a searchbox, type in something and click
the request button.


{% include post/image.html file="Home Media Center-Ombi-Screenshot.png" alt="" title="" desc="Ombi Requests" maxWidth="360px" %}




# Sharing Is Caring

With the setup done, you'll want to share this with those that ask for a "What should I definitely watch?"-recommendation,
but can really only follow up on it if it's available on Netflix.

**Attention: These applications can do serious damage in the hands of the wrong user**!  
Most of them have access to (parts of) your filesystem. By changing just a few settings a malicious user with access to
Radarr, Sonarr, ... can delete all your media files. Make sure that all containers exposed to the internet have
a strong login/password set. For some containers, authentication is turned off by default!
{: .notice--danger}

Friends and family you'll typically give access only to the Media Server (Jellyfin or Plex or ...) and [Ombi](https://ombi.io/),
perhaps through a separate Heimdall dashboard (Heimdall is covered in [Container Management](../home-media-server-management))
user so they also have only one url to bookmark.
