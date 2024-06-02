---
layout: post
author: Wouter Van Schandevijl
title: "So... What ARE these Arr's doing?"
subTitle: "Get notified whenever something happened that you are interested in"
date: 2022-09-27
desc: >
  When it's the start of the new season of your favourite show, let the Arr's
  send you a little ping when it is ready for your viewing leisure.
bigimg:
  url: Connections-Big.png
  desc: "Photo by Miguel A Amutio"
  origin: https://unsplash.com/photos/27QOmh18KDc
img:
  url: Connections.png
  desc: "Photo by Hugo Jehanne"
  origin: https://unsplash.com/photos/LOHVrTsdvzY
  title: "Smoke signals is not really one of the options available."
categories: 
tags: [tutorial,fun]
series: home-media-server
toc:
  title: 💁 Connections
interesting:
  - git: caronc/apprise
    desc: "One notification library to rule them all."
  - git: containrrr/shoutrrr
    desc: Notification library for gophers and their furry friends.
---

When a new Futurama episode comes out after a 10 year hiatus,
how can the Arr-family help you not miss this major event?

# Connections

Pretty simple, connect Sonarr, Radarr etc to your favourite application!

Many options are provided out of the box like Twitter,
Discord, Slack, Telegram, Email, Synology, Plex, ...

<!--more-->

If your "thing" is not supported, there is also the option for
executing a [custom script](https://wiki.servarr.com/sonarr/custom-scripts)
or using a WebHook.

There are multiple [triggers](https://wiki.servarr.com/sonarr/settings#connections) for sending a notification.
The most useful is probably:

**On Import** - {Formerly Known as On Download} Be notified when episodes/movies are successfully imported.


## Slack

One of the predefined Connections. The only thing you really need to configure is the Slack WebHook.  
Which looks like this:

```sh
https://hooks.slack.com/services/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
```

Follow their [official instructions](https://api.slack.com/messaging/webhooks):

- [Create An App](https://api.slack.com/apps?new_app=1)
- Features > Incoming Webhooks
    - Activate Incoming Webhooks
    - Add New Webhook to Workspace
    - Copy the url!

![Activating Slack Webhook]({{ site.baseurl }}/assets/blog-images/Connections-Slack-Setup.png "Activating Slack Webhook"){: .img-responsive}


**What can you expect**:

Something like this:  
For movies you often even get a poster picture etc!

![Slack Webhook example]({{ site.baseurl }}/assets/blog-images/Connections-Slack-Result.png "Slack Webhook example"){: .img-responsive}


## Discord

- Setup your own Discord server
- Add your pirate text channel
- Open your server Settings
- Server Settings > Integrations
    - Create Webhook
    - Pick a cool icon etc
    - Copy Webhook URL
    - Save Changes


**What can you expect**:

A much better integration compared to Slack for sure!

![Discord Webhook example]({{ site.baseurl }}/assets/blog-images/Connections-Discord-Result.png "Discord Webhook example"){: .img-responsive}


## Players

To connect with **Jellyfin** add an `Emby` connection.  
For **Plex** there is a dedicated option available.


## Notifiarr

If you want a whole Dashboard...

- See it [in action online](https://notifiarr.com/)
- Easy Step by Step [installation instructions pdf]({{ site.baseurl }}/assets/Notifications - Notifiarr guide.pdf)
- [Official Wiki](https://notifiarr.wiki/)
- [Youtube: TRaSH Guides & Notifiarr](https://www.youtube.com/watch?v=DCxU3Vzaz6k)
