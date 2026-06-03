# CommuLingo Concept Summary TODO

Created after the first concept-summary cleanup pass. The current data validates, and the worst generic phrases have been removed. Remaining work is quality improvement: replacing generic card titles such as `분석 대상 / 구분할 점 / 다음 연결` with chapter-specific beginner-facing concept cards.

## Current status

- Local commit exists: `8742d1d Improve CommuLingo concept summaries`.
- Push failed because GitHub SSH auth returned `Permission denied (publickey)`.
- Validation command passes: `node scripts/validate-commulingo.js`.
- No remaining banned phrases found in concept maps: `피해야 할 오해`, `Misconception to avoid`, `tautology`, `tauntology`, and prior generic filler patterns.

## Completed in follow-up pass

- Capital Volume I ch04 and ch11 were rewritten with direct notation/formula cards.
- Capital Volume II ch01-ch07 were rewritten around circuit notation, turnover time, and circulation-cost distinctions.
- Capital Volume II ch20-ch21 were rewritten around Department I/II and reproduction scheme conditions.
- Capital Volume III ch08-ch12 were rewritten around capital composition, average profit, production price, market-value, wage changes, and the transition to the falling-rate analysis.
- Capital Volume III ch16-ch23 were rewritten around commercial capital, commercial profit, money-dealing capital, interest, interest rate, and profit of enterprise.
- Capital Volume III ch27-ch32 were rewritten around credit, bank capital, fictitious capital, money-capital, real capital, and claims.
- Capital Volume III ch37-ch52 were rewritten around differential rent, absolute rent, land price, capitalist rent, trinity formula, income forms, distribution relations, and class.
- Remaining generic concept-card titles were removed across Capital Volumes I-III.

## Priority 1: Formula and notation chapters

These should use cards that explain symbols, formulas, and category relations directly.

- Capital Volume I
  - DONE ch04 `자본의 일반 공식`: explain `M-C-M'`, `M' = M + ΔM`, and why money becomes capital only in this circuit.
  - DONE ch11 `잉여가치율과 잉여가치량`: separate rate `s/v` from mass `S`; explain why capital needs both high exploitation and enough workers.
  - ch18 `잉여가치율의 여러 공식`: already improved, but should be cross-checked against ch08-ch11 notation.

- Capital Volume II
  - DONE ch01-ch04: explain circuit notation `M-C...P...C'-M'`, `P...C'-M'-C...P`, and `C'-M'-C...P...C'`.
  - DONE ch05-ch07: tighten production time, circulation time, and circulation cost distinctions.
  - DONE ch20-ch21: ensure reproduction scheme cards define Department I, Department II, simple reproduction, expanded reproduction, and exchange conditions.

- Capital Volume III
  - DONE ch08-ch12: replace remaining generic cards with average profit / production price / market value concepts.
  - DONE ch16-ch23: explain commercial capital, commercial profit, interest, profit of enterprise, and `M-M'` as terms, not just chapter links.
  - DONE ch27-ch32: explain credit, bank capital, fictitious capital, money-capital, real capital, and claims.
  - DONE ch37-ch47: explain differential rent I/II, absolute rent, land price, and capitalist rent forms.
  - DONE ch48-ch52: explain the trinity formula, income forms, distribution relations, and class categories.

## Priority 2: Replace generic card titles

DONE. Remaining chapters with useful but generic card labels were rewritten so each card title itself teaches the concept.

Examples of the target style:

- Instead of `분석 대상`: `불변자본 c`, `부문 I`, `상업이윤`, `차액지대 I`.
- Instead of `구분할 점`: `가변자본 v`, `부문 II`, `평균이윤과 생산가격`, `절대지대와 차액지대`.
- Instead of `다음 연결`: use a concrete card such as `공식 읽기`, `왜 중요한가`, `다음 계산`, or `현대적 착시`.

## Priority 3: Chapter groups to review manually

- Volume I ch04-ch07: value-form to capital and labor-power transition.
- Volume I ch12-ch15: relative surplus-value, cooperation, manufacture, machinery.
- Volume I ch19-ch24: wage-form and accumulation.
- Volume I ch26-ch33: primitive accumulation and colonial theory.
- Volume II ch01-ch07: circuits, time, and circulation costs.
- Volume II ch20-ch21: simple and expanded reproduction schemes.
- Volume III ch08-ch12: average profit and prices of production.
- Volume III ch16-ch24: commercial capital and interest-bearing capital.
- Volume III ch27-ch36: credit, bank capital, fictitious capital, money-capital vs real capital, world money.
- Volume III ch37-ch52: rent, trinity formula, revenues, and classes.

## Verification checklist for each pass

1. Run `node scripts/validate-commulingo.js`.
2. Search for generic or banned text:
   - `피해야 할 오해`
   - `Misconception to avoid`
   - `발판이다`
   - `분석 대상과 핵심 구분`
   - `연결점은`
   - `tautology` / `tauntology`
3. Spot-check one API route per edited group, e.g. `/commulingo/lesson/capital-v3-ch21-basic`.
4. Keep edits content-only in `data/commulingo/lessons.json` unless updating this TODO.
