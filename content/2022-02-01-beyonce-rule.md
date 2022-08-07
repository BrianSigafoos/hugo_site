---
date: 2022-02-01T09:00:00-04:00
slug: beyonce-rule
title: The Beyoncé Rule
summary: >
  "If you like it, then you shoulda put a CI test on it."
---

![The Beyoncé Rule](/img/posts/if-you-like-it-then-you-shoulda-put-a-ci-test-on-it.jpg)

## Automated tests allow software to change

A key message from the [Software Engineering at Google](https://www.oreilly.com/library/view/software-engineering-at/9781492082781/) book's section on Testing is that: **automated tests allow software to change**.

These tests, running on CI (Continuous Integration), unblock large infrastructure changes.
They also give increased confidence to all library version upgrades.

> “If a product experiences outages or other problems as a result of infrastructure changes, but the issue wasn’t surfaced by tests in our Continuous Integration (CI) system, it is not the fault of the infrastructure change.”
> More colloquially, this is phrased as “If you liked it, you should have put a CI test on it,” which we call “The Beyoncé Rule.”
> -- Software Engineering at Google
