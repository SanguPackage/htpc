---
layout: post
author: Wouter Van Schandevijl
title: "Goodbye Jackett, Long Live Prowlarr!!"
subTitle: "Indexer Management: Ain't Nobody Got Time For That"
date: 2022-09-25
desc: >
  Jackett was great but there were some issues, which Prowlarr addressed.
bigimg:
  url: Prowlarr-Big.png
  desc: "Photo by Matt Bennett"
  origin: https://unsplash.com/photos/78hTqvjYMS4
img:
  url: Prowlarr.png
  desc: "Photo by Raoul Droog"
  origin: https://unsplash.com/photos/yMSecCHsIBc
  title: "Jackett simply isn't as cool as Prowlarr"
categories: 
tags: [tutorial,fun]
series: home-media-server
toc:
  title: 🐅 Prowlarr
---

All welcome the newest member of the Arr-family: [Prowlarr](https://wiki.servarr.com/en/prowlarr).

It basically does the exact same thing as [Jackett](https://github.com/Jackett/Jackett) but with these differences:

- Automatic sync of indexers with Sonarr, Radarr, Readarr, ...
- Manual Search: Transforms magnet links into torrents so that they can be sent to Transmission
- Uses the same layout & UI as the other [Arr products](https://wiki.servarr.com)


<!--more-->


{% include github-stars.html url="Prowlarr/Prowlarr" desc="Looks and smells like Sonarr but made for music." %}
{% include github-stars.html url="Jackett/Jackett" desc="music library manager and MusicBrainz tagger" %}

# Automatic Sync

This is basically the big win for Prowlarr over Jackett. In both applications you select all public indexers
(or private ones if you have credentials;) but once you were done with this in Jackett, you still needed to
configure all of them in Sonarr, Radarr, ... etc. A lot of copy pasting.

This is no longer the case for Prowlarr: Using the API keys, the indexers are added to Sonarr, Radarr, ... automatically.



# Transmission Integration

Sometimes you wanted to download something else entirely; or Sonarr/Radarr had trouble finding exactly what you want.
Manual searches in Jackett were problematic in combination with Transmission: you'd get a magnet link that could not just be
dropped to the Transmission black hole, it doesn't pick it up. You'd have to revert to downloading locally or to
manually importing it in Transmission.

With Prowlarr, this manual work is a thing of the past.



# Same UI

Prowlarr uses the same UI (and offers the same configuration options!!) we're used to from the other Arr-products.
It also offers some additional functionality over Jackett like some cool graphs and stuff.



# Conclusion

If you are already all setup with Jackett there is not much reason to make the switch really.  
For new setups or if you're starting to tinker with the indexers, you want to look at Prowlarr instead.
