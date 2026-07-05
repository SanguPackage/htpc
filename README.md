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
