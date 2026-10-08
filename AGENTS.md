# AGENTS.md

This repository runs the production frontend as the `leninbot-frontend` Docker container.
When operating from the `root` account on the production server (cloud sessions have no `grass` user and run as root; this does not apply there):

1. Create and modify project files as the `grass` user so that file ownership is assigned to `grass`, not `root`.
2. Run all Git commands as the `grass` user. Do not perform Git operations as `root`.


## Deployment Safety

- Do not recreate or restart the production `leninbot-frontend` container with an ad hoc `docker run`.
- The dev preview (`leninbot-frontend-dev`) is off by default: `scripts/dev-preview start` when a task needs it, `scripts/dev-preview stop` when done (it also stops itself after `DEV_PREVIEW_TTL`, default 4h).
- The admin screens write `data/commulingo/docs/manifest.json` directly (link-review rejections, document metadata edits); the change is already live. If you find it modified and not part of your own task, commit it yourself with a message naming the changed documents (`git diff` shows what the admin did), then push — do not ask the user to commit it.
- Use `scripts/deploy --restart` for production restarts so the required labels, host data mount, and the `leninbot_default` network are applied consistently.
- The frontend connects to the local `leninbot-pg` Postgres container (`DB_HOST=leninbot-pg`) over the `leninbot_default` Docker network — the same network used for Redis. (The DB migrated off Supabase in July 2026; the old `leninbot_ipv6` network is no longer needed.)
- CommuLingo work products (batch specs and build scripts in `scripts/content/`, link-review files in `scripts/reviews/`, data-only SQL and backups in `scripts/migrations/data/`) are records of DB writes. New files there are gitignored and archived to R2 with `scripts/archive-work-r2` (credstore keys via systemd; an hourly timer and `scripts/apply-migration` also run it); a DB-only data task ends without a commit. `npm test` rejects a new data-only SQL file in `scripts/migrations/`. Details: [operations reference](dev_docs/frontend-operations.md#commulingo-작업물-r2-보관).
- Read production data with `scripts/query-db "SELECT ..."` (read-only `leninbot_ro` login; details in the operations reference). Do not borrow service credentials for reads.
- If recent posts, reports, hub curations, or diary entries suddenly show "목록을 불러오지 못했습니다" (503) or `/ready` reports `db:false`, check `docker logs leninbot-frontend` for connection errors to `:5432`, then check that `leninbot-pg` is healthy (`docker ps`) and that both containers share `leninbot_default`:

```bash
docker inspect leninbot-frontend --format '{{range $name,$net := .NetworkSettings.Networks}}{{println $name $net.IPAddress}}{{end}}'
docker network connect leninbot_default leninbot-frontend  # if missing
```

Then verify `/`, `/posts`, `/reports`, `/hub`, and `/ai-diary` show content again.

## Verification scope

- Keep verification proportional and do not repeat checks that the deployment script already performs.
- Before deployment, run the smallest targeted check for the changed area. Do not run `npm test` separately when the same revision will immediately be deployed; `scripts/deploy` runs it.
- A successful `scripts/deploy` run counts as the full release check: tests, health, route sweep, and built-in consistency audits. Rerun any of those manually only when the deploy reports a failure.
- After deployment, verify one representative affected production route or response. Use a browser only for CSS, layout, rendered markup, or client-side interaction changes; do not perform both local and production browser passes by default.
- Add broader route, database, cache, or infrastructure checks only when the change touches those systems or an observed failure points there.
- Verify a live change through the origin: on the server `http://127.0.0.1:3000<path>`, elsewhere the public URL with a unique query (`?verify=<timestamp>`). The plain public URL may serve Cloudflare's edge copy of anonymous HTML for up to 60 s, and nothing purges it automatically (leninbot's purge is off unless `LENINBOT_CLOUDFLARE_PURGE=1`); refresh that copy with `node scripts/cloudflare-purge.js <paths>` only when it matters.

## Context and task references

- Stack: Node.js/Express, EJS, PostgreSQL. Public site: cyber-lenin.com.
- Read only the task-relevant document from [dev_docs/README.md](dev_docs/README.md); do not load every handoff or old project memory.
- Strike game: [design and implementation](dev_docs/strike-game-handoff.md).
- Deploy, preview, data/cache, auth: [operations reference](dev_docs/frontend-operations.md).
- CommuLingo people must go through the Admin store/upsert tool; do not bypass validation with direct INSERTs. Host-mounted data changes affect production immediately.
- UI changes must follow the [site design standard](dev_docs/design-system.md): reuse shared tokens/components and align full-width page shells with the site menu.
- For CSS, layout, or client-side interaction changes, perform one browser check, preferably against production after deployment. Do not require browser checks for metadata, visibility, server-only, or documentation changes. Read user-referenced screenshots before diagnosing them. Save verification screenshots under `temp_dev/screenshots/` (gitignored) or the session scratchpad, never in the repository root.
- Keep this file limited to enduring constraints and routing links. Put formulas, procedures and completed-work history in topic documents. Current user instructions take precedence over past preferences.

## Cloud sessions and lone clones

This repository works without the production server or the leninbot checkout. In a Claude Code cloud session the SessionStart hook in `.claude/settings.json` runs `scripts/cloud-setup` (only when `CLAUDE_CODE_REMOTE=true`), which installs `node_modules`; elsewhere run it by hand.

- Available: editing, `npm test` (no DB or container; the gitignored `data/commulingo/generated/` shards are built on demand), `npm run lint`.
- Not available: running the server against data (Postgres, Redis), R2 (`scripts/archive-work-r2` needs the server credstore), `scripts/deploy`, `scripts/dev-preview`, and the scripts that need leninbot (`LENINBOT_DIR`, default `/home/grass/leninbot`): `scripts/{review,translate}-course-fulltext.py`, `scripts/bulk-translate/extract_glossary.py`. Verify those on the server.
- `data/commulingo/{person-editorial-contract,nationality-policy,activity-schema,activity-catalog}.json` are this repository's contracts, and leninbot keeps copies in `config/commulingo_contracts/` so it can test alone. After changing one, run `scripts/sync_commulingo_contracts.py` in leninbot and commit there too; its unit test fails until the copies match.
