HTPC
====

- [HTPC @ Sangu](https://sangu.be/htpc): Deployed website
- [HTPC docker-compose](https://github.com/Laoujin/Htpc)
- [HTPC Powerpoint](https://github.com/Laoujin/Htpc-Presentation)


-- how to fucking run ffmpeg probe with docker...
docker run --rm -v "$(pwd)":/workdir jrottenberg/ffmpeg ffprobe -v quiet -print_format json -show_format -show_streams "/workdir/Murderbot - S01E05 - Rogue War Tracker Infinite WEBDL-720p.mkv" > "Murderbot-S01E05.mkv.json"
docker run --rm -v "$(pwd)":/workdir linuxserver/ffmpeg ffprobe -hide_banner -loglevel fatal -show_error -show_format -show_streams -show_programs -show_chapters -show_private_data -print_format json
See: https://gist.github.com/nrk/2286511
docs: https://ffmpeg.org/ffprobe.html


It crashes on SSA subtitles
--> Needs transcoding, eats too much memory for WebOS
https://www.reddit.com/r/jellyfin/comments/143y16e/webos_app_crashing_when_using_ass_subtitles/



This was fixed at some point but is a regression
Should upgrade to: jellyfin-ffmpeg7 version 7.0.2-8-bookworm

But I cannot upgrade Jellyfin anymore can I?
10.10.5 is shipped with the ffmpeg that has this fixed.
--> https://github.com/jellyfin/jellyfin-androidtv/issues/4304

Transcode automatically?
https://forum.jellyfin.org/t-ass-subtitles-not-supported


--> can we combine multiple docker-compose files
--> with the version available on synology?


################
  # TRANSMISSION #
  ################
  #transmission:
  #  image: linuxserver/transmission:version-3.00-r8
  #  container_name: htpc-transmission
  #  environment:
  #    - PUID=${PUID}
  #    - PGID=${PGID}
  #    - TZ=${TZ}
  #    - TRANSMISSION_WEB_HOME=/transmission-web-control/
  #    - USER=${TRANSMISSION_USER}
  #    - PASS=${TRANSMISSION_PASS}
  #  volumes:
  #    - ${CONFIG_PATH}/transmission:/config
  #    - ${DOWNLOAD_PATH}:/downloads
  #    - ${BLACKHOLE_PATH}:/watch
  #  ports:
  #    - ${TRANSMISSION_PORT}:9091
  #    - 51413:51413
  #    - 51413:51413/udp
  #  expose:
  #    - ${TRANSMISSION_PORT}
  #    - 51413
  #    - 51413/udp
  #  restart: ${RESTART_POLICY}
  #  labels:
  #    - 'com.centurylinklabs.watchtower.enable=true'


  transmission:
    image: haugene/transmission-openvpn
    container_name: htpc-transmission
    cap_add:
        - NET_ADMIN
    volumes:
        # - '/your/storage/path/:/data'
        - ${DOWNLOAD_PATH}:/downloads
        - ${BLACKHOLE_PATH}:/watch
        - ${CONFIG_PATH}/transmission-vpn:/config
    environment:
        - PUID=${PUID}
        - PGID=${PGID}
        - TZ=${TZ}
        - TRANSMISSION_WEB_UI=transmission-web-control
        - OPENVPN_PROVIDER=NORDVPN
        - OPENVPN_CONFIG=france
        - OPENVPN_USERNAME=
        - OPENVPN_PASSWORD=
        # - NORDVPN_CATEGORY=
        # https://api.nordvpn.com/v1/servers/countries
        # - NORDVPN_COUNTRY=US
        - NORDVPN_PROTOCOL=tcp
        - LOCAL_NETWORK=192.168.0.0/24
    logging:
        driver: json-file
        options:
            max-size: 10m
    ports:
        - ${TRANSMISSION_PORT}:9091
    restart: ${RESTART_POLICY}





# Deployment

```ps1
$env:JEKYLL_ENV = "production"
bundle exec jekyll build
$env:JEKYLL_ENV = "development"
```



Frontpage:
--> Need to build the frontpage instead of just a listing of the different articles:
--> Links to the most important articles
--> A "last updated" section?
--> Links to other good resources: TrashGuides, Linuxserver/Hatio, HomeautomationBeginner?, Servarr .. Also see other Htpc readmes for more links
--> Invent new categories & tags: "TV & Chromecast", "Backups", "Container Management", "Indexers", "Downloading Stuff" ... I dunno...

GETTING STARTED:  
New and don't know how to go about setting this up?
A full setup takes about 3 hours, or you could go with a pre-configured setup (separate branch, danger notice for API keys being online, )
Computer savy users 3 hours, other users could take longer (ex: while installing Docker you might run into some weird issues that need googling)

--> TODO: Confusion between 6969 and 9696 ports?
--> TODO: env-example should have default Heimdall port configured

Blocks/Tiles with steps to take:  
- Pre-Requisites: Install Docker & Clone Docker-Compose Repo
- Choose branch, configure .env, docker-compose up -d
- Initial configuration setup
- Additional configuration:
    - Profiles & Quality
    - Notifications & Lists







Article on Bazarr?
--> Which Subtitles stuff is free?
--> https://github.com/YunoHost-Apps/bazarr_ynh


TODO: Also need to connect a keyboard/mouse to TV now I guess


Docker-Compose stuff?
https://github.com/ajnart/mynetflix


Separate post:
Jellyfin vs Chromecast:
https://tdarr.io/
--> Handbrake & FFPmeg --> article on changing all avis so that they can be played by Jellyfin...



Radarr Corrupt DB?
--> Do not put in Dropbox, GDrive, etc
https://wiki.servarr.com/useful-tools#recovering-a-corrupt-db



Extend Radarr/Sonarr?
https://github.com/recyclarr/recyclarr
https://github.com/RandomNinjaAtk/docker-radarr-extended
--> Follow the TraSh guides automatically?




Also need an article on Sonarr/Radarr: profiles & quality
--> What does each format mean exactly? What's the difference between 1080 vs 720, or Remux? etc
--> See docker-compose repo for piture & trash guides url
