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

# Install npm-check-updates to update package.json versions
npm install -g npm-check-updates
# Update package.json with latest versions
ncu -u
# Delete lockfile
rm package-lock.json
rm -rf node_modules
# Install updates from updated lockfile
npm install

# npm run latest
# npm run latest is a wrapper for:
git submodule foreach --recursive git checkout main
git submodule foreach --recursive git pull origin main

echo "Committing changes"
git commit -a -m "Update dependencies $READABLE_DATE" --no-verify
git push

echo "Creating PR using GitHub CLI"
gh pr create --fill

# Back to previous branch
echo "Checking out previous branch"
git checkout $PREVIOUS_BRANCH
echo "If needed, run: git stash pop (gstp)"
