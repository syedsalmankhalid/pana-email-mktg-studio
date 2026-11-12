---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

# Personalize a campaign for each lead group

Campaign folder: $ARGUMENTS

## Step 1: Check the campaign folder

- If no campaign folder was given above, stop. Use Glob on `campaigns/*/` and reply with the list of campaign folders that exist, plus one line: "Run /personalize <campaign folder> to continue." Write nothing.
- If a folder was given but `<campaign folder>/emails/*.md` finds no files, stop. Say so and list the campaign folders that do exist. Write nothing.
- Accept either `campaigns/steep-club-launch` or just `steep-club-launch`.

## Step 2: Read before writing

1. `brand/voice.md`: voice, words to use and avoid, claims we never make, sign-offs.
2. `.claude/rules/emails.md`: the email file rules.
3. `leads/leads.csv`: find the distinct values in the `group` column. Expect `tea-curious`, `gift-buyers` and `daily-drinkers`. Use only the group column. Never copy names or email addresses into an email.
4. `<campaign folder>/plan.md`, if it exists, for what each group cares about.
5. Every file in `<campaign folder>/emails/`. Skip anything outside that folder, including an existing `groups/` folder.

## Step 3: Write one version per email, per group

For each email and each group, change only two things:

1. **The opening line.** The first line after `Hi {{first_name}},`. Rewrite it to speak to that group.
2. **One example.** Pick one sentence that gives an example (a moment, a use, a reason to join) and swap it for one that fits the group.

What fits each group:

- **tea-curious**: new to loose-leaf. Keep it easy and unintimidating. Example: trying a first blend with the simple brewing guide.
- **gift-buyers**: buying for someone else. Example: a box for a friend, a parent, or a thank-you.
- **daily-drinkers**: already have a tea habit. Example: a fresh blend to refresh the morning or evening cup.

Keep everything else exactly as it is, word for word:

- The `Subject:` and `Preview:` lines.
- The greeting, the paragraph order and the number of paragraphs.
- The one main link, including its button text and URL.
- The sign-off and the two-line footer, including the two trailing spaces on the first footer line.
- Every `{{placeholder}}` and every `[OWNER TO CONFIRM: ...]` marker.
- The offer wording and terms. Do not add new facts, prices, dates, discounts or claims.

The new lines must follow the brand voice: warm, calm, friendly, short sentences, no jargon, no hype, no health claims. Do not add emojis.

## Step 4: Save

Save each version to `<campaign folder>/groups/<group>/emails/<same file name>`. Overwrite an older version if one is there. Do not touch the original emails.

## Step 5: Reply

Reply with a short summary only. No file contents, no extra notes:

```
Wrote <N> files (<emails> emails × <groups> groups) to <campaign folder>/groups/.

tea-curious: "<opening line from the first email>"
gift-buyers: "<opening line from the first email>"
daily-drinkers: "<opening line from the first email>"
```
