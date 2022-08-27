---
date: 2022-08-27T10:35:57-04:00
slug: debug-scientifically
title: Debug scientifically
summary: Try a more "scientific" process to solving bugs and reducing Mean Time to Recovery (MTTR)
collection_swe_toolbox: true
---

## Bugs are inevitable

Working as a software engineer, we [solve problems](/problems) for our customers and stakeholders. Part of solving problems means new problems will arise. That's good. The alternative is to never make progress: to never deliver new code to production. Some of the new problems will inevitably be bugs. We write automated tests to prevent bugs. We also write tests whenever a new bug is found, to prevent any regressions.

## Mean Time to Recovery (MTTR)

The highest performance teams I've worked with have a bias towards action and progress. This means continuously deploying their code from `main` branch, aka "trunk based development". They accept that there will occasionally be bugs. More important than not having any bugs is how fast bugs can be resolved, also known as Mean Time to Recovery (MTTR).

## A "scientific" process to debug faster

- Gather information
- Write down your hypothesis
- Ask, how do I disprove this hypothesis?
- Test it to disprove it, and eliminate that hypothesis
- Rinse and repeat to make progress towards understanding the root cause

### Gather information

Goal: understand the size and scope of the bug as quickly as possible

- Who is it impacting?
  - Is it a special case for certain customers/roles? Or for all roles?
- Can you reproduce it?
  - On production? Staging? Locally?
  - The easiest bugs to fix are ones that you can reproduce locally.
- Ask "what changed?"
  - Was there a recent deploy or code change that could be the culprit?
- Are there any relevant details in your error reporting tools or logs?

### Write down your hypothesis

For local development bugs, still write down your hypothesis in a scratchpad or note. Because you'll repeat this process a few times it provides a good list of what you've tested already and eliminated as the root cause.

For production bugs, communication is key. Start or join a new thread to discuss only this bug. To start you can communicate something like: "I'm looking into this bug now".

Then, for every hypothesis, post it to the thread.

### Ask how can I disprove this hypothesis?

We don't want to solve the wrong problem so it's essential to think of a way to disprove the hypothesis. Is there an action or a change you can make that will disprove ("falsify") your hypothesis?

Think of it as: "If I do action X, I expect to see Y". X could be a code or config change and Y could be the bug disappearing or some related information changing.

### Test it to disprove it, and eliminate that hypothesis

Do the test and write down the results.

Every single negative result is still valuable as you get closer and closer to identifying and fixing the root cause.

For production bugs, good communication means posting both the results of all tests to the thread.

### Rinse and repeat to make progress

If the test disproved your hypothesis, then just start the process again. You now have more information. Use that information, or gather even more, to help generate a new hypothesis.

It's good to have hypotheses that are incorrect. More important than figuring it out immediately systematically making progress. This type of progress will also feel good.

By communicating publicly, hopefully others can help you do this process. Or, at least learn the process so that next time they can lead it themselves.

### Example

Here's an example of what this might look in the Slack thread where someone posted a new bug. Annotations are marked as `(...)` for clarity:

> (bug reported, replies below in a thread)...
>
> Ok, I'm looking into this bug now.
>
> Given A1 (information), my hypothesis is B1 is the root cause.
>
> To test B1 (hypothesis), I'll now do C1 (test #1) to disprove it. I'll report my findings here.
>
> Ok, we now know it's not B1 (hypothesis), because of A2 (new information / result of C1 test)
>
> My new hypothesis is B2.
>
> To test B2 (hypothesis #2), I'll now do C2 (test #2) to disprove it. I'll report my findings here.
>
> Ok, that was it. Now that I've done C2, the bug is fixed. I feel confident this is the root cause because of A3 (any new info)
>
> I'll mark this as closed in XYZ (error reporting tool)

## References

Before getting a lot of practice with this myself, I first heard about a "Scientific method for dealing with bugs" at a Ruby Meetup talk in San Francisco, June 2018. I wish I knew the speaker's name to give them credit.

While writing this up I also came across these similar articles:

- [How to Fix the Hardest Bug You've Ever Seen: The Scientific Method](http://yellerapp.com/posts/2014-08-11-scientific-debugging.html)
- [Debugging Like a Scientist](https://www.rithmschool.com/blog/debugging-like-a-scientist)
