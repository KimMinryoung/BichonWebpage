# CommuLingo People Dictionary Handoff

Last updated: 2026-09-07

Current editing work: [implementation checklist](commulingo-people-editing-plan.md).
Storage and recovery: [operations reference](commulingo-database.md).

This note is for the next person or AI agent continuing work on `/commulingo/people`.

## Structured name parts — added 2026-07-24

`commulingo_people` now stores names as parts: `given_name_ko/en`,
`family_name_ko/en`, with the patronymic staying in
`commulingo_person_patronymics`. `name_ko/en` remain as the DERIVED full name
(using citizenship-based order, patronymic never embedded) and are recomputed
when names or citizenship change — do not write them independently.

Admin API (`POST/PATCH /commulingo/admin/api/people`):
- Preferred payload: `givenName: {ko,en}`, `familyName: {ko,en}`,
  `patronymic: {ko,en}`. Non-Russian-style names simply omit `patronymic`.
- Legacy `name: {ko,en}` is still accepted and split using the citizenship-based
  order; single-token names (김일성, 카모) go wholly to familyName. Prefer explicit
  parts for compound surnames.
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

**Enforcement:**

- `data/commulingo/native-script.js` — `NATION_SCRIPTS` (nationality code →
  allowed scripts) plus `checkNativeScript()`. Single source of the rule.
- `data/commulingo/people-admin-store.js` — create/update run
  `assertNativeScript()` and return HTTP 400 with the rule in the message.
  Payload alias `nativeName` / `nativePatronymic` is accepted for the same
  columns; `nativeScriptOverride: true` is the deliberate escape hatch. The same
  store now also reads and writes `citizenship` / `nationalOrigin`
  (`{code, label}`); legacy `origin` remains a compatible alias.
- leninbot `runtime_tools/commulingo_people.py` — `_NATION_SCRIPTS` and
  `_check_native_script()` support legacy normalization; active person writes
  use the JS validator through the shared service. Tool descriptions carry the rule.
- `data/commulingo/person-card-validation.js` — card-label rules (fate label is a
  short label, not a sentence; citizenship/origin labels are nations, not
  birthplaces). `createPersonAdmin` additionally requires a `role`. Enforced on
  write by the store and re-checked by `scripts/audit-person-card-fields.js`
  (exit 1). New people go through `scripts/commulingo-people-upsert`, which
  calls the store from inside the container; migration 167 (2026-09-05,
  voldemar-ulmer: no role row, sentence fate label, birthplace origin) is the
  hand-SQL failure that motivated both.
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
| Still living | Empty fate kind/labels; use an open life-year range such as `1987–` |

Char limits: **22 KO / 50 EN** (fits compound political+cause labels; rejects
mini-sentences — put burial, prison names, etc. in bio or sections).

**Where it is enforced (keep all three in sync):**

- `data/commulingo/people-standard.js` → `normalizeFateLabel(label, deathYear)`
  strips the death year (handles `년`, parens, full dates, legacy `d.`) while
  preserving political-event years. The frontend admin store
  (`people-admin-store.js`) runs create/update fate labels through it.
- leninbot `runtime_tools/commulingo_people.py` → `_normalize_fate_label` is the
  compatibility helper; active writes use JS normalization and the shared
  22/50 write limits. Tool descriptions carry the vocabulary guide.
- `scripts/one-off/normalize-commulingo-fate-db.js` was the one-off that normalized all
  535 existing DB rows to this standard (dry-run by default; `--apply` writes).

## Serving from a local snapshot — added 2026-07-14

The people dictionary lives in local PostgreSQL. The site serves the in-memory
copy of an atomically written JSON snapshot at `data/commulingo/people-snapshot.json`.
The DB is the source of truth; the snapshot is a derived cache retained across restarts.

- `people-store.js` refreshes on a background timer (`COMMULINGO_PEOPLE_REFRESH_MS`,
  default 60000 ms), or on demand when no snapshot exists.
- Frontend Admin commits request a refresh. External writers are picked up by
  periodic refresh; client/CDN caches can add their own delay.
- Force a rebuild using `npm run commulingo:people:snapshot` inside the frontend
  container. Keep the last valid snapshot during DB outages.
- See [storage and recovery](commulingo-database.md) for signature checks,
  consistent snapshots, and transaction/cache ownership.

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

## AI Agent Editing

Python `runtime_tools/commulingo_people.py` exposes target-specific person create/update
and section save tools. Person reads and writes call the frontend's private
`scripts/commulingo-person-service.js` through `docker exec` with JSON stdin.
Admin HTTP, upsert CLI, automatic edits and suggestion approvals all use
`data/commulingo/person-editorial-service.js` and the Admin stores. There is no
Python SQL fallback for people or their sections. Office/event/term tools retain
their own stores and acquire the same transaction advisory lock before validation.

`config/commulingo_people.json` controls direct_apply. True applies ordinary
validated changes; false stages them. Deletions, large text cuts, source conflicts
and uncertain identity always stage for review. Confidence is recorded, never used
as an approval threshold. Pending is a successful maintainer terminal with no
content change. Approve/reject through `scripts/commulingo_suggestions.py`; approval
requires a note and the original revision must still match.

The tool boundary remains restricted to authorized internal agents. The bridge
adds no public HTTP or MCP write endpoint. KG reference facts on Python reads
remain best effort. Snapshot refresh is normally 60 seconds, plus client/CDN delay.

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

Counts and coverage change with curator edits; inspect the current snapshot or DB
when they matter. Person detail sections are stored in `commulingo_person_sections`.
Event relationships live in `commulingo_history_event_people` and use leader,
participant, executor, target, opponent, or witness as relation kinds. Check existing
section slugs and topics before adding another section to avoid duplicate coverage.
Maintainer selection and schedules are defined in the leninbot repository; see the
[editing plan](commulingo-people-editing-plan.md) for the inspected rules.

Event grouping and country tags:

- event clusters and country tags (2026-09-06): an overview event may carry `relations.parent` on its detail documents (civil war → six borderland/aftermath documents, migration 164; the people's democracies of 1944–1949 → Poland, Romania, Bulgaria, Hungary, migrations 168–173). Children and siblings are derived from the snapshot in `event-relations.js`, so the panel lists the cluster without reciprocal rows. A timeline entry may carry `country` (one flag code from `flag-icons.js` or a list); `event-countries.js` normalises it, the panel prints the flags beside the date and, when two or more countries appear, a chip row that filters the list and dims the map badges (`public/js/commulingo-event-timeline.js`). Unknown codes are dropped on the page and reported by `audit-event-locations.js`. Multi-country prose stays by phase; the section headings name the country (`발트 독립전쟁` pattern) so one country reads as a contiguous run, and a heading may end in `{estonia}` / `{uk finland}` to print those flags in the heading and the contents list (stripped before rendering; unknown codes audited). The first date in every section carries its year, since a reader may land on the section from the contents list.

Event sources may be book citations as well as URLs; non-URL references render as text.

Current people groups:

- `old-regime`
- `bolshevik`
- `international-revolutionary`
- `stalin-era`
- `thaw`
- `perestroika`

`international-revolutionary` holds non-Soviet revolutionaries (Luxemburg, Liebknecht, Gramsci, Mao, Guevara, ...). It renders LAST, under its own '소련 밖의 혁명가들' section heading, independent of the Soviet-era sequence (sort_order 99; standalone list in commulingo-people.ejs). Convention: their `cyrillic` column carries the NATIVE-script name instead (毛泽东, Hồ Chí Minh, Amílcar Cabral, ...).

## Key Files

Data and normalization:

- `data/commulingo/people-standard.js`
  - normalization layer used by SSR and APIs
  - validator lives here
- `data/commulingo/people-store.js`
  - reads normalized DB tables into the public dictionary shape
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
  - shared snapshot-backed reads
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
Validation and writes:

- `scripts/commulingo-people-upsert` — validated create/update and optional sections;
  use `--dry-run` to validate and roll back.
- `scripts/audit-person-card-fields.js`, `scripts/audit-person-native-names.js`,
  `scripts/audit-person-patronymics.js`, `scripts/audit-person-name-order.js` — audits.

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

`commulingo_agent_suggestions` records AI edits and pending suggestions. The
leninbot CLI provides approval/rejection; the direct_apply setting controls
immediate application for the generic AI write tools.

## Role Categories and Icons

The people page no longer uses emoji role icons. It uses Lucide-style inline SVG paths in `views/public/commulingo-people.ejs`.

Person→role mappings live in `commulingo_person_roles`. During DB outages the
last valid snapshot preserves the loaded roles. Offices carry their icon in `commulingo_offices.icon`,
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
Use icon ids, not raw SVG:

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
  - section payload: `{ expectedRevision, heading: {ko,en}, body: {ko,en}, sortOrder, sources, evidence }`
  - writes are transactional and snapshot `entity_type='person'` revisions with
    notes such as `upsert section <slug>` / `delete section <slug>`
- AI direct/staged behavior follows the leninbot configuration described above.

## Partial edits and section recovery (2026-09-07)

The frontend Admin store and its upsert CLI preserve omitted languages in
name parts, legacy full names, bio, epithet, moment, fate labels and nationality
labels. A legacy plain string patches Korean only. Empty strings explicitly
clear a language; nullable text fields accept null to clear both languages.
Names must still resolve to nonempty KO and EN values. A changed citizenship
recomposes full names and resets nationality labels to the new code's defaults.

`aliases: {ko: [...]}` replaces only the Korean list and preserves English;
use an empty array to clear that language. Career/scenes and role objects retain
their existing whole-field semantics; use the individual collection operations
below to edit one alias, career or scene. Python uses this same merge contract.

Section upsert (the existing PUT endpoint and CLI) now preserves omitted
heading/body languages and sortOrder. Every edit requires nonempty source references;
empty sources are rejected. Existing section revisions retain their person before/after
shape and add `sectionBefore` / `sectionAfter`, including slug, heading, body,
sources, ordering and timestamps. A new section has sectionBefore=null; a
deleted section has sectionAfter=null.

To undo a section edit or deletion, read that revision's sectionBefore and pass
it, with supporting evidence and nonempty sources, to the same section upsert endpoint, or as an entry in the upsert CLI's
`sections` array for that person. This restores content, sources and ordering;
normal createdAt/updatedAt timestamps are assigned by the store. Read the current person revision before restoring and submit it as
expectedRevision to reject intervening edits.
Older revisions without sectionBefore cannot recover content they never stored.
New whole-person deletion revisions also retain raw sections in before.sections.
Restoration must reconstruct a valid create payload and use the Admin service;
there is no blind restore endpoint and historical missing data is not reconstructed.

## Individual collection edits and edit versions (2026-09-07)

Read `GET /commulingo/admin/api/people/:personId` for the current person,
career row IDs and `person.revision`. Submit the returned token unchanged:

```json
{
  "expectedRevision": "<person.revision from GET>",
  "sources": ["Archive reference, section 2"],
  "aliasEdits": [{"op": "add", "lang": "ko", "value": "새 별칭"}],
  "careerEdits": [{"op": "update", "id": "123", "entry": {"r": {"ko": "수정 직책"}}}],
  "sceneEdits": [{"op": "remove", "scene": ["collection-id", "episode-id"]}]
}
```

Send to the person PATCH endpoint, or use the same fields in an existing-person
entry of the upsert CLI. `123` is an example; use an actual row ID from GET.

| Field | add | update | remove |
| --- | --- | --- | --- |
| aliasEdits | lang + value | lang + value + replacement string | lang + value |
| careerEdits | entry: {y?, r:{ko,en}} | id + entry containing y and/or r | id |
| sceneEdits | scene: [collectionId, episodeId] | scene + replacement pair | scene |

Each operation requires op. Operations run in array order, at most 100 per
field per request. New careers append at the end; existing career IDs and
ordering survive individual updates. KO/EN role patches preserve the other
language; the resulting edited career role must have both languages. IDs must
belong to the person. Duplicate aliases/scenes, missing targets, unknown keys,
and mixing aliases/aliasEdits (or career/careerEdits, scenes/sceneEdits) are 400
errors, detected before modifying the person. Creates use the existing full
fields and reject the new update-only operation fields.

The revision token covers persisted person and owned child rows, including
sections and office rows, and is read in the same repeatable-read transaction
as the person. It does not cover shared category/office definitions or event
relationships. Do not parse or construct a token. A fresh person read returns
the current token; section writes return the next token as section.revision.
The section read endpoints retain their old shapes: read the person first when
preparing a section edit.

Person PATCH and section PUT accept expectedRevision in their body. Person
and section DELETE also accept it in the JSON body (store callers put it in
options). The check runs after acquiring the existing person row lock. A
mismatch returns HTTP 409 with code=revision_conflict and currentRevision;
reload, reconcile the content and retry intentionally. Do not blindly resubmit
the old payload with the new token. No data or revision row is written on conflict.

The token is mandatory for all existing-person and section writes, including
section creation. Missing tokens return 428; stale tokens return 409. New-person
creation is the only exception. Admin and Python writes acquire the transaction
advisory lock `commulingo-editorial-write`, then person/suggestion row locks.
Direct SQL is outside this supported contract. Old pending suggestions without
versions must be rejected and researched/resubmitted against a fresh read.

For a CLI transaction updating a person and several sections, place the original
expectedRevision on the person entry, and omit it on its sections: the person
check and lock cover that transaction. Reusing the original token on every
section would conflict with earlier changes in the same batch.

## Common Workflows

Register or update through the Admin store, including optional detail sections:

```bash
scripts/commulingo-people-upsert /tmp/people-spec.json --dry-run
scripts/commulingo-people-upsert /tmp/people-spec.json --changed-by maintainer
```

Validate code with `npm test`. Database write tests must use an isolated copy;
see [storage and validation](commulingo-database.md).

Refresh the public snapshot where the DB is reachable (inside the frontend container):

```bash
npm run commulingo:people:snapshot
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

The frontend and local `leninbot-pg` must share:

- `leninbot_default`

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

## Current Improvement Work

See the [editing implementation checklist](commulingo-people-editing-plan.md)
for partial-update safety, revision recovery, shared validation, enrichment
completion states and claim-level sources. Checkboxes distinguish proposals
from implemented and verified work.

## Useful Commit Trail

Recent commits in this line of work:

- `46c9d61` Move CommuLingo people data to Postgres
- `4aac062` Add CommuLingo people admin CRUD API
- `8bc8ab9` Map remaining CommuLingo people roles
- `4910a25` Use SVG role icons for CommuLingo people
- `19a0bd8` Collapse CommuLingo people groups by default
- `155719b` Clarify clickable CommuLingo people groups
- `38cc6ba` Tighten CommuLingo people page accordions

## Editorial provenance, review and enrichment

The shared contract is `data/commulingo/person-editorial-contract.json`; Python
loads the same JSON for tool length hints. Writes require nonempty sources.
Changes to bio, moment, years, citizenship, nationalOrigin/origin or section body
also require evidence per field: `{field, claim, source, locator, excerpt?, stance?}`.
The source must occur in sources and locator identifies a page or section.
Stance is supports/disputes. This validates provenance structure, not the historical
truth of the quotation or claim. Existing claims are not automatically backfilled.

`reviewFlags` accepts source_conflict/identity_uncertain. A disputes claim, any
deletion, or a bio/body cut below 60% of a previous text of at least 120 characters
creates a pending suggestion (HTTP 202) without changing content or evidence.
Approval revalidates and atomically writes content, evidence, revision and suggestion.
`POST /commulingo/admin/api/people-suggestions/:id/review` takes `{approve, note}`.
Identity collisions by normalized name/alias are rejected unless an explicit
identity_uncertain review is staged and subsequently approved.

`PUT /commulingo/admin/api/people/:personId/enrichment/:topic` takes
`{expectedRevision, status, reason, sources}`. Topics are basics, nationality, bio,
moment, events, sections. States: open, complete, not_applicable, sources_unavailable.
Complete/not_applicable revisit after 180 days; sources_unavailable after 90 days.
New content or claim evidence reopens related topics. Pending suggestions exclude
the person from automatic enrichment. Selection prioritizes basic gaps, missing
claim evidence and untranslated text before nationality, moment and missing topics.
Graph relation counts do not set prominence; 12 sections is a ceiling, not a goal.

Migration 176 creates append-only evidence history and per-topic enrichment state.
See [database operations](commulingo-database.md) for rollout and rollback.

## Automatic review operations

The Python timer-owned `commulingo_reviewer` researches pending proposals independently.
It can recommend approve/reject/escalate but has no dictionary write tool. The runner verifies
retrieved quotations and risk coverage, then calls the same shared approval service.
Unresolved cases reach the single Telegram owner; `/commulingo_review list`, `show ID`,
`approve ID REASON`, `reject ID REASON`, and `retry ID` provide the complete handoff path.
The review runs every 15 minutes, one proposal per invocation, under the shared daily budget.
Migration 177 persists leases, decisions, retries and notification delivery state.
See leninbot `dev_docs/commulingo_editorial.md` for current scheduling, limits and recovery.
