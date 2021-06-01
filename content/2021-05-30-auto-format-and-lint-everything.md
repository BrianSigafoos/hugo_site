---
date: 2021-05-30T09:28:12-04:00
slug: linters
title: Auto-format and lint everything
summary: Build faster with automated formatting, linting, and vulnerability scanning
---

When building software I want to automate everything possible.

Automated code formatting, linting, and vulnerability scanning helps teams I work with write better code, faster.

Critically, these automations make it easier to write, read, and maintain code.

### Overview

1. Add essential linters and auto-formatters for your code
1. Use keybindings in your IDE to auto-format code with a few key strokes
1. Add `lint-staged` to automatically format and lint code before every commit
1. Have CI, Circle CI or Github Actions, run full linters and vulnerability scanners in parallel with your test suite
1. Require Pull Requests have the lint and security scan jobs pass, in order to be merged

### Add essential linters and auto-formatters

Good linters and auto-formatters have sane defaults, allow some customization, and integrate with your automated test suite / CI setup.

- [Rubocop](https://rubocop.org) - Ruby
- [ERB Lint](https://github.com/Shopify/erb-lint) - Rails .html.erb templates
- [ESLint](https://eslint.org) - Javascript
- [Prettier](https://prettier.io) - Javascript, Markdown, JSON, CSS
- [Stylelint](https://stylelint.io) - CSS, including SCSS, Sass, etc
- [i18n-tasks](https://github.com/glebm/i18n-tasks) - For I18n (internationalization) files
- [lint-staged](https://github.com/okonet/lint-staged) - Run linters against staged git files
- [gofmt](https://golang.org/cmd/gofmt/) - Go, built into th language!
- [golangci-lint](https://github.com/golangci/golangci-lint) - Go

#### Rubocop config

In your `.rubocop.yml` setup, enable `NewCops` by default:

```yaml
#`rubocop` to run normally
#`rubocop --auto-gen-config` to update .rubocop_todo.yml
inherit_from: .rubocop_todo.yml

require:
  - rubocop-minitest
  - rubocop-performance
  - rubocop-rails
  - rubocop-rake
  - rubocop-thread_safety

AllCops:
  TargetRubyVersion: 2.7
  TargetRailsVersion: 6.1
  Exclude:
    - 'db/**/*'
    - 'node_modules/**/*'
    - 'vendor/bundle/**/*'
  NewCops: enable

Rails:
  Enabled: true
```

#### Prettier, ESLint, and Stylelint configs

In your `package.json`

```json
{
  // ...
  "eslintConfig": {
    // "env": {...}
    "extends": ["eslint:recommended", "prettier"],
    "parser": "@babel/eslint-parser",
    "rules": {
      "class-methods-use-this": 2,
      "no-console": 2
    },
    "reportUnusedDisableDirectives": true
  },
  "prettier": {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "none"
  },
  "stylelint": {
    "extends": ["stylelint-config-standard", "stylelint-config-prettier"],
    "plugins": ["stylelint-scss"]
  },
  "pre-commit": ["lint-staged"]
}
```

### Use keybindings in your IDE to auto-format code with a few key strokes

For VS Code `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "rubocop auto-correct file",
      "type": "shell",
      "command": "bundle exec rubocop -A ${relativeFile}",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      }
    },
    {
      "label": "erblint auto-correct file",
      "type": "shell",
      "command": "bundle exec erblint -a ${relativeFile}",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      }
    },
    {
      "label": "prettier auto-correct file",
      "type": "shell",
      "command": "yarn prettier --write ${relativeFile}",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      }
    }
  ]
}
```

And your VS Code `keybindings.json` to set up autocorrect from pressing a combination of keys when looking at a file.

```json
[
  {
    "key": "ctrl+cmd+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "rubocop auto-correct file"
  },
  {
    "key": "ctrl+cmd+shift+e",
    "command": "workbench.action.tasks.runTask",
    "args": "erblint auto-correct file"
  },
  {
    "key": "ctrl+cmd+shift+p",
    "command": "workbench.action.tasks.runTask",
    "args": "prettier auto-correct file"
  }
]
```

And in your `package.json` add these `"scripts"`:

```json
{
  // ...
  "scripts": {
    "fix": "yarn css:fix; yarn js:fix; yarn md:fix; yarn json:fix",
    "lint": "yarn css:lint; yarn js:lint; yarn md:lint; yarn json:lint",
    "css:fix": "yarn prettier --write 'app/**/*.scss'; yarn stylelint --fix 'app/**/*.scss'",
    "css:lint": "stylelint 'app/**/*.scss'",
    "erb:fix": "bundle exec erblint -a --lint-all",
    "erb:lint": "bundle exec erblint --lint-all",
    "i18n:fix": "i18n-tasks normalize",
    "i18n:lint": "i18n-tasks health",
    "md:fix": "yarn prettier --write './**/*.md'",
    "md:lint": "yarn prettier --check './**/*.md'",
    "json:fix": "yarn prettier --write '*.json'; yarn prettier --write 'config/**/*.json'",
    "json:lint": "yarn prettier --check '*.json'; yarn prettier --check 'config/**/*.json'",
    "js:fix": "yarn prettier --write './**/*.js'; yarn eslint --fix app",
    "js:lint": "yarn prettier --check './**/*.js'; yarn eslint app",
    "ruby:fix": "bundle exec rubocop -a",
    "ruby:lint": "bundle exec rubocop",
    "eslint": "eslint",
    "prettier": "prettier",
    "lint-staged": "$(yarn bin)/lint-staged"
  }
}
```

### Add lint-staged to automatically format and lint code before every commit

Install with `yarn add -D lint-staged` and add a `lint-staged.config.js` file:

```js
// lint-staged.config.js
module.exports = {
  '(app|config|lib|test)/**/*.rb': (files) =>
    `bundle exec rubocop ${files.join(' ')}`,
  '**/*.html.erb': (files) => `bundle exec erblint ${files.join(' ')}`,
  'config/locales/**/*.yml': () => 'yarn i18n:fix',
  './**/*.md': ['prettier --write'],
  './**/*.js': ['prettier --write', 'eslint --fix'],
  './**/*.scss': ['stylelint --fix', 'prettier --write']
}
```

### Have CI, Circle CI or Github Actions, run full linters and vulnerability scanners in parallel with your test suite

```yaml
# .circleci/config.yml

#
# Jobs have two parts: the execution environment and a set of steps.
jobs:
  setup:
  # Install libraries like gems, packages and cache for next steps in parallel

  test:
  # Run test suite...

  lint:
    # resource_class: ...
    # executor: ...
    steps:
      - prepare-workspace
      - run:
          name: Lint JS
          command: yarn js:lint
      - run:
          name: Lint CSS
          command: yarn css:lint
      - run:
          name: Lint Ruby
          command: bundle exec rubocop
      - run:
          name: Lint Rails erb templates
          command: bundle exec erblint --lint-all
      - run:
          name: Scan for Rails code vulnerabilities
          command: |
            gem install brakeman
            brakeman
      - run:
          name: Scan for bundled Ruby gem vulnerabilities
          command: |
            gem install bundler-audit
            bundle audit check --update
      - run:
          name: Scan for Ruby and RubyGems system vulnerabilities
          command: |
            bundle add ruby_audit --group "test"
            bundle exec ruby-audit check

#
# Workflows are sequences of jobs. Both lint and test will run in parallel once
# setup completes.
workflows:
  build:
    jobs:
      - setup:
      - lint:
          requires:
            - setup
      - test:
          requires:
            - setup
```

### Require Pull Requests have the lint and security scan jobs pass, in order to be merged

Update your GitHub repository Settings for Branches to "Require status checks to pass before merging". Select the check that only passes in the lint job in your CI passes.

This ensures your team writes consistent code, even as the team grows.
