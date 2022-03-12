---
date: 2022-03-12T07:45:59-05:00
slug: dependencies
title: Automate dependency updates
summary: Use tools like Github's dependabot and actions to automate dependency updates
---

Once code is well tested and [CI/CD is set up](rails-on-kubernetes), we can be confident in continuously merging and deploying dependency upgrades.

What's well tested? A good mix of mostly small, fast tests and som slower integration and system tests.

Previously, we'd have to run a script for dependency updates and open a PR.
Now, with [Github's Dependabot](https://github.com/dependabot), individual PR's are constantly opened for individual dependency updates. The CI test suite tests that change in isolation and if the tests are green, we can merge and deploy with confidence.

What about yarn sub-dependencies? I've found it useful to run a script 1x weekly to sweep up all these updates into a single PR in the semi-automated script, the key parts are:

```bash
brew bundle
bundle update
yarn upgrade --latest
```

Here's the script:

```bash
#!/bin/bash
set -e

PREVIOUS_BRANCH=$(git branch --show-current)
NEW_BRANCH=update/$(date +%Y%m%d)
READABLE_DATE=$(date +%Y-%m-%d)

# Stash work, checkout main, and pull latest
echo "Stashing work, checking out main, pulling latest..."
git stash push
git checkout main
git pull --rebase --autostash

# New branch
git checkout -b $NEW_BRANCH

echo "Updating dependencies"
brew bundle
bundle update
yarn upgrade --latest

echo "Committing changes"
git commit -a -m "Update dependencies $READABLE_DATE" --no-verify
git push

echo "Creating PR using GitHub CLI"
gh pr create --fill

# Back to previous branch
echo "Checking out previous branch"
git checkout $PREVIOUS_BRANCH
echo "If needed, run: git stash pop (gstp)"
```
