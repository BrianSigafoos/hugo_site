---
date: 2021-08-15T12:03:13-05:00
slug: prevent-pushing-to-main-branch
title: Prevent pushing to main branch
summary: Use a .git hooks script to prevent accidentally pushing to main branch
collection_swe_toolbox: true
---

## Oops, I just pushed to main!

Pushing to `main` branch when you meant to push to a new feature branch is embarrassing and annoying.

Github has a great per repo setting called "Branch protection rules" that can prevent your team from accidentally pushing to `main` (or `master`) branch. And also ensure that status checks like tests and linters all pass.

If you don't have this set. Or if you're an admin that's allowed to override failed checks, nothing prevents you from pushing to main.

## Git hooks to the rescue

- Copy and paste this into your shell in your local repo directory:

```shell
cat << 'DOC' > .git/hooks/pre-push
#!/bin/bash

protected_branch='main'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ $protected_branch = $current_branch ]
then
    read -p "You're about to push to $protected_branch, is that what you intended? [y|n] " -n 1 -r < /dev/tty
    echo
    if echo $REPLY | grep -E '^[Yy]$' > /dev/null
    then
        exit 0 # push will execute
    fi
    exit 1 # push will not execute
else
    exit 0 # push will execute
fi
DOC

chmod +x .git/hooks/pre-push
```
