# AGENTS.md

Production frontend for cyber-lenin.com: Node.js/Express, EJS and PostgreSQL, running as the `leninbot-frontend` Docker container.

Keep this file to enduring constraints and routing links; procedures and finished-work history belong in topic documents. Current user instructions take precedence over past preferences and memory notes.

On the production server, create and modify files and run Git as the `grass` user, even when operating from `root`. (Cloud sessions have no `grass` user and run as root.)

## Deployment safety

- Restart production only with `/home/grass/frontend/scripts/deploy --restart` (it applies the labels, host data mount and `leninbot_default` network), never an ad hoc `docker run`. A CSS-only change is published with `scripts/deploy-assets publish`.
- The CommuLingo admin MCP and pipeline ticks run in their own container (`leninbot-frontend-mcp`, `mcp/main.js`); `scripts/deploy --mcp-only` replaces it alone when a change touches only the editing code. The website has no CommuLingo editing screens or API.
- The dev preview (`leninbot-frontend-dev`) is off by default: `scripts/dev-preview start` when a task needs it, `stop` when done.
- Production reads host-mounted `data/` live: write a complete replacement and move it into place in one step.
- Troubleshooting (503 lists, `/ready` `db:false`, network): [operations reference](dev_docs/frontend-operations.md#장애-점검).

## CommuLingo data

- Read and write CommuLingo data (people, terms, events, offices, reference documents, data documents including courses `course/<id>`, link reviews, registries) only through the `commulingo` admin MCP: it validates, keeps revisions and audits every write, and write tools default to a dry run. Pass large payloads as a file under `scripts/content/` or `scripts/reviews/` via `specPath`. Tools: [admin MCP](dev_docs/commulingo-admin-mcp.md); content and naming rules: the `commulingo-data-ops` skill.
- No hand-written INSERT/UPDATE on `commulingo_*` tables. For read-only checks no typed tool covers, use MCP `sql_read` or `scripts/query-db` (read-only `leninbot_ro`); never borrow service credentials.
- Data work is neither committed nor deployed. Where its files go (all gitignored; the hourly `commulingo-work-archive.timer` uploads them to R2):

  | Kind | Location |
  | --- | --- |
  | Specs and scripts | `scripts/content/` |
  | Link-review files | `scripts/reviews/` |
  | Data-only SQL | `scripts/migrations/data/` |
  | Raw sources (PDF, saved pages, e-books) | `docs/` |
  | Copyrighted works kept only as references (never translated in full or published) | `sources-private/` |

  Agent sessions have no sudo: do not run or retry `scripts/archive-work-r2`. Commit only code, schema migrations and the contract files tracked in git.

## Verification scope

- Keep verification proportional; do not repeat what the deploy script already checks.
- Commit without deploy: run `npm test` first (layout, options `--browser`/`--db`/name filters and `@requires` skips: [tests/README.md](tests/README.md)). Deploying the same revision right away: a successful `scripts/deploy` run (tests, health, route sweep, consistency audits) is the full release check; rerun a part only when it reports a failure.
- After a deploy, check one representative affected route or response through the origin: on the server `http://127.0.0.1:3000<path>`, elsewhere the public URL with `?verify=<timestamp>` (Cloudflare may serve cached anonymous HTML for up to 60 s). After a CommuLingo data write, MCP `stores_refresh` makes the serving process pick it up at once.
- Use a browser only for CSS, layout, rendered markup or client-side interaction, once, preferably against production after the deploy. Screenshots go in `temp_dev/screenshots/` (gitignored), never the repository root. Read user-referenced screenshots before diagnosing.
- Add route, database, cache or infrastructure checks only when the change touches those systems or a failure points there.

## Task references

- Read only the task-relevant document from [dev_docs/README.md](dev_docs/README.md).
- Deploy, preview, data/cache, auth: [operations reference](dev_docs/frontend-operations.md).
- UI: [site design standard](dev_docs/design-system.md) — reuse shared tokens/components; full-width page shells align with the site menu.
- Games: [strike](dev_docs/strike-game-handoff.md), [civil war](dev_docs/civil-war-game.md), [Great Patriotic War](dev_docs/great-patriotic-war-game.md), shared [war engine](dev_docs/war-engine.md).

## Cloud sessions and lone clones

The repository works without the production server or the leninbot checkout. In a Claude Code cloud session (`CLAUDE_CODE_REMOTE=true`) the SessionStart hook in `.claude/settings.json` runs `scripts/cloud-setup` to install `node_modules`; elsewhere run it by hand.

- Available: editing, `npm run lint`, `npm test` (no DB or container; courses come from the frozen seed `tests/fixtures/commulingo-courses-seed.json`; tests needing live data, a database or a browser skip themselves with the reason).
- Server only: running against data (Postgres, Redis), the admin MCP, R2, `scripts/deploy`, `scripts/dev-preview`, and `scripts/bulk-translate/extract_glossary.py` (needs leninbot at `LENINBOT_DIR`, default `/home/grass/leninbot`).
- Contracts: `data/commulingo/{person-editorial-contract,nationality-policy,activity-schema}.json` belong to this repository; leninbot keeps copies in `config/commulingo_contracts/` to test alone. After changing one, run `scripts/sync_commulingo_contracts.py` in leninbot and commit there too (its unit test fails until the copies match). leninbot also reads the activity catalog: its source is the database document `activity-catalog`, which the server writes to `data/commulingo/activity-catalog.json` (gitignored).
