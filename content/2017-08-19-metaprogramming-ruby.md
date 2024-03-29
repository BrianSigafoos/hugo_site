---
date: 2017-08-20 00:00:00
slug: metaprogramming-ruby
title: Metaprogramming in Ruby
summary: Some patterns, approaches, and "spells" for metaprogramming in Ruby.
---

## What is metaprogramming?

Here's a definition from [Metapgramming Ruby 2](https://www.amazon.com/dp/B00N9I0RMQ):

> Metaprogramming is writing code that manipulates language constructs at runtime.

Unlike in C, which has a distinction between compile time (language constructs
available) and runtime (machine code), Ruby doesn't have compile time at all.
Most Ruby constructs are available at runtime making it a very metaprogramming
friendly language.

Below are my notes in the form of Ruby metaprogramming patterns, approaches,
and "spells" inspired by
[Metapgramming Ruby 2](https://www.amazon.com/dp/B00N9I0RMQ).

&nbsp;

{{< gist BrianSigafoos ed1b4247d1ace1c7742d2b41a363f11a >}}

From [gist.github.com/BrianSigafoos](https://gist.github.com/BrianSigafoos)
