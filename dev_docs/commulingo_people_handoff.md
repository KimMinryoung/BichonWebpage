# CommuLingo People Dictionary Handoff

Last updated: 2026-07-11

This note is for the next person or AI agent continuing work on `/commulingo/people`.

## AI Agent Editing (leninbot) — added 2026-07-11

The leninbot agent (Cyber-Lenin) can now continue the people-dictionary work
itself. Implementation lives in the leninbot repo:

- `leninbot/runtime_tools/commulingo_people.py`
  - `commulingo_people` — read tool: list_groups / search_people / get_person /
    list_offices / get_office / list_suggestions
  - `commulingo_edit` — write tool: create/update/delete for `person` and
    `office_row`, patch shape identical to the admin API payloads, source
    citations required
- Exposed to the Telegram orchestrator and the analyst agent; blocked for
  public web chat and inbound MCP.

`commulingo_edit` has two modes, switched by
`leninbot/config/commulingo_people.json` → `"direct_apply"` (mtime-cached,
no restart needed):

- `true` (current): edits apply immediately in one transaction, write a
  snapshot to `commulingo_people_revisions` (same semantics as
  `people-admin-store.js`), and log an auto-approved row in
  `commulingo_agent_suggestions` so sources/confidence are always on record.
- `false`: edits are staged as `pending` rows in `commulingo_agent_suggestions`;
  review them with `leninbot/scripts/commulingo_suggestions.py`
  (`list` / `show <id>` / `approve <id>` / `reject <id> --note`), which reuses
  the same Python apply path.

Freshness: agent writes bypass this app's process, so changes appear after the
30s people-store cache + ~30s CDN max-age expire (≈1 minute). No restart or
purge needed.

Footgun mitigation: `npm run commulingo:people:migrate -- --replace` now
refuses to run when `commulingo_people_revisions` has rows (i.e. the DB was
edited after seeding) unless `--force` is also passed. `people.js` is a
bootstrap seed only — the DB is the source of truth once agent/admin edits
exist.

## Current State

The people dictionary is now DB-backed at runtime.

- Public page: `/commulingo/people`
- Public read API:
  - `GET /commulingo/api/people`
  - `GET /commulingo/api/people/:personId`
  - `GET /commulingo/api/offices`
  - `GET /commulingo/api/offices/:officeId`
- Admin CRUD API:
  - mounted at `/commulingo/admin/api`
  - protected by `requireAdminIp`
  - state-changing requests also pass the existing CSRF middleware

Current DB-shaped data count:

- groups: `6`
- people: `129`
- career entries: `574`
- offices: `16`
- office timeline rows: `141`
- validator issues: none
- unmapped role icons: none

Current people groups:

- `old-regime`
- `bolshevik`
- `international-revolutionary`
- `stalin-era`
- `thaw`
- `perestroika`

`international-revolutionary` holds non-Soviet revolutionaries (Luxemburg, Liebknecht, Gramsci, Mao, Guevara, ...). It renders LAST, under its own '소련 밖의 혁명가들' section heading, independent of the Soviet-era sequence (sort_order 99; standalone list in commulingo-people.ejs). Convention: their `cyrillic` column carries the NATIVE-script name instead (毛泽东, Hồ Chí Minh, Amílcar Cabral, ...).

## Important Source-of-Truth Warning

Runtime reads from Postgres through `data/commulingo/people-store.js`.

However, `data/commulingo/people.js` still exists as the bootstrap/seed source used by:

```bash
npm run commulingo:people:migrate
npm run commulingo:people:migrate -- --replace
```

Be careful: `--replace` truncates and reloads the people DB tables from `data/commulingo/people.js`. Admin API and AI-agent edits live only in the DB, so `--replace` would overwrite them — since 2026-07-11 the script refuses to run when `commulingo_people_revisions` has rows unless you also pass `--force`. Treat the DB as the source of truth and `people.js` as a bootstrap seed.

Still open if you want repo-tracked data again:

- DB export script that writes the current DB state back to a canonical source file
- migration away from `people.js` as seed source

## Key Files

Data and normalization:

- `data/commulingo/people.js`
  - bootstrap source data
  - groups, people, offices, careers, patronymics
- `data/commulingo/people-standard.js`
  - normalization layer used by SSR and APIs
  - `ROLE_RULES` seeds and file-fallback maps people to role icon ids and office links
  - validator lives here
- `data/commulingo/people-store.js`
  - reads normalized DB tables and reconstructs the old `people.js` shape
  - loads `commulingo_person_roles` as the runtime role-icon source
  - used by runtime public page/API
- `data/commulingo/people-admin-store.js`
  - admin CRUD functions
  - transaction-based writes
  - writes revision snapshots to `commulingo_people_revisions`

Routes and views:

- `routes/commulingo.js`
  - public page and read APIs
  - DB-first load with file fallback
- `routes/commulingo-admin-api.js`
  - admin CRUD API
- `views/public/commulingo-people.ejs`
  - people page SSR template
  - inline Lucide-style role SVG path map
- `public/css/commulingo.css`
  - page layout, cards, accordions, role icon styling

DB:

- `scripts/migrations/007_commulingo_people.sql`
  - normalized tables
  - revisions table
  - agent suggestions table scaffold
- `scripts/migrate-commulingo-people-db.js`
  - creates schema and loads `people.js`
  - use `--replace` only when intentionally overwriting DB data from repo data

Validation:

- `scripts/validate_commulingo_people.js`

## DB Schema Shape

Main tables:

- `commulingo_people_groups`
- `commulingo_people`
- `commulingo_person_patronymics`
- `commulingo_person_aliases`
- `commulingo_person_scenes`
- `commulingo_person_career_entries`
- `commulingo_person_roles`
- `commulingo_offices`
- `commulingo_office_rows`

Governance/scaffold tables:

- `commulingo_people_revisions`
- `commulingo_agent_suggestions`

`commulingo_agent_suggestions` exists for future AI-agent suggested edits, but there is not yet a complete approval UI/workflow around it.

## Role Icons

The people page no longer uses emoji role icons. It uses Lucide-style inline SVG paths in `views/public/commulingo-people.ejs`.

Person→role mappings live ONLY in `commulingo_person_roles` (no file copy —
`ROLE_RULES` was removed 2026-07-11; on DB outage the file-fallback path
renders default icons). Offices carry their icon in `commulingo_offices.icon`,
seeded from the `OFFICE_ICON` map in `data/commulingo/people-standard.js`;
`commulingo_person_roles.icon` is an override field and may be empty when the
role derives from `officeId`. After a `--replace --force`, person roles must
be restored from a DB backup — the seed only refills office icons. Icon ids,
not raw SVG:

- security: `eye`
- defence: `star`
- foreign affairs: `handshake`
- ideology/propaganda: `megaphone`
- culture/literature: `paintbrush`
- heavy industry/MIC: `factory`
- science/nuclear/space: `atom`
- agriculture: `wheat`
- state head: `landmark`
- nationalities/federal: `map`
- party leadership: `flag`
- party secretariat/cadres: `folder`
- government: `briefcase`
- planning/economic management: `chart`
- Comintern: `globe`
- non-Soviet revolutionary: `flame` (accent #9c2d3f; was `rose`/#b84f7a until 2026-07-11)
- socialist-bloc reform leader: `dove`
- writer (office-less role, label '작가'/'Writer'): `feather`

Design decision: do not use swords for defence. The Cheka/security tradition uses the "sword" symbol, so defence currently uses `star` for Red Army association.

## Page Layout Decisions

Current `/commulingo/people` UX:

- `소련 기관별 지도부 타임라인` is collapsed by default.
- Each individual office timeline card inside it is also collapsed by default.
- People groups are collapsed by default.
- Group headers have hover/focus background and border changes to show clickability.
- People cards are max two columns on desktop.
- People cards collapse to one column under the existing mobile breakpoint.
- `moment` renders as an optional restrained pull-quote between the epithet and bio when non-empty.
- Hash behavior:
  - `#office-...` opens the outer office timeline and the target office card.
  - `#p-...` opens the target people group and scrolls to the person card.

## Admin CRUD API

Admin API is intended for internal tooling first, not public clients.

Read:

```http
GET /commulingo/admin/api/people
GET /commulingo/admin/api/people?q=suslov&limit=5
GET /commulingo/admin/api/people/:personId
GET /commulingo/admin/api/offices
GET /commulingo/admin/api/offices/:officeId
```

Write:

```http
POST /commulingo/admin/api/people
PATCH /commulingo/admin/api/people/:personId
DELETE /commulingo/admin/api/people/:personId
POST /commulingo/admin/api/offices/:officeId/rows
PATCH /commulingo/admin/api/office-rows/:rowId
DELETE /commulingo/admin/api/office-rows/:rowId
```

Notes:

- Writes require CSRF unless called in an authenticated internal path that explicitly bypasses it later.
- Writes record snapshots in `commulingo_people_revisions`.
- Deletes are real DB deletes.
- Person create/update accepts optional localized `payload.moment` (`{ ko, en }` or string); absent leaves existing DB text untouched on update, and empty text is not rendered on public cards.
- Person create/update accepts optional `payload.role`:
  - absent: leave the existing role row untouched
  - `null`: delete the role row
  - object: upsert `{ icon?, officeId?, label? }`; `icon` is optional when `officeId` is present, `officeId` must exist in `commulingo_offices` when non-empty, and `label` may include `{ ko, en }`
  - at least one of `icon` or `officeId` is required; use explicit icons for special non-institution roles such as `flame` (non-Soviet revolutionary), `feather` (writer), `dove`, and `landmark`
- For AI agents, prefer suggestion/approval workflow before allowing direct writes.

## Common Workflows

Validate source data:

```bash
node scripts/validate_commulingo_people.js
```

Reload DB from `people.js`:

```bash
npm run commulingo:people:migrate -- --replace
```

Use this only if `people.js` is the intended source of truth for the change.

Seed role rows from `ROLE_RULES` without replacing runtime edits:

```bash
node scripts/seed-commulingo-person-roles.js
```

The role seed applies migration 008, fills blank `commulingo_offices.icon`
values from `ROLE_RULES`, inserts only missing `commulingo_person_roles` rows,
skips missing people, and never overwrites existing runtime role edits.

Check runtime DB reconstruction:

```bash
node - <<'EOF'
require('dotenv').config();
const { loadCommuLingoPeopleFromDb } = require('./data/commulingo/people-store');
const { normalizeCommuLingoPeople, validateCommuLingoPeople } = require('./data/commulingo/people-standard');
(async () => {
  const data = await loadCommuLingoPeopleFromDb({ fresh: true });
  const normalized = normalizeCommuLingoPeople(data, { lang: 'ko' });
  console.log(JSON.stringify({
    issues: validateCommuLingoPeople(data),
    people: normalized.people.length,
    offices: normalized.offices.length,
    officeRows: normalized.offices.reduce((sum, office) => sum + office.rows.length, 0),
    careerEntries: normalized.people.reduce((sum, person) => sum + person.career.length, 0),
    unmapped: normalized.people.filter(p => p.role.icon === 'circle-help').map(p => p.id),
  }, null, 2));
  const db = require('./config/database');
  await db.end();
})();
EOF
```

Start preview:

```bash
scripts/dev-preview restart
```

Preview URL:

```text
http://100.122.248.77:3001/commulingo/people
```

Production deploy:

```bash
sudo -u grass /home/grass/frontend/scripts/deploy --restart
```

Do not recreate the production frontend container with ad hoc `docker run`.

## Production Checks

After deploy:

```bash
curl -s -o /tmp/commulingo_people.html -w '%{http_code} %{size_download}\n' http://127.0.0.1:3000/commulingo/people
```

Check API source:

```bash
curl -s http://127.0.0.1:3000/commulingo/api/people/vasilevsky
curl -s http://127.0.0.1:3000/commulingo/api/people/luxemburg
```

Check container networks:

```bash
docker inspect leninbot-frontend --format '{{range $name,$net := .NetworkSettings.Networks}}{{println $name $net.IPAddress $net.GlobalIPv6Address}}{{end}}'
```

Expected networks include:

- `leninbot_default`
- `leninbot_ipv6`

Check logs:

```bash
docker logs --tail 80 leninbot-frontend
```

## Recent Design Decisions

- Cards use square corners to match the website style.
- The old Cyrillic monogram medallion was replaced by role icons.
- Role icons are SVG, not emoji, to keep a single visual style.
- The top fate legend was removed.
- Fate chips still remain on individual cards.
- Institution timeline and people groups are collapsed by default to reduce page bulk.
- People cards are limited to two columns to avoid narrow cards breaking Korean names into awkward fragments.

## Known Gaps / Recommended Next Work

1. Build an admin UI around the CRUD API.
2. ~~Add an AI suggestion flow using `commulingo_agent_suggestions`.~~ Done 2026-07-11 (leninbot `commulingo_edit`, staging mode).
3. ~~Add a review/approval workflow.~~ Done 2026-07-11 (`leninbot/scripts/commulingo_suggestions.py`; direct mode currently active by owner choice).
4. Decide source-of-truth strategy: currently DB primary (guarded `--replace`); a DB→`people.js` export script would restore repo tracking.
5. Move role icon SVG path map out of the EJS template if it grows further.
6. ~~Move `ROLE_RULES` into DB if non-developer admins need to edit role mappings.~~ Done 2026-07-11 (`commulingo_person_roles`; `ROLE_RULES` remains seed/fallback only).
7. Source citations: `commulingo_edit` requires per-edit source refs (stored in `commulingo_agent_suggestions.source_refs`); per-career-row citations in the schema remain open.
8. Add focused tests around DB reconstruction and admin CRUD rollback.
9. New people added by the agent/admin API can now be mapped through `payload.role` / `commulingo_person_roles`; unmapped people still fall back to `circle-help`.

## Useful Commit Trail

Recent commits in this line of work:

- `46c9d61` Move CommuLingo people data to Postgres
- `4aac062` Add CommuLingo people admin CRUD API
- `8bc8ab9` Map remaining CommuLingo people roles
- `4910a25` Use SVG role icons for CommuLingo people
- `19a0bd8` Collapse CommuLingo people groups by default
- `155719b` Clarify clickable CommuLingo people groups
- `38cc6ba` Tighten CommuLingo people page accordions
