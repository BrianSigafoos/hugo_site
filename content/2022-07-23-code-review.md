---
date: 2022-07-23T14:01:48-04:00
slug: code-review
title: Code Review best practices
summary: Follow clear guidelines for code review to help improve code quality and products
collection_swe_toolbox: true
---

This is a condensed and lightly remixed version of Google's must-read [Code Review Developer Guide](https://google.github.io/eng-practices/review/).

## Why review

The purpose of code review is to make sure code quality increases over time and to keep delivering value to customers/stakeholders.

Why do we review each other's code?

- Quality
- Knowledge sharing
- Consistency

## What to look for

Code reviews should look at:

- **Design**
  - Is the code well-designed and appropriate for your system? Does it meet the requirements from Product on the attached ticket?
- **Functionality**
  - Does the code behave as the author likely intended? Is the way the code behaves good for its users?
- **Complexity**
  - Could the code be made simpler? Would another developer be able to easily understand and use this code when they come across it in the future?
- **Tests**
  - Does the code have correct and well-designed automated tests?
- **Naming**
  - Did the developer choose clear names for variables, classes, methods, etc.?
- **Comments**
  - Are the comments clear and useful? Are they needed?
  - Usually to explain **why** some code exists, not **what** it is doing. If the code isn’t clear enough to explain itself, then the code should be made simpler.
- **Style**
  - Does the code follow our style guides?
- **Consistency**
  - Does it follow the existing pattern? If it creates a new pattern, are we updating docs to point to this new pattern adding a tech debt issue to clean up the existing code?
- **Documentation**
  - Did the developer also update relevant documentation?

## Principles

Follow these key principles, in order:

- Technical facts and data overrule opinions and personal preferences
- On matters of style, the language's style guide is the authority ([automate all linting](/linters))
  - If not covered in the style guide, be consistent with the existing code's style
  - If no existing code/style, accept the author's
- If the author can demonstrate that several approaches are equally valid, then the reviewer should accept the preference of the author. Otherwise, the choice is dictated by standard principles of software design.
- If no other rule applies, then the reviewer may ask the author to be consistent with what is in the current codebase

## How to write code review comments

When reviewing someone else's code, always assume competence and goodwill.

Try to always:

- Be kind
- Be curious
- Explain your reasoning
- Balance giving explicit directions with just pointing out problems and letting the developer decide
- Encourage developers to simplify code, not just explain it in comments

When reviewing someone else's code, always assume competence and goodwill.

Critique the code and never the person. Some examples:

- BAD: "Why did you do X this way, when there's no real benefit?"
- GOOD: "This way it is done using X doesn't seem to provide any benefit. Because there's no benefit, it's best for this code to be rewritten with Y".

If you see something clearly wrong, it most likely comes from a lack of information, not from an inability. Use the opportunity to explain, teach, and lead to correct solutions.

If you see something you like, you can comment on that as well. Learn something new? Let them know. Encourage more great code/change by praising it.

## How to write a good changelist / pull request (for code authors)

The first sentence of a changelist (pull request) describes **what’s** actually being done.

The rest of the description explains **why** the change is being made and gives the reviewer a lot of context.

First Line tips:

- Short summary of what is being done.
- Complete sentence, written as though it was an order (imperative sentence)
- Follow by empty line.

Some examples:

- BAD: "Deleting the FizzBuzz RPC and replacing it with the new system"
- GOOD: "Delete the FizzBuzz RPC and replace it with the new system"

Remember that the changelist description is a public record of what change is being made and why it was made. It will become a permanent part of our version control history, and will possibly be read by hundreds of people other than your reviewers over the years.

## How to handle reviewer comments (for code authors)

Remember:

- Don’t take it personally
  - The goal of code review is to improve the quality of our code and products
- Fix the code
  - If the reviewer doesn't understand something, usually the best course is to improve the code's clarity
- Think collaboratively
  - Do you understand what the reviewer is asking for? If not, ask for clarification.
  - If you disagree, do so with courtesy and respect, while discussing the pros/cons of different approaches
  - Try to come to a consensus based on technical facts
  - Ask for in-person, or video, discussion and document the result as a code review comment

## References

- [Code Review Developer Guide by Google](https://google.github.io/eng-practices/review/)
- [Respectful Code Reviews](https://chromium.googlesource.com/chromium/src/+/master/docs/cr_respect.md)
