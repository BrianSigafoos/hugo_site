---
date: 2022-07-22T13:28:51-04:00
slug: dark-mode-css-variables
title: Dark mode with CSS variables and Stimulus
summary: How to add Dark Mode using CSS variables and Stimulus, plus a color palette picker
---

## Live Demo

Click the buttons below for a live demo of toggling dark mode and changing the primary color of this site.

<div class="space-y-6 sm:space-y-0 sm:flex sm:space-x-6 text-faint">
  <button type="button" data-action="color-scheme#toggleScheme"
    aria-label="Toggle dark mode" title="Toggle dark mode"
    class="py-4 px-6 cursor-pointer font-bold font-mono text-bright border border-solid border-gray bg-gray no-underline flex items-center truncate">
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24"
      stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
    <span class="ml-3 truncate">
      Toggle dark mode
    </span>
  </button>
  <button type="button" data-action="color-scheme#toggleColor"
    aria-label="Change primary color" title="Change primary color"
    class="py-4 px-6 cursor-pointer font-bold font-mono text-on-color-primary bg-primary no-underline flex items-center truncate">
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24"
      stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
    <span class="ml-3 truncate">
      Change primary color
    </span>
  </button>
</div>

## The Power of CSS Variables

By using CSS variables we can write CSS/SCSS that references variables instead of hardcoded values.

For example, instead of specifying a value for every color, background-color, border-color, etc you can simply replace the values with `var(--<VARIABLE_NAME>)` syntax.

Before using hardcoded values:

```scss
.color-primary {
  color: #17bf63;
}

.text-bright {
  color: #1a202c;
}

.text-color {
  color: #4a5568;
}

.text-muted {
  color: #718096;
}

.text-faint {
  color: #a0aec0;
}

.bg-bright {
  background-color: #fff;
}

.bg-gray {
  background-color: #f7fafc;
}

.border-gray {
  border-color: #edf2f7;
}
```

After using CSS variables:

```scss
.color-primary {
  color: var(--color-primary);
}

.text-bright {
  color: var(--text-bright);
}

.text-color {
  color: var(--text-color);
}

.text-muted {
  color: var(--text-muted);
}

.bg-bright {
  background-color: var(--bg-bright);
}

.bg-gray {
  background-color: var(--bg-gray);
}

.border-gray {
  border-color: var(--border-gray);
}
```

## Use :root in CSS to set up the toggle-ability

Then simply add CSS for `:root { ... }` as a base for color and dark mode. The below code sets the default dark mode to "light" and then only applies "dark" if the viewer's browser/OS "prefers-color-scheme" is "dark".

The `body` tags allow using JS to add a user to set their preference to override the defaults.

```scss
// Default colors
:root {
  --color-primary: #17bf63; // rgb(23, 191, 99, 1)

  // Light is default
  --bg-bright: #fff; // bg-white
  --bg-gray: #f7fafc; // gray-100
  --border-gray: #edf2f7; // gray-200
  --text-bright: #1a202c; // gray-900
  --text-color: #4a5568; // gray-700
  --text-muted: #718096; // gray-600 -- Same for light/dark
  --text-faint: #a0aec0; // gray-500

  // Dark if preferred at OS level by user
  @media (prefers-color-scheme: dark) {
    --bg-bright: #1a202c; // gray-900
    --bg-gray: #131720; // bg-gray-930
    --border-gray: #202837; // gray-870
    --text-bright: #edf2f7; // gray-200
    --text-color: #a0aec0; // gray-500
    // --text-muted: #718096; // gray-600
    --text-faint: #4a5568; // gray-700
  }
}

// If user toggles to "light" mode
body[data-color-scheme='light'] {
  --bg-bright: #fff; // bg-white
  --bg-gray: #f7fafc; // gray-100
  --border-gray: #edf2f7; // gray-200
  --text-bright: #1a202c; // gray-900
  --text-color: #4a5568; // gray-700
  // --text-muted: #718096; // gray-600
  --text-faint: #a0aec0; // gray-500
}

// If user toggles to "dark" mode
body[data-color-scheme='dark'] {
  --bg-bright: #1a202c; // gray-900
  --bg-gray: #131720; // bg-gray-930
  --border-gray: #202837; // gray-870
  --text-bright: #edf2f7; // gray-200
  --text-color: #a0aec0; // gray-500
  // --text-muted: #718096; // gray-600
  --text-faint: #4a5568; // gray-700
}

// If user toggles the color to ...
body[data-color-primary='teal'] {
  --color-primary: #00bcd4; // rgb(0, 187, 211)
}

body[data-color-primary='pink'] {
  --color-primary: #ec407a; // rgb(236, 64, 122)
}
```

## Add Stimulus to make it interactive

To allow the user to pick dark mode or choose a color, we'll add [Stimulus](https://stimulus.hotwired.dev/).

To set up Stimulus you can follow their docs, or see [the code powering this blog](https://github.com/BrianSigafoos/hugo_site/pull/72).

First, add Stimulus `@hotwired/stimulus` to your package.json and create an entrypoint / main JS file similar to this:

```js
import { Application } from '@hotwired/stimulus'

import ColorSchemeController from './controllers/color_scheme_controller'

window.Stimulus = Application.start()
Stimulus.register('color-scheme', ColorSchemeController)
```

Then add to the HTML `body` tag in your app some code to tell Stimulus to interact with this `color-scheme` controller:

```html
<body data-controller="color-scheme" class="...">
```

Then add a Stimulus controller similar to this one:

```js
// ./controllers/color_scheme_controller.js
import { Controller } from '@hotwired/stimulus'
import DevLog from './shared/DevLog'

const COLORS = ['green', 'teal', 'pink']
const DARK_SCHEME = 'dark'
const LIGHT_SCHEME = 'light'
const SCHEME_KEY = 'appScheme'
const COLOR_KEY = 'appColor'

export default class extends Controller {
  // Read from the getter and write that value to the setter.
  initialize() {
    this.appScheme = this.currentScheme
    this.appColor = this.currentColor
  }

  // Unlike initialize, calling toggle persists the change in localStorage
  toggleScheme(e) {
    e.preventDefault()

    let scheme = this.currentScheme === DARK_SCHEME ? LIGHT_SCHEME : DARK_SCHEME

    this.appScheme = scheme
    this.storeScheme = scheme
  }

  toggleColor(e) {
    e.preventDefault()

    let colorIndex = COLORS.findIndex((k) => k === this.currentColor)
    let color = COLORS[colorIndex + 1] || COLORS[0]

    this.appColor = color
    this.storeColor = color
  }

  // Private

  /* eslint-disable class-methods-use-this */
  set appScheme(val) {
    document.body.dataset.colorScheme = val
  }

  set appColor(val) {
    document.body.dataset.colorPrimary = val
  }

  set storeScheme(val) {
    localStorage.setItem(SCHEME_KEY, val)
  }

  set storeColor(val) {
    localStorage.setItem(COLOR_KEY, val)
  }

  // Check localStorage first for preference, then check OS.
  get currentScheme() {
    const fromLocal = localStorage.getItem(SCHEME_KEY)
    if (fromLocal) {
      DevLog(['Color scheme found in localStorage', fromLocal])
      return fromLocal
    }

    const darkFromOS = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (darkFromOS) {
      DevLog(['Color scheme found at OS level as dark'])
      return DARK_SCHEME
    }

    // Default
    return LIGHT_SCHEME
  }

  // Check localStorage first for preference.
  get currentColor() {
    const fromLocal = localStorage.getItem(COLOR_KEY)
    if (fromLocal) {
      DevLog(['Color primary found in localStorage', fromLocal])
      return fromLocal
    }

    return COLORS[0]
  }
  /* eslint-enable class-methods-use-this */
}
```

Finally add some HTML buttons to allow toggling:

```html
  <button type="button" data-action="color-scheme#toggleScheme">
    Toggle dark mode
  </button>

  <button type="button" data-action="color-scheme#toggleColor">
    Change primary color
  </button>
</div>
```

That's it!  Try it out here: [Live Demo](#live-demo)
