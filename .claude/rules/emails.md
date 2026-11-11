---
paths:
  - "campaigns/**/emails/*.md"
---

# Email File Rules

These rules apply to every email file in any campaign. They apply to email files only.

Each email file must:

1. **Start with a subject line.** The first line is `Subject: ...`. It must be 50 characters or fewer.
2. **Follow with a preview line.** The next line is `Preview: ...`. It must be 90 characters or fewer.
3. **Greet the reader by name.** Use `{{first_name}}` in the greeting.
4. **Have exactly one main link.** Write it as `[Button text](https://kettlebird.example/steep-club)`. Do not add other links in the body.
5. **End with our sign-off, then the footer.**
   - Use one of the two sign-offs from `brand/voice.md`.
   - After the sign-off, add this two-line footer as plain text. Do not put it in a code block.

   You're getting this because you joined the Kettlebird Tea waitlist.
   Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}

Keep to the brand voice in `brand/voice.md`.
