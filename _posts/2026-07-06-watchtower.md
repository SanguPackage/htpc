---
layout: post
author: Wouter Van Schandevijl
title: "Watchtower: The Self-Updating Fleet"
subTitle: "Set the crew to re-supply itself — and know when that's a mutiny risk"
date: 2026-07-06
description: >
  Watchtower pulls fresh images and recreates your containers for you, on a cron,
  with cleanup and notifications. Here's how to gate it to just the fleet you mean —
  and when you should reach for `docker compose pull` by hand instead.
image: /assets/blog-images/watchtower-big.webp
bigimg:
  url: watchtower-big.webp
img:
  url: watchtower-sm.webp
  desc: "Keeping watch so you don't have to — until it pulls a broken :latest"
categories: 
github: containrrr/watchtower
tags: [docker, self-hosted]
series: home-media-server
toc:
  title: 🗼 Watchtower
---

Twelve containers on `:latest` means twelve things quietly going stale. **Watchtower** watches for new
images, pulls them, and recreates the container on your schedule. It's the laziest possible update strategy.

<!--more-->

# The Setup

Watchtower rides in the same [`compose.yml`]({{ site.baseurl }}/blog/home-media-server-docker-compose) as
the rest of the fleet.

```yaml
watchtower:
  image: containrrr/watchtower
  container_name: watchtower
  restart: ${RESTART_POLICY}
  environment:
    - TZ=${TZ}
    - WATCHTOWER_CLEANUP=true
    - WATCHTOWER_LABEL_ENABLE=true
    - 'WATCHTOWER_SCHEDULE=${WATCHTOWER_SCHEDULE}'
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
```

Handing a container `/var/run/docker.sock` is effectively giving it root on the host — it can start, stop
and recreate *anything*. That's the deal with Watchtower.
{: .notice--warning}


# Gated Upgrades

By default Watchtower updates **every** container on the host. The fix is label-gating
with `WATCHTOWER_LABEL_ENABLE=true` and Watchtower only touches containers wearing
the opt-in label:

```yaml
labels:
  - 'com.centurylinklabs.watchtower.enable=true'
```

Every service in the compose file carries that line, so a stray container on the same host won't get a
surprise upgrade.


# Scheduling and cleanup

`WATCHTOWER_SCHEDULE` takes a **6-field cron** (the leading field is seconds — a Watchtower quirk, not
standard cron). Pick a quiet hour so a recreate never lands mid-stream:

```sh
# At 04:00 every day
WATCHTOWER_SCHEDULE=0 0 4 * * *

# Every 4th of the month at 05:00
WATCHTOWER_SCHEDULE=0 0 5 4 * *
```

`WATCHTOWER_CLEANUP=true` bins the old image after a successful update.


# Notifications

An update you don't hear about is an update you can't correlate with "why did Prowlarr break last
Tuesday". Watchtower can ping you whenever it recreates something. The [full
`.env-example`](https://github.com/Laoujin/Htpc/blob/main/.env-example) has the notification block —
left blank in the [compose walkthrough]({{ site.baseurl }}/blog/home-media-server-docker-compose) — ready
for Slack or e-mail:

```yaml
environment:
  # Slack (or any shoutrrr URL: discord://, telegram://, ...)
  - WATCHTOWER_NOTIFICATIONS=slack
  - WATCHTOWER_NOTIFICATION_SLACK_HOOK_URL=
  - WATCHTOWER_NOTIFICATION_SLACK_IDENTIFIER=Watchtower

  # or email
  - WATCHTOWER_NOTIFICATIONS=email
  - WATCHTOWER_NOTIFICATION_EMAIL_FROM=
  - WATCHTOWER_NOTIFICATION_EMAIL_TO=
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER=
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT=
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER=
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD=
```


# The Danger

**Watchtower is the lazy option, not the safe one.** `:latest` is a
moving target, and "pull whatever's newest and recreate" will, eventually, pull a release that changes a
config format, drops a setting, or just plain breaks — and it'll do it at 4am while you're asleep, with no
"are you sure".

That's a fine bargain for a home media stack: if Sonarr is down for a morning, nobody files a ticket. It's
a *terrible* bargain for anything you actually depend on. So the real decision is per-fleet:

- **Low-stakes, high-churn** (the \*arr apps, dashboards) → let Watchtower keep them fresh. The whole point is to never think about it.
- **Load-bearing or stateful** (databases, your reverse proxy) → **don't** label but update on your own terms:

  ```sh
  docker compose pull && docker compose up -d
  ```


# Alternative

If auto-recreate makes you nervous consider **[Renovate](https://github.com/renovatebot/renovate) / Dependabot**
— the grown-up option where you pin tags and update with an automatically created pull request.


# Conclusion

Auto-updates are a convenience, not a safety feature. Know which of your containers can afford a bad
morning, and handle the rest manually. 🏴‍☠️
