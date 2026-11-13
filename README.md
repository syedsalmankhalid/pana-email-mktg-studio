# Email Studio

An email marketing studio run with [Claude Code](https://claude.com/claude-code). It plans campaigns, writes the emails, makes a version for each customer group, and sends tests through [Resend](https://resend.com). Guards stop it from emailing real people.

The sample business is **Kettlebird Tea**, a small-batch loose-leaf tea shop. The sample campaign is the launch of **The Steep Club**, a monthly tea box.

This project was built for the Panaversity FDE-102 Email Studio Lab. No coding is needed to use it.

## What's inside

| Folder or file | What it holds |
|---|---|
| `brand/voice.md` | Kettlebird's voice, words to use and avoid, claims we never make, and sign-offs. |
| `campaigns/steep-club-launch/` | The campaign plan, four launch emails, and a version of each email for every customer group. |
| `leads/leads.csv` | 24 made-up practice contacts in three groups. All addresses use `@example.com`. |
| `notes/` | Research notes and decisions, such as which skills were chosen and why. |
| `reference/` | The lab guide and screenshots. Read-only. |
| `CLAUDE.md` | Project rules Claude reads at the start of every session. |
| `.claude/rules/emails.md` | Format rules for every email file: subject, preview, one link, sign-off, footer. |
| `.claude/skills/personalize/` | The `/personalize` skill. It writes one copy of each email per lead group. |
| `.claude/hooks/send-guard.mjs` | The send guard. It checks every Resend call before it runs. |
| `.claude/mcp/start-resend.mjs` | Starts the Resend connector in practice or live mode. |

## The Steep Club campaign

Four emails over four weeks, sent to a waitlist of about 2,000 people:

1. **Doors are open.** The club is live.
2. **What's in the box.** What each month brings.
3. **A gift to steep.** The club as a gift.
4. **Offer ends soon.** A calm reminder about the 20% waitlist offer.

Each email has a version for each of three groups:

- **Tea-curious beginners** want an easy start.
- **Gift buyers** want something thoughtful that arrives on time.
- **Daily tea drinkers** want fresher blends and a better daily cup.

Facts only the owner can confirm, such as shipping times, are marked `[OWNER TO CONFIRM: ...]`. An email with one of these still in it is not ready to send.

## Safety rules

1. **Never email real people.** Sends may only go to Resend's test addresses (ending in `@resend.dev`) and to the owner's own address.
2. **The send guard enforces this.** It blocks any `send-email` or `send-batch-emails` call with another address. It always blocks broadcasts, automations, inbox sends, replies and forwards.
3. **Ask before deleting.** Claude asks first before removing files, folders or git history.
4. **No secrets in git.** The API key lives in `.env`, which is git-ignored. Only `.env.example` is committed.

## Getting started

You need Node.js 22 or newer, Git, and Claude Code.

```bash
git clone https://github.com/syedsalmankhalid/pana-email-mktg-studio.git
```

```bash
cd pana-email-mktg-studio
```

```bash
claude
```

### Practice mode (the default)

With no API key set, the Resend connector talks to a local practice server at `http://localhost:4000`. Nothing leaves your machine.

### Live mode (optional)

1. Copy `.env.example` to `.env`.
2. Add a Resend API key with **sending access only**.
3. Keep the sender as `onboarding@resend.dev` until you verify your own domain.
4. To allow sends to your own inbox, set `MY_EMAIL` in `.claude/settings.local.json` under `env`. This file is git-ignored.
5. Restart Claude Code.

To check which mode you're in:

```bash
node .claude/mcp/start-resend.mjs --check
```

## Things to try

- "Send a connection test to delivered@resend.dev."
- "Review email 02 against the brand voice."
- `/personalize campaigns/steep-club-launch`
