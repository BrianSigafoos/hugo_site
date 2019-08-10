# Hugo site for briansigafoos.github.io

## Workflow

- Add posts to `content/` using `hugo new <post-name>`
- Run `yarn build` locally
- Run `yarn fix` to run linters with autofix
- Publish by running `yarn deploy`

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

- Setting up [GitHub pages instructions](https://gohugo.io/hosting-and-deployment/hosting-on-github/#readout)

```shell
git submodule add -b master git@github.com:BrianSigafoos/briansigafoos.github.io.git public
```
