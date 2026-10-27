# AGENTS.md

This repository runs the production frontend as the `leninbot-frontend` Docker container (Node.js/Express, EJS, PostgreSQL; public site cyber-lenin.com).
When operating from the `root` account on the production server (cloud sessions have no `grass` user and run as root; this does not apply there), create and modify files and run every Git command as the `grass` user.

Keep this file limited to enduring constraints and routing links; procedures and completed-work history belong in topic documents. Current user instructions take precedence over past preferences and memory notes.

## Deployment safety

- Restart production only with `/home/grass/frontend/scripts/deploy --restart` (it applies the labels, host data mount and `leninbot_default` network); never an ad hoc `docker run`. A CSS-only change is published with `scripts/deploy-assets publish`.
- The CommuLingo admin MCP and pipeline ticks run in their own container (`leninbot-frontend-mcp`, `mcp/main.js`). A change confined to the editing code replaces only that container; `scripts/deploy --mcp-only` replaces it alone. The website has no CommuLingo editing screens or API.
- The dev preview (`leninbot-frontend-dev`) is off by default: `scripts/dev-preview start` when a task needs it, `scripts/dev-preview stop` when done.
- Host-mounted data (`data/`) is read live by production: write a complete replacement and move it into place in one step.
- Troubleshooting (503 lists, `/ready` `db:false`, network): [operations reference](dev_docs/frontend-operations.md#장애-점검).

## CommuLingo data

- Read and write CommuLingo data (people, terms, events, offices, reference documents, data documents, link reviews, registries) through the `commulingo` admin MCP: the tools validate, keep revisions and audit every write, and their write tools default to a dry run. Large payloads go in a file under `scripts/content/` or `scripts/reviews/` and are passed as `specPath`. Tool list: [admin MCP](dev_docs/commulingo-admin-mcp.md); rules for content and naming: the `commulingo-data-ops` skill.
- Never bypass the stores with hand-written INSERT/UPDATE on `commulingo_*` tables. For read-only checks no typed tool covers, use MCP `sql_read` or `scripts/query-db` (read-only `leninbot_ro`); do not borrow service credentials.
- DB data work is not committed. Its specs and scripts go in `scripts/content/`, link-review files in `scripts/reviews/`, any data-only SQL in `scripts/migrations/data/`, raw sources (PDF, saved pages, e-books) in `docs/`; all are gitignored and the hourly `commulingo-work-archive.timer` uploads them to R2. Agent sessions have no sudo: do not run or retry `scripts/archive-work-r2`. Commit only code, schema migrations and data files still tracked in git (lessons, courses).

## Verification scope

- Keep verification proportional and do not repeat checks the deploy script already performs.
- Committing without deploying: run `npm test` first. Deploying the same revision right away: `scripts/deploy` runs the tests, health, route sweep and consistency audits, and a successful run is the full release check; rerun any of them only when it reports a failure.
- After deployment, verify one representative affected production route or response. Use a browser only for CSS, layout, rendered markup or client-side interaction changes, once, preferably against production after the deploy; not for metadata, visibility, server-only or documentation changes. Save screenshots under `temp_dev/screenshots/` (gitignored), never in the repository root. Read user-referenced screenshots before diagnosing them.
- Add broader route, database, cache or infrastructure checks only when the change touches those systems or an observed failure points there.
- Verify a live change through the origin: on the server `http://127.0.0.1:3000<path>`, elsewhere the public URL with `?verify=<timestamp>` (Cloudflare may serve its copy of anonymous HTML for up to 60 s). After a CommuLingo data write, MCP `stores_refresh` makes the serving process pick it up at once.

## Task references

- Read only the task-relevant document from [dev_docs/README.md](dev_docs/README.md).
- Deploy, preview, data/cache, auth: [operations reference](dev_docs/frontend-operations.md).
- UI changes follow the [site design standard](dev_docs/design-system.md): reuse shared tokens/components and align full-width page shells with the site menu.
- Strike game: [design and implementation](dev_docs/strike-game-handoff.md). Civil-war game: [design and implementation](dev_docs/civil-war-game.md).

## Cloud sessions and lone clones

This repository works without the production server or the leninbot checkout. In a Claude Code cloud session the SessionStart hook in `.claude/settings.json` runs `scripts/cloud-setup` (only when `CLAUDE_CODE_REMOTE=true`), which installs `node_modules`; elsewhere run it by hand.

- Available: editing, `npm test` (no DB or container; the gitignored `data/commulingo/generated/` shards are built on demand), `npm run lint`.
- Not available: running the server against data (Postgres, Redis), the admin MCP, R2, `scripts/deploy`, `scripts/dev-preview`, and the scripts that need leninbot (`LENINBOT_DIR`, default `/home/grass/leninbot`): `scripts/{review,translate}-course-fulltext.py`, `scripts/bulk-translate/extract_glossary.py`. Verify those on the server.
- `data/commulingo/{person-editorial-contract,nationality-policy,activity-schema}.json` are this repository's contracts, and leninbot keeps copies in `config/commulingo_contracts/` so it can test alone. After changing one, run `scripts/sync_commulingo_contracts.py` in leninbot and commit there too; its unit test fails until the copies match. leninbot also reads the activity catalog, whose source is the database document `activity-catalog`; the server writes it to `data/commulingo/activity-catalog.json` (gitignored).
