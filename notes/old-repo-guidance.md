# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

This folder is not a code project yet. It has no source code, no package manifest, no build, lint or test tooling, and no git repository. Do not invent commands for any of these.

Contents:
- `Email Studio Lab Assignment FDE-102.md`: the lab guide. It is the working spec for the project. Read it before doing anything else.
- `Email Studio Lab Assignment FDE-102.mhtml` (also copied to `reference/`): the original saved web page the guide was converted from. Treat the `.md` as the copy to edit.
- `yourStudioatEnd.jpg`: screenshot of the finished studio.

The studio's own files (CLAUDE.md for the studio, `brand/`, `campaigns/`, `leads/`, `scripts/`, `.claude/`, `.mcp.json`) were deleted on purpose and do not exist here. The guide describes how to rebuild them. Do not recreate them unless the user asks.

## How the guide is organized

The guide describes a 15-step course that builds an email marketing studio with Claude Code. Each step has a Build prompt, a Check prompt run in a fresh session, and a "You'll know it worked when" list. Keep that pattern if you extend the guide.

- Steps 1 to 8 plan and write emails. Nothing is sent.
- Steps 9 to 11 connect Resend in practice mode, add a PreToolUse send guard, and run a practice launch. Sends go only to `@resend.dev` addresses or the user's own address.
- Steps 12 to 14 cover sessions, headless review, and packaging a plugin.
- Step 15 is an optional stretch.

The sample brand is Kettlebird Tea, launching The Steep Club. Practice leads use `@example.com` addresses only.

## Note for when the studio is rebuilt

Step 2 of the guide asks for a project-root `CLAUDE.md`. That file would replace this one. Before the studio is rebuilt, decide whether this file stays as the repo guidance or gets replaced by the studio's rules.
