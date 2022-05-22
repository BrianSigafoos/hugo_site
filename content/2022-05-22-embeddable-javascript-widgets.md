---
date: 2022-05-22T11:23:59-05:00
slug: javascript-widgets
title: Embeddable Javascript widgets in Rails
summary: Create a simple embeddable item, following the pattern of Github gist embedding.
draft: true
---


### Github gists example

Github gists are great and easy to share. Simply paste their embed code onto any page.

```html
<!-- Embed code -->
<script src="https://gist.github.com/BrianSigafoos/f0fe5e6417b0acf70ffe1bc6b6498796.js"></script>
```

Response from that script simply does 2 things using `document.write()`:
1. Add a stylesheet
2. Add the HTML tags to render the gist content.

```js
// Endpoint Response to .js code above
document.write('<link rel="stylesheet" href="https://github.githubassets.com/assets/gist-embed-5687a589e344.css" />')
document.write('<div id=\"gist74791356\" class=\"gist\">\n <div class=\"gist-file\" translate=\"no\">...<\/div><\/div><\/ div>\n')
```

### Recreating it in Rails

The code to embed the widget is simple:

```html
<div id="widget-wrapper">
  <script src="http://0.0.0.0:3000/widgets/RKdYbCv.js"></script>
</div>
```

And here is a widget rendered:
<div id="widget-wrapper">
  <script src="http://0.0.0.0:3000/widgets/RKdYbCv.js"></script>
</div>
