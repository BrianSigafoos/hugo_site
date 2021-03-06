# Hugo site for briansigafoos.com

## Workflow

- Run `hugo new <post-name>` to add new posts to `content\...`
- Run `yarn build` to view site locally at http://localhost:1313
- Run `yarn fix` to run linters with autocorrect
- Run `yarn deploy` to publish changes to [github.com/BrianSigafoos/briansigafoos.github.io](https://github.com/BrianSigafoos/briansigafoos.github.io) which powers [briansigafoos.com](https://briansigafoos.com)
- Create a PR with those changes for this repo

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

# https://gohugo.io/hosting-and-deployment/hosting-on-github/#step-by-step-instructions
git submodule add -b master git@github.com:BrianSigafoos/briansigafoos.github.io.git public
```

## Upgrade Hugo

```shell
brew upgrade hugo
```

## Fix public sub repo

- `cd public` into sub repo
- Use git commands to fix, like `git reset HEAD~1`
