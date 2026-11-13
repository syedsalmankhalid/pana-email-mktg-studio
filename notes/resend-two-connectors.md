# Idea: Two Resend connectors, practice and live

Status: idea, not built yet. Today the studio uses one connector, `resend`, which picks practice or live mode from the key in `.env`.

## The idea

Add two connectors in `.mcp.json` instead of one that switches modes:

- **`resend-practice`**: always uses the practice server (`http://localhost:4000`) and the `re_practice` key. It never reads `.env`.
- **`resend-live`**: always uses real Resend (`https://api.resend.com`) and the key from `.env`. If there's no real key, it refuses to start instead of quietly falling back.

## Why it helps

- **No more editing `.env` to switch.** The key stays in place. You pick a mode by which connector you use.
- **Clear names.** Tools become `mcp__resend-practice__send-email` and `mcp__resend-live__send-email`, so the target shows in every permission prompt and in the transcript.
- **Live can be turned off.** Keep `resend-live` disabled most of the time and switch it on only for real sends.

## What to handle

- **The send guard would stop matching.** It's registered for `mcp__resend__.*`, and neither new name matches that. The hook matcher and the name check in `.claude/hooks/send-guard.mjs` must be updated to cover both, or live sends would go **unchecked**. This is the most important part.
- **Twice the tools.** Resend has about 150 tools. Two connectors put about 300 in the session, which adds clutter and makes it easier for Claude to pick the wrong one. Keeping live disabled by default fixes this.
- **Saying which one.** With both on, every request needs "send with practice" or "send live". With live off by default, practice is the only option until you choose otherwise.

## Suggestion

Use two connectors, with `resend-live` off by default and the guard updated to cover both names.

## Related: switching modes with the current single connector

The current launcher (`.claude/mcp/start-resend.mjs`) decides the mode from the key, not the URL.

| Key in `.env` | URL in `.env` | Result |
|---|---|---|
| empty | any | Practice. Key, URL and sender all reset to practice values. |
| `re_practice` | any | Practice |
| real key | empty | **Live**. An empty URL falls back to `https://api.resend.com`. |
| real key | `http://localhost:4000` | Avoid. Reports "live", but points at the practice server and sends the real key there. |

So to go back to practice mode, empty `RESEND_API_KEY` and restart. Changing the URL as well is fine for clarity, but changing only the URL doesn't switch modes.
