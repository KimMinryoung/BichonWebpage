# Person life dates and fate

`years`/`years_label` is a date range, shared by both languages:

- Living, known birth year: `1987–`.
- Living, unknown birth year: `?–`.
- Deceased, known dates: `1929–2018`.
- Unknown death date/status: `1885–?`; both dates unknown: `?–?`.
- An absent date label may be empty. Uncertain historical dates such as
  `1889–1958?`, `1856/1857–1882` and `1879 – 1944 이후` remain supported.

Do not put `현재`, `현대`, `present`, `생존` or activity descriptions in dates.
A missing numeric `death_year` does **not** prove that someone is living.
The open-ended range is the explicit living marker. Numeric endpoints are
parsed independently; a living person's known birth year must be retained.

Living people have an empty fate kind and both labels empty. In API requests,
use `fate: null`. When changing a deceased/unknown record to living, clear its
fate in the same request as the date change. Political events and later work
belong in the biography/career, not in a living person's fate badge.

Do not infer a death cause from the fact of death. A sourced death without a
known cause may use an empty kind and `사망` / `Died`.

The shared `person-life-years.js` rules protect API create/PATCH and normalize
old snapshots when read. Schema migration 167 protects direct SQL writes as
well, including consistency between the label and numeric year columns.
`scripts/audit-person-card-fields.js` checks all records and runs after deploy.
`scripts/smoke-commulingo-person-life-years.js` runs in `npm test`.
`scripts/test-commulingo-person-life-db.js` rehearses migration 167 and tests
constraints on temporary copies of live metadata, then rolls back.

## Repair on 2026-09-06

Audited all 2,197 records. Migration 167 repairs life metadata on 180 records,
including empty birth-year columns caused by the old all-or-nothing parser.
The existing revision table retains before/after values. Unknown birth years
are not guessed; the records previously marked only `현재`/`현대` become `?–`.

Two factual corrections have specific sources:

- Alexei Safronov: `1987–`, no fate. He gives his birth year in
  [his interview](https://pchela.media/safronov/), also recorded in the
  [NLO interview introduction](https://nlobooks.ru/article/15303/).
- Vladimir Treml: `1929–2018`, replacing the erroneous `1932–` / living label.
  [The funeral notice](https://www.walkersfuneralservice.com/obituaries/vladimir-treml)
  provides both years; [Duke's memorial](https://econ.duke.edu/news/memoriam-vladimir-g-treml)
  corroborates the death year. The sources differ on the day of death, which
  this card does not store; neither is used to invent a cause of death.
