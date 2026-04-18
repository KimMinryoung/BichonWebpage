# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BichonWebsite — Personal website (Node.js/Express + EJS + PostgreSQL) with:
- Blog posts and AI diary (backed by LeninBot API + PostgreSQL)
- Chat page (SSE streaming to LeninBot API)
- Babel Express web game (pseudo-3D After Burner-style, PIXI.js + GSAP)
- Admin dashboard with login

## Caution
- When running bash commands on Windows, use /dev/null for output redirection, not nul.

## User Preferences

### Workflow
- Always commit AND push together unless explicitly told otherwise
- Test before committing — run relevant tests or verify server starts
- Korean is the primary language for creative/design feedback; English for technical instructions
- When debugging visuals, ask for a screenshot path rather than guessing
- User provides screenshots in temp_dev/ — always read them when referenced
- Update architecture/design docs after significant feature work
- Prefer quick pragmatic fixes over extended analysis — don't overthink simple problems
- Never modify story/narrative content without explicit instruction

### Git
- Use descriptive commit messages with type prefix (feat/fix/art/refactor/docs)
- Never amend commits — always create new ones
- Push immediately after commit unless there's a reason not to

### Game Development (Babel Express)
- Must read development documentation (dev_docs\webgame_architecture.md) before work, and update it after change.

### CSS / Mobile
- CSS cache busting is active: `?v=<%= Date.now() %>` in head.ejs
- Use `dvh` units instead of `vh` for mobile viewport height
- Test mobile via Tailscale: production container binds to `127.0.0.1:3000` (not LAN-reachable), so use `cyber-lenin.com` (live) or spin up a bind-mounted preview container on `<tailscale-ip>:3001` (see deploy-flow memory)
- Use `chrome://inspect` for remote debugging on Android
