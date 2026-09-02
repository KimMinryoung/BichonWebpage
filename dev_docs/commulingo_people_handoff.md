# CommuLingo People Dictionary Handoff

Last updated: 2026-07-23

This note is for the next person or AI agent continuing work on `/commulingo/people`.

## Structured name parts — added 2026-07-24

`commulingo_people` now stores names as parts: `given_name_ko/en`,
`family_name_ko/en`, with the patronymic staying in
`commulingo_person_patronymics`. `name_ko/en` remain as the DERIVED full name
(given + family, patronymic never embedded) and are recomputed by the admin
store whenever any name field changes — do not write them independently.

Admin API (`POST/PATCH /commulingo/admin/api/people`):
- Preferred payload: `givenName: {ko,en}`, `familyName: {ko,en}`,
  `patronymic: {ko,en}`. Non-Russian-style names simply omit `patronymic`.
- Legacy `name: {ko,en}` is still accepted and split (family = last token,
  given = the rest); single-token names (김일성, 카모) go wholly to familyName.
- A name that embeds the patronymic as one of its tokens is rejected with 400
  — that duplication (오토 율리예비치 율리예비치 시미트) is the bug the split
  exists to prevent. Middle names (Gurley, Auguste) belong in givenName, NOT
  in the patronymic field.
- Patronymic PATCHes merge subfields: sending only `cyrillicPatronymic` keeps
  the stored Korean/English values, and sending one localized language keeps
  the other. The resulting row must have both `patronymic.ko` and `.en`; a
  Cyrillic native name with a localized patronymic must also have
  `cyrillicPatronymic`. This closes the old replace-whole-row bug that silently
  blanked whichever half a PATCH omitted.

Display composes `given + patronymic + family` (people-standard.js
`composeFromParts`); migration `060_commulingo_person_name_parts.sql` did the
backfill and repaired the five bad records found in the 2026-07-24 audit.

## Native-name script standard — added 2026-07-23

`commulingo_people.cyrillic` is misnamed: it is the **name in the person's own
script**, rendered under the display name on the card and detail page. Because
the column says "cyrillic", curators and ingest agents filled it with a Russian
transliteration for everyone — 박헌영 showed as `Пак Хон Ён`, Kádár János as
`Янош Кадар`, 片山潜 as `Сэн Катаяма`. Migration 057 rewrote 51 such rows.

**Rule: the field carries the person's name as their own nation writes it.**

| Nationality | Script | Example |
| --- | --- | --- |
| soviet, russia, ukraine, belarus, bulgaria, kazakhstan, kyrgyzstan, tajikistan | Cyrillic | `Иосиф Сталин`, `Дінмұхамед Қонаев` |
| Latin-alphabet nations (Poland, Hungary, Czechia, the Baltics, Germany, France, USA, Africa, Latin America…) | Latin, with diacritics | `Kádár János`, `Mārtiņš Lācis`, `Władysław Gomułka` |
| north-korea, south-korea | Hangul (Hanja allowed) | `박헌영` |
| china | Hanzi | `李大钊` |
| japan | Kanji/kana | `片山潜` |
| georgia / armenia | Georgian / Armenian | `ედუარდ შევარდნაძე` |
| uzbekistan, azerbaijan, turkmenistan, moldova | modern Latin or Soviet-era Cyrillic | `Heydər Əliyev` |
| india | Devanagari, Bengali or Latin | `মানবেন্দ্র নাথ রায়` |

Hungarians follow family-name-first (`Nagy Imre`, `Kun Béla`), matching the
entries that were already correct.

`cyrillic_patronymic` is the middle slot of the same line and follows the same
rule: a Western middle name in Latin (`Earl` + `Russell` + `Browder`), a
Russian-style patronymic only for people who actually used one. It is dropped,
not transliterated, for Georgians, Balts, Hungarians and Western Europeans.

**Where it is enforced (keep all four in sync):**

- `data/commulingo/native-script.js` — `NATION_SCRIPTS` (nationality code →
  allowed scripts) plus `checkNativeScript()`. Single source of the rule.
- `data/commulingo/people-admin-store.js` — create/update run
  `assertNativeScript()` and return HTTP 400 with the rule in the message.
  Payload alias `nativeName` / `nativePatronymic` is accepted for the same
  columns; `nativeScriptOverride: true` is the deliberate escape hatch. The same
  store now also reads and writes `citizenship` / `nationalOrigin`
  (`{code, label}`); legacy `origin` remains a compatible alias.
- leninbot `runtime_tools/commulingo_people.py` — `_NATION_SCRIPTS` and
  `_check_native_script()` are the Python port, wired into `_validate` so
  `commulingo_edit` rejects the mismatch before staging or applying. Its tool
  description carries the rule for the agent.
- `scripts/audit-person-native-names.js` — backstop for rows written before the
  guard or by hand-run SQL; exits 1 when mismatches remain.

**Display-name order (`FAMILY_FIRST` in `native-script.js`, `_FAMILY_FIRST` in
leninbot `commulingo_people.py` — keep the two in sync):** the public page never
prints `name_ko`/`name_en`; `people-standard.js` recomposes the display name from
`given_name_*`/`family_name_*` under the citizenship's rule, so the parts are the
truth and the stored string only has to agree with them.

| citizenship_code | Korean | English |
| --- | --- | --- |
| korea, north-korea, south-korea, china, vietnam | family first, fused (김무정, 펑더화이, 호찌민) | family first, spaced (Kim Mu-chong, Peng Dehuai, Le Duan) |
| japan, hungary | family first, spaced (도쿠다 규이치, 카다르 야노시) | given first (Sen Katayama, János Kádár) |
| everyone else | given first | given first |

The rule keys on `citizenship_code` alone. An ethnic Hungarian with Romanian
papers (Tőkés) or a Korean with Soviet ones (허가이) follows the citizenship's
order; a mononym or a fused single token (히로히토, 허가이, 마오쩌둥) lives wholly
in `family_name_*`, never in `given_name_*`. The native line keeps the nation's
own order (`Kádár János`, `Hồ Chí Minh`) and CJK names are written solid
(`近衞文麿`). `scripts/audit-person-name-order.js` checks every row against all
of this and exits 1 on a mismatch; migration 156 (2026-09-01) is the case that
motivated it — `hungary` was absent from the table, so all 28 Hungarians rendered
given-first while their stored names disagreed with one another.

Because the check keys off nationality fields, a wrong code produces a wrong
name. **Citizenship is the state the person belonged to for the work they are
known for; `nationalOrigin` is national/ethnic background. Neither field is a
birthplace or place of death.** Thus Radek is Soviet + Polish despite being born
in Lemberg (today Lviv), while Yezhov is Soviet + Russian despite being born in
Lithuania. Migration 062 corrected those two rows and repaired legacy
patronymic gaps. Migration 058 had earlier fixed eight records whose
citizenship slot contained a place of death or birth.

The two flags are navigable facets. Citizenship links to
`/commulingo/people/citizenship/:code`; national/ethnic background links to
`/commulingo/people/national-origin/:code`. Both pages reuse the standard
chronological person cards. Migration 063 corrects Kim Jong Il from a
birthplace-derived Russian background to DPRK/Korean background.
Migration 064 makes the same legacy correction for Dzerzhinsky: present-day
Belarus is his birthplace geography, while his documented national background
and own-script name are Polish (`Feliks Dzierżyński`).
For the `georgia` national-background facet, Korean UI and ingestion use the
Soviet-era name `그루지야`; migration 065 normalizes all existing origin labels.
This does not mechanically rewrite prose about the modern state of Georgia.
Migration 066 extends `그루지야` to current Korean Soviet-history prose
(person bio/epithet/moment, career, sections, and event-link descriptions).
Frontend and leninbot write boundaries normalize the same Korean content on
future writes. Citizenship labels remain `조지아`; revision/suggestion history
is intentionally immutable.

## Short-name auto-link exclusions

`data/commulingo/people-linkify.js` keeps a small language-specific denylist
for bare aliases that are too ambiguous for automatic prose/report linking.
Paul Levi remains searchable by the stored aliases `레비` / `Levi`, but those
bare surnames are excluded from auto-links and reverse related-report matching;
only `파울 레비` / `Paul Levi` can establish a report mention.

## Fate label standard — added 2026-07-14

The fate chip (`.commu-fate`) has two parts: **`kind`** drives colour/icon
(executed·assassinated·murdered·killed·suicide = red ✕, deposed = orange ↓,
exile = purple →, natural = grey ○) and **`label`** is the localized text. The
`kind` is a category; the `label` is normalized as follows.

**Rule: the label is the cause of death ONLY, with no death year** — the year
already renders from `years` / `deathYear`, so repeating it is noise.

| Situation | Standard |
| --- | --- |
| Execution | Unified to `처형` / `Executed` (no shot/hanged split) |
| Natural death, vague (`사망`, `노환 사망`, `재임 중 사망`, `급사`) | `자연사` / `Natural causes` |
| Natural death, specific illness | Keep the illness word, drop a redundant `사망` suffix: `심장마비`/`Heart attack`, `폐암`/`Lung cancer`, `결핵`/`Tuberculosis`, `병사`/`Illness` |
| Prison / camp / custody death | `옥사` / `Died in prison` (explicit murder → `옥중 살해` / `Killed in prison`) |
| Murder / assassination | `살해` / `Murdered`, `암살` / `Assassinated` |
| War / accident | `전사` / `Killed in action`, `추락사` / `Killed in crash`, `교통사고` / `Car crash` |
| Suicide | `자살` / `Suicide` |
| Place of death (symbolic) | Append with ` · `: `암살 · 멕시코` / `Assassinated · Mexico` |
| Political fate (deposed / exile) | Keep the EVENT year (differs from the death year): `실각 1964`, `퇴임 1985`, `체포 1991`. Canonical EN: 실각=Removed, 해임=Dismissed, 퇴임=Left office, 전보=Transferred, 은퇴=Retired, 체포=Arrested, 추방=Deported, 유형=Internal exile, 당 해체=Party dissolved |
| Political + cause | `실각 1964 · 자연사` / `Removed 1964 · natural causes` |
| Still living | `생존` / `Living` |

Char limits: **22 KO / 50 EN** (fits compound political+cause labels; rejects
mini-sentences — put burial, prison names, etc. in bio or sections).

**Where it is enforced (keep all three in sync):**

- `data/commulingo/people-standard.js` → `normalizeFateLabel(label, deathYear)`
  strips the death year (handles `년`, parens, full dates, legacy `d.`) while
  preserving political-event years. The frontend admin store
  (`people-admin-store.js`) runs create/update fate labels through it.
- leninbot `runtime_tools/commulingo_people.py` → `_normalize_fate_label` is the
  Python port (same logic); `commulingo_edit` applies it on save and validates
  the 22/50 limits. Its tool description carries the vocabulary guide for the
  agent.
- `scripts/one-off/normalize-commulingo-fate-db.js` was the one-off that normalized all
  535 existing DB rows to this standard (dry-run by default; `--apply` writes).

## Serving from a local snapshot — added 2026-07-14

The people dictionary lives in the DB (`commulingo_people` + related tables), but
the site no longer queries Supabase per request — that cross-region round-trip
made `/commulingo/people` slow. Instead:

- `data/commulingo/people-store.js` → `loadCommuLingoPeople` serves a local JSON
  snapshot (`data/commulingo/people-snapshot.json`, bind-mounted so it persists
  across restarts and doubles as an on-disk backup). Hot path is in-memory; no
  DB.
- The DB is touched only to **rebuild** the snapshot: on a background timer
  (`COMMULINGO_PEOPLE_REFRESH_MS`, default 10 min), synchronously the first time
  when no snapshot exists, and immediately when the frontend admin store edits a
  person (`clearCommuLingoPeopleCache` → `refreshFromDb`).
- Agent/DB edits therefore surface within the refresh interval (~10 min), which
  is acceptable. Pre-warm or force a rebuild with
  `npm run commulingo:people:snapshot` (`scripts/snapshot-commulingo-people.js`,
  run where the DB is reachable — inside the frontend container).
- There is no longer a `people.js` seed file; the DB is the single source of
  truth and the snapshot is its cache. The old seed→DB migrate/validate scripts
  were removed with it.

## Card ordering, category tags, event pages — added 2026-07-13

- **Chronological ordering.** `routes/commulingo.js` → `sortPeopleChronologically`
  (birth year → death year → name; undated last) sorts each era group on
  `/people` and the person lists on `/roles/:id` and `/offices/:id`. Previously
  the order was raw data order.
- **Role-category tag.** `commulingo-person-card.ejs` renders `person.role.label`
  as a `.commu-person-role-tag` chip (colored by era, links to the role/office
  hub) so a card's category is visible, not just an icon.
- **Counts.** Era group headers show `group.people.length`; the event page shows
  `event.people.length` next to "관련 인물".
- **Event prev/next.** `routes/commulingo-events.js` passes `prevEvent`/`nextEvent`
  (neighbors in the sort_order list); `commulingo-event.ejs` renders a
  `.commu-event-nav`. Related people are still bucketed by involvement kind, and
  the DB mappings were expanded in migrations 034 (Great Terror) and 035 (all
  other events).

## Search + auto-linking — added 2026-07-12

Two UX features on the dictionary:

- **Person search** on `/commulingo/people`. Each card carries three haystacks
  (built in `views/partials/commulingo-person-card.ejs`): `data-name`
  (ko/en name, cyrillic, ko/en aliases), `data-role` (role category label +
  career entries + institution posts), and `data-desc` (epithet, moment, bio).
  An inline script in `views/public/commulingo-people.ejs` live-filters as you
  type (terms AND-matched across whitespace) and buckets each hit
  most-identity-first into three result containers: **name → role →
  description** (a card falls to the next bucket only if it did not already
  match a higher one). Matched cards are physically moved into the result grids
  and moved back on clear; the browse groups + office index + standalone head
  hide while searching. Matched substrings are wrapped in
  `<mark class="commu-search-hl">` (unwrapped on clear). Enter jumps to the
  first result, Esc clears. Purely client-side, no new route. Styles:
  `.commu-people-search*` / `.commu-people-result*` / `.commu-search-hl` in
  `public/css/commulingo.css` (square corners, per the site's angular-container
  convention — no rounded search box). The hero `<h1>` (`.commu-people-title`)
  is kept to one line by a small auto-fit script that shrinks its font-size to
  the container width on load/resize.
- **Auto-linking of other people** inside the person detail bio and detail
  sections. `buildPersonLinkIndex` in `data/commulingo/people-linkify.js` builds
  the alias→person index (short/display name + `aliases[lang]`). Language
  handling mirrors `public/js/commulingo-decision.js`: English uses `\b`, Korean
  uses a preceding-char guard plus a `BLOCKED_KO` compound list (레닌그라드,
  스탈린주의…) so particles still link (레닌과) but compounds do not. Renders as
  `.commu-person-link`. Template change: bio now uses `<%- bioHtml %>`.
  Since 2026-07-27 this is one pass of the shared policy below rather than a
  pipeline of its own.

## One linking policy for every surface — 2026-07-27

`data/commulingo/linkify.js` owns who links what, everywhere: the person,
glossary, and history pages, learning content, person cards, and research
reports. Each surface used to carry its own pipeline — different kinds, in
different orders, with different repeat rules — so the same reader met a
different rule per page and a new entry had to be wired into four places.

- **Order** `KIND_ORDER = doc → event → term → topic → person`, most specific
  match first: whichever pass runs first keeps the match, because every later
  pass skips anchor contents. The two headwords both dictionaries carry
  (`대숙청`, `신경제정책`) are same-subject pairs whose pages each show the other
  half, so events winning them costs the reader nothing.
- **Restraint** the first mention of an entry links and later ones stay plain,
  per linker. One linker = one reading unit: a person's bio + sections, a term's
  definition + body, an event's summary + timeline, one lesson passage, one card,
  one report. This is what people links gained — they used to repeat on every
  occurrence while every other kind linked once.
- **Self-exclusion** `exclude` is keyed by kind; a page passes its own id, and
  the same-subject twin it is already showing beside it.
- **Allowed differences**, declared in `SURFACES` and nowhere else: which kinds
  (only cards narrow it, to people — they are three-line snippets rendered by the
  hundred), `newTab` (learning content only, so a lesson does not lose its quiz
  state), and `anchors` (reports only, the `mention-*` ids report-mentions
  deep-links to). Every linker reports what it linked in `.found`, which the
  report panel and the book chip list read instead of re-parsing HTML.
- The per-kind modules (`people-`/`term-`/`event-`/`doc-`/`topic-linkify.js`) are
  now index builders only: which strings belong to which entry. `report-links.js`
  is the report adapter over the shared linker.
- **The one surface that cannot call the linker** is the decision-history book,
  which renders its episodes in the browser. It is served the index instead
  (`clientPersonLinkPayload` → the `commulingo-decision` JSON payload:
  index-vetted aliases + the `BLOCKED_KO` compounds), so
  `public/js/commulingo-decision.js` applies the policy without keeping a
  hand-synced copy of it. It links people only, to the person page, in a new tab,
  first mention per passage.
- Covered by `scripts/smoke-commulingo-linkify-policy.js` (no DB needed) and
  `scripts/smoke-commulingo-decision-links.js` (runs the client script against a
  stub DOM).

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
  - `GET /commulingo/api/people/:personId` (includes localized detail `sections`)
  - `GET /commulingo/api/offices`
  - `GET /commulingo/api/offices/:officeId`
- Historical event pages:
  - `GET /commulingo/events`
  - `GET /commulingo/events/:eventId`
- Detail page: `/commulingo/people/:personId`
- Office hub page: `/commulingo/offices/:officeId`
- Role-category hub page: `/commulingo/roles/:categoryId`
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
- role categories: seeded in DB (`imperial-white`, `writer-artist`, `theorist`, `non-soviet-revolutionary`, `socialist-bloc-reform-leader`, `russian-republic-leader`, `left-opposition`, `socialist-bloc-leader`)
- person detail sections: DB-only content in `commulingo_person_sections`
- historical events: DB-backed `commulingo_history_events` with one relation row per linked person in `commulingo_history_event_people`; each relationship has a stable `relation_kind` for event-specific color coding. Supported kinds and colors (`public/css/commulingo.css`): `leader` (crimson), `participant` (blue), `executor` (ochre), `target` (red), `opponent` (gray), `witness` (violet). As of 2026-07-12 there are ten events in chronological `sort_order`: `revolution-1905` (10), `february-revolution` (20), `october-revolution` (30), `civil-war` (40), `ussr-formation` (45), `new-economic-policy` (50), `five-year-plans` (60), `great-terror` (70), `great-patriotic-war` (80), `soviet-space-program` (90); content migrations live in `scripts/migrations/020`–`028`. Event `sources` entries may be plain book citations as well as URLs; the event view renders non-URL sources as text.
- bulk person sections: migrations `029`–`033` (2026-07-12) added two narrative sections for each of the 50 people that previously had none, so every person now has detail sections. The 5-minute `leninbot-commulingo-maintainer` systemd timer (DeepSeek curator in the leninbot repo) keeps enriching sparse cards and registering new people in parallel; when hand-writing sections, check `commulingo_person_sections` for maintainer-created slugs first to avoid duplicating a topic (see `vasily-grossman`/`manuscript-arrest`)
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
  - loads `commulingo_person_roles`, `commulingo_role_categories`, and per-person section counts
  - exports `loadCommuLingoPersonSections(personId)` for detail/API body loads
  - used by runtime public page/API
- `data/commulingo/people-admin-store.js`
  - admin CRUD functions
  - transaction-based writes
  - writes revision snapshots to `commulingo_people_revisions`

Routes and views:

- `routes/commulingo.js`
  - mounts `routes/commulingo-events.js` at `/commulingo/events`; person detail pages query and render their linked events
  - public page and read APIs
  - DB-first load with file fallback
- `routes/commulingo-admin-api.js`
  - admin CRUD API
- `views/public/commulingo-people.ejs`
  - people page SSR template
- `views/partials/commulingo-person-card.ejs`
  - shared person card partial used by the people page and hub pages
- `views/public/commulingo-person.ejs`
  - includes linked historical-event cards when present
- `views/public/commulingo-events.ejs` and `views/public/commulingo-event.ejs`
  - event index and detail page; detail pages list related people with person links
  - person detail page SSR template
  - renders long-form DB sections as localized markdown HTML
- `views/public/commulingo-office.ejs`
  - office hub: localized office header, full office timeline, and matching person cards
- `views/public/commulingo-role.ejs`
  - role-category hub: localized role medal/header and matching person cards
- `data/commulingo/role-icons.js`
  - shared Lucide-style role SVG path map, `roleIconSvg`, and medal hub target helper
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
- `commulingo_role_categories`
- `commulingo_person_sections`
- `commulingo_offices`
- `commulingo_office_rows`
- `commulingo_history_events`
- `commulingo_history_event_people`

Governance/scaffold tables:

- `commulingo_people_revisions`
- `commulingo_agent_suggestions`

`commulingo_agent_suggestions` exists for future AI-agent suggested edits, but there is not yet a complete approval UI/workflow around it.

## Role Categories and Icons

The people page no longer uses emoji role icons. It uses Lucide-style inline SVG paths in `views/public/commulingo-people.ejs`.

Person→role mappings live ONLY in `commulingo_person_roles` (no file copy —
`ROLE_RULES` was removed 2026-07-11; on DB outage the file-fallback path
renders default icons). Offices carry their icon in `commulingo_offices.icon`,
seeded from the `OFFICE_ICON` map in `data/commulingo/people-standard.js`.

Office-less roles now use `commulingo_role_categories`; clients and agents
should send `payload.role.category` for writer-artist / non-Soviet revolutionary /
bloc reformer / Russian republic leader roles, or `payload.role.officeId` for
institution-derived roles. Icons and localized labels are a frontend/runtime
resolution concern, not an API-client concern. Runtime role resolution order:

1. `person_roles.category_id` → category icon and category label
2. legacy `person_roles.icon`, then office icon
3. label fallback: category label → legacy explicit label → office title

`commulingo_person_roles.icon`, `label_ko`, and `label_en` remain in the table
only for backward compatibility with currently deployed code and older clients.
Do not blank them during category backfill. A later manual cleanup can drop or
clear those legacy columns after all deployed readers resolve categories first.
After a `--replace --force`, person roles and detail sections must be restored
from a DB backup; the seed only refills office icons and canonical role
categories. Icon ids, not raw SVG:

- state-security: `eye`
- defence: `star`
- foreign affairs: `handshake`
- ideology/propaganda: `megaphone`
- culture/literature: `paintbrush`
- heavy-military-industry: `factory`
- science/nuclear/space: `atom`
- agriculture: `corn` (Pictogrammers Material Design Icons, Apache-2.0)
- state head: `landmark`
- nationalities/federal: `map`
- party leadership: `flag`
- party secretariat/cadres: `folder`
- head-of-government: `briefcase`
- central-planning: `chart`
- economic management: `coins`
- Comintern: `globe`
- non-Soviet revolutionary: `flame` (accent #9c2d3f; was `rose`/#b84f7a until 2026-07-11)
- socialist-bloc reform leader: `dove`
- imperial establishment and White movement: `crown`
- writer-artist (office-less role, label '작가·예술가'/'Writers and artists'): `feather`
- left opposition (office-less role, label '좌익 반대파'/'Left Opposition'): `git-branch`
- Russian republic leader: `building`
- socialist-bloc leader (office-less role, label '사회주의권 지도자'/'Socialist-bloc leader'): `orbit`

Design decision: do not use swords for defence. The Cheka/security tradition uses the "sword" symbol, so defence currently uses `star` for Red Army association.

## Page Layout Decisions

Current `/commulingo/people` UX:

- `소련 기관별 지도부 타임라인` is collapsed by default.
- Each individual office timeline card inside it is also collapsed by default.
- Each office timeline card includes a small `기관 페이지 →` / `Office page →`
  link to `/commulingo/offices/:officeId`.
- People groups are collapsed by default.
- Group headers have hover/focus background and border changes to show clickability.
- People cards are max two columns on desktop.
- People cards collapse to one column under the existing mobile breakpoint.
- `moment` renders as an optional restrained pull-quote between the epithet and bio when non-empty.
- Cards are summaries and the whole card is clickable to `/commulingo/people/:personId`.
  Progressive enhancement keeps the person name as a real `<a>` so navigation
  works without JavaScript; a delegated click handler navigates from the rest of
  the card unless the click starts inside an anchor, the career accordion
  (`details.commu-person-more`), the role medal, or the user is selecting text.
- Cards no longer render the old `자세히 →` / `Details →` link; people without
  detail sections still navigate to their detail route.
- Role medals now link to hub pages instead of in-page office anchors:
  `role.officeId` → `/commulingo/offices/:officeId`,
  `role.categoryId` → `/commulingo/roles/:categoryId`, and fallback crown/help
  medals remain non-links.
- Person detail pages reuse the card header language, show the full career
  timeline, and render localized markdown sections with anchors `s-<slug>`.
- Empty localized section bodies are skipped on the detail page and API.
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
  - object: prefer `{ category }` for office-less roles or `{ officeId }` for
    institution roles; `category` must exist in `commulingo_role_categories`
    and `officeId` must exist in `commulingo_offices`
  - legacy `{ icon?, officeId?, label? }` remains accepted for back-compat, but
    new clients and agents should not send icons for office-less categories
  - when `category` is sent, the admin store writes `category_id`, clears
    `office_id`, and writes empty legacy icon/label columns
- Person section endpoints:
  - `GET /commulingo/admin/api/people/:personId/sections`
  - `GET /commulingo/admin/api/people/:personId/sections/:slug`
  - `PUT /commulingo/admin/api/people/:personId/sections/:slug`
  - `DELETE /commulingo/admin/api/people/:personId/sections/:slug`
  - section payload: `{ heading: {ko,en}, body: {ko,en}, sortOrder, sources: [] }`
  - writes are transactional and snapshot `entity_type='person'` revisions with
    notes such as `upsert section <slug>` / `delete section <slug>`
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
