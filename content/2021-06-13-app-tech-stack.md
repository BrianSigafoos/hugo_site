---
date: 2021-06-13T12:06:27-04:00
slug: app-tech-stack-2021
title: A modern app tech stack, built for speed
summary: Small teams can iterate more quickly using Rails with ViewComponent + Tailwind CSS + Hotwire. Build faster with no custom CSS and limited JS.
collection_swe_toolbox: true
---

## A simpler stack, for 2021

The choice of technology stack has a big impact on your team's ability to build a product quickly. This is especially true for small teams.

By choosing a stack with a strong principle of "convention over configuration", like Ruby on Rails, you can eliminate unimportant choices. This lets you focus as much energy as possible on building what's core to your business.

In the past, to have a snappy web app you needed to load a lot of Javascript up front, usually React, and then send JSON from the server. This split logic and coding proficiency in two, between the backend and the frontend.

Now, thanks to technologies like Hotwire's Turbo Drive (previously Turbolinks) plus Turbo Frames and Turbo Stream you can write your business logic once and send HTML from the server. This makes development simpler and more productive since almost no Javascript is needed.

Similarly to Javascript, CSS in the past decade has required too much expertise and writing of custom code.

Now, thanks to Tailwind CSS, a utility-first CSS framework, you can "rapidly build modern websites without ever leaving your HTML".

## Development principles

- Write HTML in [Rails](https://rubyonrails.org/) ERB templates
  - Send all HTML from the server, with [Turbo](https://turbo.hotwire.dev/) in the frontend automatically handling navigation, form submission, and more
  - Instead of partials, write reusable HTML components using [ViewComponent](https://viewcomponent.org/)
- Write NO custom CSS. Instead use [Tailwind CSS](https://tailwindcss.com/) classes directly in ViewComponent components
- Write as little Javascript as possible. Use [Stimulus](https://stimulus.hotwire.dev/) to add "sprinkles of JS"
  - Make any JS generalizable, for example: AutosubmitController and not ProductSearchFormController

## More principles for sustained team velocity

- Write comprehensive unit tests
- Write policy tests around authorization levels, for example members vs owners of an account
- Write happy-path system tests that give you confidence your key customer flows always work
- Automate [linting and autocorrect everything]({{< ref "2021-05-30-auto-format-and-lint-everything.md" >}}) possible
- Automate dependency upgrades by using [Dependabot](https://dependabot.com/)
- Add synthetic monitoring using [Uptime](https://support.uptime.com/hc/en-us/articles/360000984785-Synthetic-Monitoring-With-the-Uptime-com-Transaction-Check)

## Modern app tech stack

- [Ruby on Rails 6.1+](https://rubyonrails.org/)
- [Webpacker 6+](https://github.com/rails/webpacker) with Webpack 5+ - automatic code splitting
- [ViewComponent](https://viewcomponent.org/) - testable, re-usable components
- [Tailwind CSS](https://tailwindcss.com/) - utility CSS classes, auto-purged
- [Hotwire](https://hotwire.dev/)
  - Turbo - snappy HTML without any JS
  - Stimulus - "sprinkles of JS"
- [PostgreSQL](https://guides.rubyonrails.org/active_record_postgresql.html) - database
- [Sidekiq](https://github.com/mperham/sidekiq) - background jobs
- [Stripe Checkout](https://stripe.com/en-us/payments/checkout) + Stripe Billing - payments and subscription management, hosted by Stripe
- [More favorite Ruby gems...]({{< ref "2020-12-06-favorite-ruby-gems.md" >}})

## Paid resources

- [TailwindUI](https://tailwindui.com/)
- [Jumpstart Pro](https://jumpstartrails.com/)
