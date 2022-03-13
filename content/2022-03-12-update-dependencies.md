---
date: 2022-03-12T07:45:59-05:00
slug: dependencies
title: Automate dependency updates
summary: Use automated tools like Github's Dependabot and Actions to automate dependency updates
---

Once code is well tested and [CI/CD is set up](rails-on-kubernetes), we can be confident in continuously merging and deploying dependency upgrades.

What's well tested? A good mix of mostly small, fast tests and some slower integration and system tests.

Previously, we'd have to run a script for dependency updates and open a pull request (PR). Often, this pull request would contain many dependency updates.
Now, with [Github's Dependabot](https://github.com/dependabot), individual PR's are constantly opened for individual dependency updates. The CI test suite tests that change in isolation and if the tests are green, we can merge and deploy with confidence.

Constantly deploying a small change, or small batch of changes, is much less risky than larger batch sizes.

What about NodeJS sub-dependencies and some Ruby sub-dependencies that Dependabot seems to ignore? I've found it useful to run a script 1x weekly to sweep up all these updates into a single PR with a semi-automated script. The script updates dependencies and opens a PR with the changes. Here are the key parts:

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

Per repository, I find it easiest to have 1 commonly named yarn command like `yarn update` or `yarn run update`, handle calling the dependency update script itself for that repo.

Here's how that is set up in the `package.json` file, under `"scripts": { "update": ...`:

```json
// package.json
{
  "devDependencies": {
    // ...
  },
  "scripts": {
    "update": "scripts/update_dependencies.sh",
    "latest": "git checkout main; git pull origin main; git submodule foreach --recursive git checkout main; git submodule foreach --recursive git pull origin main",
    "build": "hugo server --gc",
    "debug": "NODE_ENV=production hugo server --gc",
    "fix": "yarn run fix:css; yarn run fix:md",
    "fix:css": "yarn prettier --write 'assets/**/*.css'",
    "fix:md": "yarn prettier --write './*.md'; yarn prettier --write './**/*.md'"
  }
}
```

If you prefer VS Code "Run Tasks" via the Command Palette, you can also add a task:

```json
// .vscode/tasks.json
{
  "label": "yarn update - update dependencies",
  "type": "shell",
  "command": "yarn update",
  // "command":  "scripts/update_dependencies.sh",
  "problemMatcher": [],
  "presentation": {
    "reveal": "always",
    "panel": "dedicated"
  }
}
```
