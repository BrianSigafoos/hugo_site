---
date: 2022-05-22T11:23:59-05:00
slug: javascript-widgets
title: Embeddable Javascript widgets
summary: How to create a Github gist-like embeddable widget using Rails
---

### Github gists example

Github gists are great and easy to share. Simply paste their embed code onto any page.

```html
<!-- Embed code -->
<script src="https://gist.github.com/BrianSigafoos/f0fe5e6417b0acf70ffe1bc6b6498796.js"></script>
```

The response from that script simply does 2 things using `document.write()`:

1. Add a stylesheet
2. Add the HTML tags to render the gist content.

```js
// Endpoint Response to .js code above
document.write(
  '<link rel="stylesheet" href="https://github.githubassets.com/assets/gist-embed-5687a589e344.css" />'
)
document.write(
  '<div id="gist74791356" class="gist">\n <div class="gist-file" translate="no">...</div></div></ div>\n'
)
```

### Recreating it in Rails

The code to embed the widget is simple:

```html
<div class="demoapp demoapp-widget">
  <script src="http://lvh.me:3000/widgets/mKVEFN.js"></script>
  <p>
    Widget created with
    <a
      target="_blank"
      rel="noopener"
      href="https://github.com/BrianSigafoos/docker-rails-webpacker-app"
      >Docker Rails Demo App</a
    >
    by Brian
  </p>
</div>
```

And here is a widget rendered below.
Note: this only works locally for now [via this repo](https://github.com/BrianSigafoos/docker-rails-webpacker-app).

<div class="demoapp demoapp-widget"><script src="http://lvh.me:3000/widgets/1Y5kZh.js"></script><p>Widget created with <a href="https://github.com/BrianSigafoos/docker-rails-webpacker-app">Docker Rails Demo App</a> by Brian</p></div>

### How it works

- Add a new route `resources :widgets, only: :show`
- Add the new WidgetsController with `skip_before_action :verify_authenticity_token` and `layout false` with a [show.js.erb like this](https://github.com/BrianSigafoos/docker-rails-webpacker-app/blob/main/app/views/widgets/widgets/show.js.erb)
- Add the `rack-cors` gem to allow CORS with a [config/initializers/cors.rb like this](https://github.com/BrianSigafoos/docker-rails-webpacker-app/blob/main/config/initializers/cors.rb)
- Add the widget CSS via a new [widget.scss like this](https://github.com/BrianSigafoos/docker-rails-webpacker-app/blob/main/app/views/widgets/widgets/show.js.erb)
  - You'll want to scope the CSS to only your app `:where(.demoapp) { ... }`, for example
- Add code to generate the copyable widget snippet
- Add code to preview the widget snippet in your app, without any CSS on that page
- Use something like Hugo (that powers this blog) to locally create a page and then embed the snippet. This will confirm CORS is set up correctly as the widget is called from the local Hugo-served page and to the local Rails endpoint.
