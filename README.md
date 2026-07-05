HTPC
====

- [HTPC @ Sangu](https://sangu.be/htpc): Deployed website
- [HTPC docker-compose](https://github.com/Laoujin/Htpc)
- [HTPC Powerpoint](https://github.com/Laoujin/Htpc-Presentation)


# Deployment

```ps1
$env:JEKYLL_ENV = "production"
bundle exec jekyll build
$env:JEKYLL_ENV = "development"
```


--> Links to other good resources: TrashGuides, Linuxserver/Hatio, HomeautomationBeginner?, Servarr .. Also see other Htpc readmes for more links


Blocks/Tiles with steps to take:  
- Pre-Requisites: Install Docker & Clone Docker-Compose Repo
- Choose branch, configure .env, docker-compose up -d
- Initial configuration setup
- Additional configuration:
    - Profiles & Quality
    - Notifications & Lists


Radarr Corrupt DB?
--> Do not put in Dropbox, GDrive, etc
https://wiki.servarr.com/useful-tools#recovering-a-corrupt-db
