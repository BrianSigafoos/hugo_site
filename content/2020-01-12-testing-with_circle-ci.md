---
date: 2020-01-12T06:09:51-08:00
slug: parallel-tests-on-circle-ci
title: Parallel tests on CircleCI
summary: Speed up builds by running Rails tests in parallel and learn more about CircleCI 2.1 features.
---

By running tests in parallel on
[CircleCI](https://circleci.com/docs/2.0/getting-started/#section=getting-started),
almost any test suite can go from tens of minutes to single minutes.

Below is an example CircleCI config that demonstrates how to set up parallelism.
See `parallelism: 4` in the `test` job.

It also demostrates how to use the most useful CircleCI 2.1 features: orbs,
commands, executors, jobs, workflows, and context.

Tip: to save time, download the
[CircleCI CLI](https://circleci.com/docs/2.0/local-cli/#section=configuration).
Then validate your repository's
`.circleci/config.yml` config file locally by running: `circleci config validate`.

```yaml
# .circleci/config.yml

version: 2.1

aliases:
  - &bundle_path vendor/bundle
  # Default path of gem 'minitest-ci' https://github.com/circleci/minitest-ci
  - &results_path test/reports
  # Default path for screenshots from Rails system tests
  - &screenshots_path tmp/screenshots
  - &working_directory ~/repo

#
# Orbs are packages of config that you can import by name or configure inline.
orbs:
  # https://circleci.com/orbs/registry/orb/codecov/codecov
  codecov: codecov/codecov@1.0.5

  # https://circleci.com/orbs/registry/orb/valimail/dependency-manager
  # Aliased as "dm" throughout
  dm: valimail/dependency-manager@0.4.1

#
# Commands are reusable sets of steps invokable with parameters inside a job.
commands:
  prepare_workspace:
    steps:
      - dm/install-yarn
      - dm/update-bundler
      - attach_workspace:
          at: *working_directory
      - dm/bundle-gems

#
# Executors define the environment in which the steps of a job will be run.
executors:
  ruby-postgres-redis:
    docker:
      - image: circleci/ruby:2.6.5-browsers
        environment:
          BUNDLE_PATH: *bundle_path
          RESULTS_PATH: *results_path
          PGHOST: 127.0.0.1
          PG_USER: ubuntu
          RAILS_ENV: test
          RACK_ENV: test
          NODE_ENV: test
      - image: circleci/postgres:11.4-alpine-postgis
        environment:
          POSTGRES_USER: ubuntu
      - image: redis:5.0
    working_directory: *working_directory

#
# Jobs have two parts: the execution environment and a set of steps.
jobs:
  setup:
    resource_class: small
    executor: ruby-postgres-redis
    steps:
      - checkout
      - dm/install-yarn
      - dm/install-gems:
          cache-version: v1
      - dm/install-packages:
          cache-version: v1
      - run:
          name: Set up database.yml
          command: |
            mv config/database.yml.example config/database.yml
            sed -i 's/\$USER/ubuntu/g' config/database.yml
      - run:
          name: Compile webpacker packs
          command: bundle exec rails webpacker:compile --trace
      - run:
          name: Save test filenames, splitting out slower system tests
          command: |
            circleci tests glob "test/**/*_test.rb" > test_all.txt
            grep -v "test/system" test_all.txt > test_main.txt
            grep "test/system" test_all.txt > test_system.txt
      - persist_to_workspace:
          root: .
          paths:
            - .

  lint:
    resource_class: small
    executor: ruby-postgres-redis
    steps:
      - prepare_workspace
      - run:
          name: Lint JS
          command: yarn lint:js
      - run:
          name: Lint Ruby
          command: bundle exec rubocop
      - run:
          name: Scan for Rails code vulnerabilities
          command: |
            gem install brakeman
            brakeman
      - run:
          name: Scan for bundled Ruby gem vulnerabilties
          command: |
            gem install bundler-audit
            bundle audit check --update
      - run:
          name: Scan for Ruby and RubyGems system vulnerabilities
          command: |
            bundle add ruby_audit --group "test"
            bundle exec ruby-audit check
      - run:
          name: Analyze Ruby code quality
          command: |
            gem install rubycritic
            rubycritic --minimum-score 90 --format json --no-browser app

  test:
    resource_class: small
    executor: ruby-postgres-redis
    parallelism: 4
    steps:
      - prepare_workspace
      - run:
          name: Create and load database
          command: |
            bundle exec rails db:create --trace
            bundle exec rails db:schema:load --trace
      - run:
          name: Run Rails non-system tests
          command: |
            TEST_FILES="$(circleci tests split test_main.txt --split-by=timings)"
            bundle exec rails test $TEST_FILES
      - store_test_results:
          path: *results_path
      - run:
          name: Run Rails system tests
          command: |
            TEST_FILES="$(circleci tests split test_system.txt --split-by=timings)"
            bundle exec rails test $TEST_FILES

            # Want to use RSpec instead of minitest? Try this:
            # bundle exec rspec --format progress --format RspecJunitFormatter --out $RESULTS_PATH/rspec/core_results.xml $TEST_FILES
      - store_test_results:
          path: *results_path
      - store_artifacts:
          path: *screenshots_path

#
# Workflows are sequences of jobs.
workflows:
  build:
    jobs:
      - setup
      - lint:
          requires:
            - setup
      - test:
          context: saas-tokens
          requires:
            - setup
```
