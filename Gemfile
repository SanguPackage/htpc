source "https://rubygems.org"
ruby RUBY_VERSION

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
gem "jekyll", "~> 4.3"

# Windows file-watching for `jekyll serve --livereload`; 0.2+ builds on Ruby 3.x.
gem "wdm", "~> 0.2", platforms: [:mingw, :mswin, :x64_mingw]

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins

# If you have any plugins, put them here!
group :jekyll_plugins do
   gem "kramdown-parser-gfm"
   gem "jekyll-feed", "~> 0.6"
   gem "jekyll-seo-tag", "~> 2.8"
   gem "jekyll-sitemap", "~> 1.4"
   gem "jemoji", "~> 0.13.0"
   gem "jekyll-gist", "~> 1.5.0"
   gem "jekyll-avatar", "~> 0.8.0"
   gem "jekyll-redirect-from"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# win32/registry.rb (loaded on Windows) requires fiddle, which leaves the
# default gems in Ruby 4.0 — bundle it explicitly to silence the warning.
# Pinned to the version shipped with Ruby 3.4 so bundler reuses the pre-built
# default gem instead of compiling a newer one (needs libffi, fails here).
gem "fiddle", "1.1.6", platforms: [:mingw, :mswin, :x64_mingw]

