# Genealogy person-node handoff

Written 2026-08-02. Hand-off for the next session.

> **COMPLETED 2026-08-02.** All fifteen person refs are repointed; no chart node
> refs a person any more. Eleven new term entries were written
> (`first-international`, `anti-authoritarian-international`,
> `second-international`, `comintern`, `fourth-international`, `menshevik`,
> `vpered`, `mezhraiontsy`, `new-opposition`, `revisionism`, `maoism`) plus one
> history event (`tito-stalin-split`, modelled on `sino-soviet-split`). The
> `fourth-intl` nodes point at the new plain `fourth-international` entry, not
> `fourth-international-splits`. Person pages now render the shared genealogy
> partial (`routes/commulingo.js`, `views/public/commulingo-person.ejs`).
> Alias cleanup done during the link audit: bare 수정주의/revisionism moved off
> `reformism` to the new entry; over-broad bare aliases deleted per the 격리
> precedent (개조 from `perekovka`; 정상화/normalization/normalisation from
> `normalization-czechoslovakia`). Node labels still carry the personal names
> (「볼셰비키 (레닌)」); dropping them is a pending content decision.

## The problem

Genealogy charts (`/commulingo/genealogy`) attach each node to a dictionary
entry through `node.ref = { type: 'term' | 'person' | 'event', id }`. Fifteen
nodes across two charts are about an organisation or a current, not a person,
but were given a `person` ref because no term or event entry for the subject
existed at the time. The chart node reads 「볼셰비키 (레닌)」 and clicking it
lands on Lenin's biography.

Two consequences:

1. The link is wrong for the reader. The node is the Bolshevik faction, not Lenin.
2. Person pages therefore have **no** genealogy section. Term pages and event
   pages got one on 2026-08-02 (`d2dbfe0`, `0fc3dbd`); people were deliberately
   left out, because the section would tell Lenin's page that Lenin is the node
   「코민테른」. Once the refs below are repointed, adding the section to person
   pages is three lines and is the natural closing step of this work.

## Task 1: repoint the three nodes that already have a target

Entries that exist today and match the node exactly. Data-only, no deploy.

| Chart file | Node id | Node label | Current ref | Change to |
| --- | --- | --- | --- | --- |
| `russian-marxism.json` | `emancipation-labour` | 노동해방단 (플레하노프) | `person/plekhanov` | `term/emancipation-of-labour` |
| `russian-marxism.json` | `bolsheviks` | 볼셰비키 (레닌) | `person/lenin` | `term/bolshevik` |
| `russian-marxism.json` + `internationals.json` | `fourth-intl` (in both) | 제4인터내셔널 | `person/trotsky` | `term/fourth-international-splits` |

`fourth-international-splits` (제4인터내셔널의 분열과 재통합) is about the
splits rather than the founding, so read it first and decide whether it is the
right target or whether task 2 should write a plain 제4인터내셔널 entry instead.

Consider dropping the personal name from the node labels once they no longer
point at a person (「볼셰비키 (레닌)」 → 「볼셰비키」). The names were there to
explain where the link went. Ask before changing labels; they are content.

## Task 2: write the twelve missing entries, then repoint

No entry exists for these. Each needs a dictionary entry written first, then the
node ref changed. Ordered roughly by how much of the chart they unblock.

| Chart | Node id | Node label | Period on the chart | Note |
| --- | --- | --- | --- | --- |
| internationals | `iwa` | 제1인터내셔널 (마르크스) | 1864–1876 | `anarcho-syndicalist-iwa` is the 1922 syndicalist IWA, a different body. Do not reuse it. |
| internationals | `second-intl` | 제2인터내셔널 (카우츠키) | 1889–1916 | `socialist-international` is the post-1951 body, `labour-and-socialist-international` the 1923–1940 one. Neither fits. |
| internationals | `comintern` | 코민테른 (제3인터내셔널) | 1919–1943 | Exists as an **office** (`/commulingo/offices/comintern`), which a node ref cannot address: ref types are term / person / event only. Either write a term entry or extend the ref types (`refHref` in `data/commulingo/genealogy-svg.js`). |
| internationals | `bakuninists` | 반권위주의 인터내셔널 (바쿠닌) | 1872–1877 | |
| internationals | `revisionism` | 수정주의 논쟁 (베른슈타인) | 1896–1903 | `reformism` (개량주의) exists and is close but not the same subject. |
| internationals | `tito-split` | 티토의 독자 노선 | 1948 | Could be a history event rather than a term. `sino-soviet-split` is the model to follow. |
| internationals | `maoist` | 마오주의 국제 운동 | 1960년대– | |
| russian-marxism | `mensheviks` | 멘셰비키 (마르토프) | 1903–1921 | `menshevik-defencists-internationalists` covers the 1914 split inside Menshevism, not the faction itself. |
| russian-marxism | `vpered` | 전진파 (보그다노프) | 1909–1913 | |
| russian-marxism | `mezhraiontsy` | 메즈라이온파 (트로츠키) | 1913–1917 | |
| russian-marxism | `new-opposition` | 신반대파 (레닌그라드파) | 1925–1926 | `united-opposition` (통합반대파, 1926–27) is the successor, not this. |
| both | `fourth-intl` | 제4인터내셔널 | 1938– | Only if task 1 decides `fourth-international-splits` is the wrong target. |

## How to do the work

### Editing a chart

`data/commulingo/genealogy/*.json` is host-mounted and cached by file mtime, so
a ref change is live on the next request. Commit and push; no deploy.

Validate before committing:

```sh
python3 -c "
import json,glob
for f in glob.glob('data/commulingo/genealogy/*.json'):
    d=json.load(open(f)); ids={n['id'] for n in d['nodes']}
    print(f, len(d['nodes']),
          'bad edges', [(e['from'],e['to']) for e in d['edges'] if e['from'] not in ids or e['to'] not in ids],
          'no ref', [n['id'] for n in d['nodes'] if not n.get('ref')])
"
```

A ref id that does not exist still renders as a link and 404s on click, so check
every ref against the database after editing:

```sh
docker exec leninbot-pg psql -U postgres -d leninbot -tAc \
  "SELECT id FROM commulingo_terms WHERE id IN ('bolshevik','emancipation-of-labour');"
```

### Writing a dictionary entry

Entries live in `leninbot-pg`, not in the repo. `data/commulingo/terms-snapshot.json`
is a git-ignored cache the app rewrites from the DB every 60 seconds; editing it
does nothing. Insert with SQL, in this order, or foreign keys fail:

1. all `commulingo_terms` rows first (a `related` row cannot reference an entry
   that has not been inserted yet),
2. then `commulingo_term_aliases`, `commulingo_term_relations`,
   `commulingo_term_people`, `commulingo_term_events`.

`sort_order` is append-only in steps of 10; take `max(sort_order)` and add.
Relations are directional and not auto-mirrored: insert both ways where both
entries should list each other. Body text is markdown (`utils/markdown.js`:
headings, tables, lists, `**bold**`; `[[wikilinks]]` are **not** supported).

Cross-entry links are automatic: write the plain headword or an alias in prose
and `linkify` links its first occurrence on the page. This is also where the
mistakes come from. After writing, open the page and read every link:

```sh
node - <<'EOF'
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ extraHTTPHeaders: { 'Accept-Language': 'ko-KR,ko;q=0.9' } });
  await p.goto('http://127.0.0.1:3000/commulingo/terms/<id>', { waitUntil: 'domcontentloaded' });
  console.log(await p.$$eval('.commu-person-markdown a',
    els => [...new Set(els.map(e => e.textContent.trim() + ' -> ' + e.getAttribute('href')))]));
  await b.close();
})();
EOF
```

Three real mislinks were caught this way on 2026-08-02: 격리 → 쿠바 해상 격리
(fixed by deleting the over-broad bare alias 격리 from `naval-quarantine`),
넵스키 → 블라디미르 넵스키 (fixed by writing 알렉산드르 넵스키 in full, which
is already in `commulingo_link_blocklist`), 소련 인민 → 소비에트 인민 (fixed by
rewording to 소련 여러 인민). Note that the blocklist is applied by
`people-linkify.js` only: it cannot suppress a *term* alias, so a bad term alias
has to be deleted or the prose reworded.

Content rules that apply to every entry: no em dashes; write for a reader new to
socialism (question-form subheadings); no length limit, and contested subjects
should be longer with both readings given; explain Soviet doctrine on its own
terms first, then the scholarly assessment.

### Adding the section to person pages (after task 1 and 2)

`data/commulingo/genealogy-links.js` already takes the ref type as an argument.
Mirror what `routes/commulingo-terms.js` and `routes/commulingo-events.js` do:

1. `genealogies: genealogyLinksFor('person', personId, lang)` in the person route,
2. `<%- include('commulingo-genealogy-links', { en, charts: genealogies, headword: person.name }) %>`
   in the person view,
3. deploy (route + view are code: `scripts/deploy`).

Only do this once no node refs a person as a stand-in. Ten of the fifteen point
at Lenin, Trotsky, Marx and others whose pages would otherwise gain a chart
section that misdescribes them.

## State as of this handoff

- Charts: `internationals` (20 nodes), `russian-marxism` (24),
  `soviet-state-ideology` (17), `soviet-nationality-policy` (34).
- Every node in all four charts has a ref; the dashed "아직 사전 항목 없음"
  legend swatch only renders when a chart has a node without one.
- 375 terms in `commulingo_terms`. 60 of them show a genealogy section.
- Relevant commits: `d2dbfe0` (term pages), `0fc3dbd` (event pages, shared
  partial + `genealogy-links.js`), `46955be` (the last batch of new entries).
