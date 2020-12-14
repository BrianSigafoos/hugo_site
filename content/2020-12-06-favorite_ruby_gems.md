---
date: 2020-12-06T18:54:19-05:00
slug: ruby-gems
title: Favorite Ruby gems
summary: A list of my favorite Ruby gems, mostly for Rails projects.
---

1. [flipper](https://github.com/jnunemaker/flipper) - release new features behind a feature flag
1. [sidekiq](https://github.com/mperham/sidekiq) + [sidekiq-cron](https://github.com/ondrejbartas/sidekiq-cron) - async jobs + scheduled jobs
1. [turbolinks](https://github.com/turbolinks/turbolinks) + [StimulusJS](https://github.com/stimulusjs/stimulus) (JS) + [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) (CSS) - better than a JS framework like React for smaller teams, with rapid iteration and a snappy-enough web app.
1. [rubocop](https://github.com/rubocop-hq/rubocop) + [rubocop-performance](https://github.com/rubocop-hq/rubocop-performance) + [rubocop-rails](https://github.com/rubocop-hq/rubocop-rails) - lint everything! Set `NewCops: enable`. Use auto-correct for quick formatting in a VS Code task + keyboard shortcut `"command": "bundle exec rubocop -A ${relativeFile}"`
1. [brakeman](https://github.com/presidentbeef/brakeman) + [bundler-audit](https://github.com/rubysec/bundler-audit) + [ruby_audit](https://github.com/civisanalytics/ruby_audit) - CI audit tools to create a CI audit/scan job that scans your code for vulnerabilities
1. [blazer](blazer) - use SQL to make dashboard and event alerts, instead of building internal dashboards.
1. [annotate](https://github.com/ctran/annotate_models) - annotate Rails models with db schema info
1. [stripe](https://github.com/stripe/stripe-ruby) + [money-rails](https://github.com/RubyMoney/money-rails) / [money](https://github.com/Rubymoney/money) - for payments
1. [premailer](https://github.com/premailer/premailer/) - inline CSS for mailers
1. [rack-attack](https://github.com/rack/rack-attack) - middleware for throttling and blocking
1. [better_errors](https://github.com/BetterErrors/better_errors) - better debugging
1. [sitemap_generator](https://github.com/kjvarga/sitemap_generator) - generate sitemaps for search engines
1. [attr_encrypted](https://github.com/attr-encrypted/attr_encrypted) - attr_accessors that transparently encrypt and decrypt attributes
1. [geocoder](https://github.com/alexreisner/geocoder) - geocode / lookup location of visitors using various API's like `ipstack`
1. [pagy](https://github.com/ddnexus/pagy) - pagination
1. [vcr](https://github.com/vcr/vcr) - record and replay interactions with external API's, like Stripe, in your test suite
1. [faker](https://github.com/faker-ruby/faker) - generate fake data for tests
1. [i18n-tasks](https://github.com/glebm/i18n-tasks) - autoformat and prune i18n translations
1. [devise](https://github.com/heartcombo/devise) + [auth_trail](https://github.com/ankane/authtrail) + [recaptcha](https://github.com/ambethia/recaptcha) - authentication + (suspicious) login tracking + block bots using recaptcha
1. [pundit](https://github.com/varvet/pundit) or [cancancan](https://github.com/cancancommunity/cancancan) - authorization
1. [pg](https://github.com/ged/ruby-pg) + [pghero](https://github.com/ankane/pghero) + [activerecord-import](https://github.com/zdennis/activerecord-import) - PosgreSQL + performance dashboard + bulk insert
