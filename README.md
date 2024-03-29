# Hugo site for briansigafoos.com

## Workflow

- Run `yarn update` to ensure everything is up to date, see script/update_dependencies.sh

  - `brew bundle`
  - `yarn upgrade --latest`
  - `yarn latest`
    - `git submodule foreach --recursive git checkout main`
    - `git submodule foreach --recursive git pull origin main`

- Merge opened PR for dependencies
- Run `hugo new content/<NAME>.md` to add new posts to `content/...`
- Run `yarn build` to view site locally at http://localhost:1313
- Run `yarn fix` to run linters with autocorrect
- Create a PR with changes
- Deploy will happen via a Github Action automatically once merged

## Debugging

```bash
# Print out all the values under .Site or .Permalink
{{ printf "%#v" $.Site }}
{{ printf "%#v" .Permalink }}

# Print a list of all the variables scoped to the current context
# ".", aka "the dot"
{{ printf "%#v" . }}
```

## Setup

- `brew install hugo`

- Setting up [GitHub pages instructions](https://gohugo.io/hosting-and-deployment/hosting-on-github/#readout)

```shell
# https://stackoverflow.com/questions/47403358/fatal-in-unpopulated-submodule
git rm --cached . -rf

git add --all

# After a git clone, remove the public directory locally and then
# re-add the git submodule
rm -rf public

# https://gohugo.io/hosting-and-deployment/hosting-on-github/#step-by-step-instructions
git submodule add -b main git@github.com:BrianSigafoos/briansigafoos.github.io.git public

#
# Working with git submodules
#
# To get latest from the git submodule
git submodule update --recursive --remote
# Also
git submodule foreach --recursive git checkout main
git submodule foreach --recursive git pull origin main
```

## Upgrade Hugo

```shell
brew upgrade hugo
```

## Fix public sub repo

- `cd public` into sub repo
- Use git commands to fix, like `git reset HEAD~1`
