# CommuLingo People Dictionary Handoff

Last updated: 2026-07-11

This note is for the next person or AI agent continuing work on `/commulingo/people`.

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

`international-revolutionary` currently contains Rosa Luxemburg. It exists for non-Soviet revolutionaries who belong in the intellectual/political context but should not be presented as Soviet institutional figures.

## Important Source-of-Truth Warning

Runtime reads from Postgres through `data/commulingo/people-store.js`.

However, `data/commulingo/people.js` still exists as the bootstrap/seed source used by:

```bash
npm run commulingo:people:migrate
npm run commulingo:people:migrate -- --replace
```

Be careful: `--replace` truncates and reloads the people DB tables from `data/commulingo/people.js`. If future admin API edits are made directly in DB and not synced back to `people.js`, running `--replace` will overwrite those DB edits.

Before making AI-agent write workflows serious, add one of these:

- DB export script that writes the current DB state back to a canonical source file
- migration away from `people.js` as seed source
- admin review workflow where approved edits are committed back to repo data

## Key Files

Data and normalization:

- `data/commulingo/people.js`
  - bootstrap source data
  - groups, people, offices, careers, patronymics
- `data/commulingo/people-standard.js`
  - normalization layer used by SSR and APIs
  - `ROLE_RULES` maps people to role icon ids and office links
  - validator lives here
- `data/commulingo/people-store.js`
  - reads normalized DB tables and reconstructs the old `people.js` shape
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
- `commulingo_offices`
- `commulingo_office_rows`

Governance/scaffold tables:

- `commulingo_people_revisions`
- `commulingo_agent_suggestions`

`commulingo_agent_suggestions` exists for future AI-agent suggested edits, but there is not yet a complete approval UI/workflow around it.

## Role Icons

The people page no longer uses emoji role icons. It uses Lucide-style inline SVG paths in `views/public/commulingo-people.ejs`.

`ROLE_RULES` in `data/commulingo/people-standard.js` stores icon ids, not raw SVG:

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
- non-Soviet revolutionary: `rose`
- socialist-bloc reform leader: `dove`

Design decision: do not use swords for defence. The Cheka/security tradition uses the "sword" symbol, so defence currently uses `star` for Red Army association.

## Page Layout Decisions

Current `/commulingo/people` UX:

- `소련 기관별 지도부 타임라인` is collapsed by default.
- Each individual office timeline card inside it is also collapsed by default.
- People groups are collapsed by default.
- Group headers have hover/focus background and border changes to show clickability.
- People cards are max two columns on desktop.
- People cards collapse to one column under the existing mobile breakpoint.
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
2. Add an AI suggestion flow using `commulingo_agent_suggestions`.
3. Add a review/approval endpoint rather than direct AI writes.
4. Decide source-of-truth strategy:
   - DB primary with export/backups, or
   - repo data primary with generated DB, or
   - hybrid with explicit sync tooling.
5. Move role icon SVG path map out of the EJS template if it grows further.
6. Consider moving `ROLE_RULES` into DB if non-developer admins need to edit role mappings.
7. Add source citations per person/career row before allowing autonomous AI enrichment.
8. Add focused tests around DB reconstruction and admin CRUD rollback.

## Useful Commit Trail

Recent commits in this line of work:

- `46c9d61` Move CommuLingo people data to Postgres
- `4aac062` Add CommuLingo people admin CRUD API
- `8bc8ab9` Map remaining CommuLingo people roles
- `4910a25` Use SVG role icons for CommuLingo people
- `19a0bd8` Collapse CommuLingo people groups by default
- `155719b` Clarify clickable CommuLingo people groups
- `38cc6ba` Tighten CommuLingo people page accordions
