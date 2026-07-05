# Other *arr-family tools worth a look

Scouting notes for tools adjacent to the current stack (Jellyfin · Seerr · Jellystat · Sonarr · Radarr ·
Prowlarr · Bazarr · qBittorrent · FlareSolverr). Verified July 2026 — this corner of the ecosystem churns
fast, so re-check before trusting anything here.

Bias assumed throughout: **quantity over quality**, **low-maintenance / set-and-forget**, **Jellyfin (not
Plex)**, and **shared with family**.

## TL;DR

**Install these** — they fit the bias and are actively maintained:

- **SuggestArr** — top pick. Reads Jellyfin watch history and auto-requests similar titles into Seerr. The
  library refills itself: quantity-over-quality as a running container.
- **Cleanuparr** — set-and-forget queue hygiene. Kills stalled / blocked / malware downloads on qBittorrent
  and re-searches. (Run this *or* Decluttarr, never both — they'll fight.)
- **Janitorr** — the eventual counterweight to hoarding: auto-reclaims disk by age/watched and clears Seerr
  requests. The one cleanup tool that actually reads your **Jellystat**.
- **Wizarr** — self-service Jellyfin invites/onboarding for family.
- *(optional)* **Unpackerr** — idle until a release is RAR'd, then quietly saves a stuck import. Harmless.

**Blog them, don't install them** — better as stories than as containers:

- 💀 **Readarr is dead.** Servarr retired it; repo archived read-only on **2025-06-27** after its metadata
  source broke for good. Replacements: Chaptarr (maturing), Calibre-Web-Automated + Shelfmark (ebooks),
  Audiobookshelf (audiobooks).
- ☠️ **Huntarr imploded.** On paper a perfect "fill the library" tool — in reality the repo was **deleted in
  Feb 2026** after a security review found ~21 vulns, including an unauthenticated endpoint dumping every
  connected *arr API key in cleartext. Only sketchy forks remain. Great cautionary post.

**Skip** for this stack: Autobrr (private-tracker power tool), Configarr / Profilarr (Recyclarr-category
quality tuners — same reason Recyclarr got skipped), Whisparr (adult, on a *family* Jellyfin), Lidarr (no
music), Maintainerr (capable, but wants Streamystats — won't read your Jellystat).

## Comparison

Legend — **Verdict**: ✅ install · 📝 blog only · 🤷 works, better option exists · ⛔ not for this stack

| Tool                       | What it does                                        | Status (last release)      | Docker image                      | Verdict |
|----------------------------|-----------------------------------------------------|----------------------------|-----------------------------------|---------|
| [SuggestArr][suggestarr]   | Jellyfin history → auto-requests similar to Seerr   | ✅ active (v2.9.1)          | `ciuse99/suggestarr`              | ✅      |
| [Cleanuparr][cleanuparr]   | Removes stalled/blocked/malware downloads + queue   | ✅ very active (v2.9.15)    | `ghcr.io/cleanuparr/cleanuparr`   | ✅      |
| [Janitorr][janitorr]       | Reclaims disk by age/watched, clears Seerr requests | ✅ active (v2.1.1)          | `ghcr.io/schaka/janitorr`         | ✅      |
| [Wizarr][wizarr]           | Self-service Jellyfin invite/onboarding portal      | ✅ active (v2026.4.0)       | `ghcr.io/wizarrrr/wizarr`         | ✅      |
| [Unpackerr][unpackerr]     | Extracts RAR'd releases so imports don't stall      | ✅ mature (v0.15.2)         | `ghcr.io/unpackerr/unpackerr`     | ✅      |
| [Decluttarr][decluttarr]   | Lean queue cleaner (stalled/failed/orphans)         | ✅ active (v2.1.0)          | `ghcr.io/manimatter/decluttarr`   | 🤷     |
| [Maintainerr][maintainerr] | Rule-based collections + "leaving soon" cleanup     | ✅ active (v3.16.0)         | `ghcr.io/jorenn92/maintainerr`    | 🤷     |
| [Readarr][readarr]         | Books/ebooks/audiobooks *arr                        | 💀 retired, archived 2025  | `lscr.io/linuxserver/readarr`     | 📝     |
| [Huntarr][huntarr]         | Hunts missing items + upgrades, feeds the *arrs     | ☠️ repo deleted (security) | *(gone — forks only)*             | 📝     |
| [Autobrr][autobrr]         | IRC-announce torrent grabbing (private trackers)    | ✅ active (v1.81.0)         | `ghcr.io/autobrr/autobrr`         | ⛔     |
| [Configarr][configarr]     | Config-as-code TRaSH profile/format sync            | ✅ active (v1.28.0)         | `ghcr.io/raydak-labs/configarr`   | ⛔     |
| [Profilarr][profilarr]     | GUI + curated DB for TRaSH profile/format sync      | ✅ active (v2.0.9)          | `ghcr.io/dictionarry-hub/profilarr` | ⛔   |
| [Lidarr][lidarr]           | Music *arr                                          | ✅ active (v3.1.0)          | `lscr.io/linuxserver/lidarr`      | ⛔     |
| [Whisparr][whisparr]       | Adult *arr (v3 "Eros")                              | ✅ active (v2.2.0 / v3)     | `ghcr.io/hotio/whisparr`          | ⛔     |

[suggestarr]: https://github.com/giuseppe99barchetta/SuggestArr
[cleanuparr]: https://github.com/Cleanuparr/Cleanuparr
[janitorr]: https://github.com/Schaka/janitorr
[wizarr]: https://github.com/wizarrrr/wizarr
[unpackerr]: https://github.com/Unpackerr/unpackerr
[decluttarr]: https://github.com/ManiMatter/decluttarr
[maintainerr]: https://github.com/Maintainerr/Maintainerr
[readarr]: https://github.com/Readarr/Readarr
[huntarr]: https://github.com/rfsbraz/huntarr-security-review
[autobrr]: https://github.com/autobrr/autobrr
[configarr]: https://github.com/raydak-labs/configarr
[profilarr]: https://github.com/Dictionarry-Hub/profilarr
[lidarr]: https://github.com/Lidarr/Lidarr
[whisparr]: https://github.com/Whisparr/Whisparr

## Three gotchas worth remembering

1. **Readarr's retirement is real and dated 2025-06-27** (not "March"). Don't stand up a fresh instance —
   the metadata backend is gone. `rreading-glasses` only keeps an *existing* Readarr limping.
2. **Huntarr is a security story, not a recommendation.** Original `plexguide/Huntarr` was pulled after
   [a public security review][huntarr] found unauthenticated endpoints leaking *arr API keys and TOTP
   secrets. Even setting that aside, it hammers indexers by design — the opposite of low-maintenance behind
   Prowlarr + FlareSolverr.
3. **Janitorr beats Maintainerr *for this stack*.** Both do Jellyfin now, but Maintainerr's watch-stats
   integration is Streamystats-only — it won't read Jellystat, so it'd mean running a second stats service.
   Janitorr is Jellyfin-first and reads the Jellystat that's already here.

## Blog-post shortlist

Ranked by how well they'd land given the existing series:

1. **SuggestArr** — the philosophy as a container; plugs straight into Seerr + Jellyfin.
2. **The Huntarr cautionary tale** — "don't `docker run` random *arr tools."
3. **Cleanuparr** (+ a Decluttarr aside) — the "keep the download queue clean" post.
4. **Janitorr** — "your terabytes are not infinite" cleanup post.
5. **Wizarr** — onboarding family onto Jellyfin without handing out passwords.
