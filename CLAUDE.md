# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BichonWebsite — Personal website (Node.js/Express + EJS + PostgreSQL) with:
- Blog posts and AI diary (backed by LeninBot API + PostgreSQL)
- Chat page (SSE streaming to LeninBot API)
- Admin dashboard with login

## Caution
- When running bash commands on Windows, use /dev/null for output redirection, not nul.

## User Preferences

### Workflow
- Always commit AND push together unless explicitly told otherwise
- Test before committing — run relevant tests or verify server starts
- `npm test` (= `scripts/test`: every EJS view compiles, SEO head, error page, CommuLingo policy smoke tests, `validate-commulingo.js` content gate, `audit-commulingo-quality.js`; ~2 s, no DB) must pass before a commit; `scripts/deploy` refuses to build when it fails.
- CommuLingo content rules live in `scripts/lib/commulingo-checks.js`. Rules the corpus does not yet satisfy everywhere are tolerated per (rule, label) in `scripts/commulingo-quality-baseline.json`, which can only shrink: after fixing content run `node scripts/validate-commulingo.js --prune-baseline`; `--no-baseline` shows the true remaining failures. A lesson edit under `data/commulingo/` goes live through the bind mount; afterwards run `node scripts/build-commulingo-shards.js` on the host and purge Cloudflare with `scripts/changed-commulingo-lessons.js <old> <new> | scripts/purge-commulingo.js --old-version <ver> --stdin`.
- Behaviour-preserving refactors are verified by byte-diffing rendered pages between prod (:3000) and dev-preview (:3001) with `scripts/diff-preview` (default 24 paths × ko/en; pass paths as arguments, `COOKIE=` / `NO_EN=1` for header matrices). Run it with nothing else hitting dev-preview.
- `scripts/deploy` gates: `npm test` → build → `/health` → 20-route 200 sweep (incl. book/lesson/drill) → `check-commulingo-code-db-drift.js`; any failure exits non-zero (the new container stays up — inspect before moving on). `scripts/dev-preview` runs the container as the host user so bind-mounted files stay grass-owned.
- Scripts that touch the DB start with `require('./lib/bootstrap')` (loads `.env` from the repo root); run-once migrations live in `scripts/one-off/` and are not re-runnable tools.
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

### Admin auth (Passkey / WebAuthn)
- Admin login is passkey-only (no password) and `/admin/*` is IP-whitelisted (ADMIN_ALLOWED_IPS). Owner-only `/writer` is hidden with a 404 on the public host. For the tailnet admin origin, RP config, bootstrap, adding devices, and recovery, use the `admin-passkeys` skill.

### Deployment / Data-only updates
- Production container mounts host data with `-v /home/grass/frontend/data:/app/data`; data-only changes under `data/` are visible to the running app without rebuilding the Docker image.
- CommuLingo content lives in data files and DB tables, not code: lessons/courses, reference documents, id redirects, and the role/term/blocklist registries are all editable without a deploy. Use the `commulingo-data-ops` skill for the exact paths, caching behavior, and verification commands.
- **Never edit CommuLingo content values in code.** What is left in code shadowing a table is either a FALLBACK the DB overrides at runtime (`ROLE_OFFICE_TITLES`, `OFFICE_ICON` in `data/commulingo/people-standard.js`; `_TERM_CATEGORY_FALLBACK` in the leninbot repo) or a SEED for a fresh database (`scripts/seed-commulingo-person-roles.js`). Editing either changes nothing on a healthy site and silently disagrees during a DB outage or a re-seed. Run `docker exec leninbot-frontend node /app/scripts/check-commulingo-code-db-drift.js` after touching any of them — it fails when a copy stops matching its table, and also catches a nationality code in use with no flag SVG. The one genuinely code-shaped thing in this area is an SVG (a role icon glyph, a flag), which needs a deploy wherever it lives.
- Run the full deploy script for code, dependency, CSS/JS/template, server, route, config, or Docker image changes that require a new container image/restart.
- Never recreate or restart the production `leninbot-frontend` container with an ad hoc `docker run`. Use `scripts/deploy --restart` so the required labels, host data mount, and the `leninbot_default` network are applied consistently.
- `scripts/deploy` without `--restart` skips the build entirely when the local commit == origin/master — even if the running container is on older code, it reports "Already up-to-date" and does nothing. When the container itself is behind, use `--restart` to force the rebuild. A bare `docker restart` never picks up code changes (code is copied at image build, not mounted).
- The frontend connects to the local `leninbot-pg` Postgres container (`DB_HOST=leninbot-pg`, pgvector/pg17) over the `leninbot_default` Docker network — the same network used for Redis. The DB migrated off Supabase in July 2026; the old `leninbot_ipv6` network and the `ENETUNREACH` IPv6 failure mode are gone.
- If recent posts/reports/hub/diary suddenly render as empty, check `docker logs leninbot-frontend` for connection errors to `:5432`, confirm `leninbot-pg` is healthy (`docker ps`), and confirm both containers share `leninbot_default` (`docker network connect leninbot_default leninbot-frontend` if missing). Then verify `/`, `/posts`, `/reports`, `/hub`, and `/ai-diary` show content again.

### CSS / Mobile
- CSS cache busting is active: `?v=<%= assetVersion %>` in head.ejs — `ASSET_VERSION` env → `GIT_SHA` (baked in by `scripts/deploy` at image build) → boot-time `Date.now()` fallback. Asset URLs therefore stay stable across restarts of the same revision.
- Use `dvh` units instead of `vh` for mobile viewport height
- Test mobile via Tailscale: production container binds to `127.0.0.1:3000` (not LAN-reachable), so use `cyber-lenin.com` (live) or run `scripts/dev-preview start` for a bind-mounted preview on `<tailscale-ip>:3001`.
- The dev preview container is `leninbot-frontend-dev`; use `scripts/dev-preview stop|restart|status|logs`. It sets `DEV_MODE=1`, disables view/static asset caching, and publishes only to the Tailscale interface.
- Use `chrome://inspect` for remote debugging on Android
