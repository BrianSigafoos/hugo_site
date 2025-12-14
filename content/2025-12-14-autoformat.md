---
date: 2025-12-14T10:00:00-05:00
slug: autoformat
title: Auto-format all changed files with one command, for your AI agent
summary: Stop telling your AI agents how to auto-format your code. Give them one command that auto-formats all files correctly. Introducing fast-format-x (`ffx`).
collection_swe_toolbox: true
---

## The problem: AI agents waste tokens on formatting

As I principle, I [auto-format everything possible](/linters). When AI agents (Codex/Cursor/Claude Code/Goose) write code, I want their code to also be autoformatted. If it isn't git `pre-commit` hooks will fail and the LLM's will waste time and tokens.

For the last few months, I've had an `AGENTS.md` file with explicit instructions on how to auto-format code.

```md
Auto-format code using the following commands:

- Kotlin: `ktlint -F ...`
- Ruby: `bin/run bundle exec rubocop -A ...`
- JavaScript: `npx standard --fix ...`
- ERB: `bin/run bundle exec erb_lint -a --lint-all ...`
- CSS, Markdown, JSON: `npx prettier --write`
- I18n: `npm run i18n:fix`
```

But I don't want to teach my AI agent which linter to use for which file type.
And I want all my linters to run in parallel.

## The solution: ffx

[fast-format-x](https://ffx.bfoos.net/) (`ffx`) is a single command that auto-formats every changed file using the correct formatter for that file type. Written in Rust for speed. All formatters run in parallel.

Replace all those formatting instructions in your `AGENTS.md` with one line:

```md
Run `ffx` to auto-format every changed file (it runs the correct formatter for each file)
```

## How it works

Install `ffx` and then run `ffx init` to get a config in your repo, `.fast-format-x.yaml`:

```yaml
version: 1

tools:
  - name: prettier
    include: ['**/*.md', '**/*.yml', '**/*.yaml', '**/*.js', '**/*.ts']
    cmd: npx
    args: [prettier, --write]
    check_args: [prettier, --check]

  - name: rubocop
    include: ['**/*.rb', '**/*.rake']
    cmd: bundle
    args: [exec, rubocop, -A]
    check_args: [exec, rubocop]

  - name: gofmt
    include: ['**/*.go']
    cmd: gofmt
    args: [-w]
    check_args: [-l]
```

Then run `ffx`. It finds changed files, matches them to tools, and runs the right formatter on each file. All in parallel.

## Installation

From [fast-format-x](https://github.com/BrianSigafoos/fast-format-x):

```bash
curl -LsSf https://ffx.bfoos.net/install.sh | bash
ffx init  # Install pre-commit hook and create starter config
```

## Usage

```bash
ffx              # Format changed files
ffx --staged     # Format staged files only
ffx --all        # Format all matching files
ffx --all --check  # CI mode: check without modifying
```

## Why this matters for AI

AI agents are great at writing code. They shouldn't need to think about which formatter to call for which file type. That's a solved problem.

One command. One line in your `AGENTS.md`. No wasted time or tokens.
