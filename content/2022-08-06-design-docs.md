---
date: 2022-08-06T20:33:08-04:00
slug: design-docs
title: Design Docs
summary: Why encouraging Design Docs helps teams build better software and a template borrowed from Google
---

> As software engineers our job is not to produce code per se, but rather to solve problems.

From [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)

I love to say that "[problems are good, we solve problems](/problems)". Part of solving big problems is to write them down clearly and then to outline a solution. This is called a "Design Doc".

## Benefits of a Design Doc

Writing a Design Doc and having it reviewed does several things:

- Provide a process to get feedback and critique from senior engineers in other teams
- Encourage critique early in the process, when it's easiest to make changes: before any code is written
- Achieve consensus around a design to solve a particular problem
- Ensure consideration of cross-cutting concerns like security and privacy
- Spread knowledge throughout the org
- Help new engineers get up to speed

## When to create a Design Doc, and when not to

- Is there a new problem with an ambiguous solution? Then: YES
- Is there significant problem complexity or solution complexity that would benefit from review? Then: YES
- Would the doc be an implementation manual without discussing trade-offs or alternatives? Then: NO

## Template

- Google Doc: [Design Doc - TEMPLATE](https://docs.google.com/document/d/1B7Hwe93GasGd0pODJZ2kT6UkmJO6uUD-qGzLTVPY3aI/edit?usp=sharing)
- Inline below:

-----

Date: [YYYY-MM-DD] <br />
Status: [Draft | In Review | Approved | Rejected] <br />
Authors: [Your name, co-authors] <br />

# Context and scope

## Problem Statement

[1-3 sentence description of the problem]

## Details

[1-2 paragraphs, givig more context than the problem statement]

## Goals

[Short list of bullets, what's in scope]

## Non-goals

[Short list of bullets, what's out of scope]

# Design

## Overview

[Details on the chosen solution, including discussion of trade-offs]

## System context diagram

[Diagram showing how this system fits into existing systems]

## APIs

[Sketch of API endpoints with focus on parts relevant to this design and trade-offs]

## Data storage

[Sketch of data storage with focus on parts relevant to this design and trade-offs]

## Degree of constraint

[What aspects of the existing system constrain the design, or what boundaries are needed to help constrain it]

# Alternatives considered

[Other possible solutions, discussing trade-offs that each design makes and how those trade-offs led to the proposed design]

# Cross-cutting concerns

## Security

[What needs to be considered to keep systems secure]

## Privacy

[What needs to be considered to protect customers]

# Appendix

## References

[Bullets to other docs and even Slack threads discussing the problem/solution]

## Notes

[If useful to record notes, keep this free form section for notes as the document above takes shape]


----

*<-- End of template -->*

## References for this blog post

- [Architecture Review Process - Mozilla](https://mozilla.github.io/firefox-browser-architecture/text/0006-architecture-review-process.html)
- [Engineering Planning with RFCs, Design Documents and ADRs - The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/rfcs-and-design-docs)
- [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
