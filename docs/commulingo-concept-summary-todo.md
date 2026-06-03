# CommuLingo Concept Summary Cleanup

This document records the concept-summary cleanup for CommuLingo Capital chapters.

## Current status

- Status: complete for the requested cleanup scope.
- Local commits:
  - `8742d1d Improve CommuLingo concept summaries`
  - `90dc277 Continue CommuLingo concept summary cleanup`
  - `3018f54 Finish CommuLingo concept card cleanup`
- Push status: not pushed. `git push` failed because GitHub SSH auth returned `Permission denied (publickey)`.
- Validation command passes: `node scripts/validate-commulingo.js`.
- Generic/banned concept-card patterns remaining: 0.

## Completed scope

- Removed misleading/generic cards such as `피해야 할 오해`, `Misconception to avoid`, `발판이다`, `연결점은`, and tautology/tauntology-style filler.
- Replaced generic card titles `분석 대상 / 구분할 점 / 다음 연결` and `Object of analysis / Key distinction / Next link` with chapter-specific concept labels across Capital Volumes I-III.
- Rewrote formula and notation-heavy chapters with beginner-facing explanations of symbols and category relations.
- Spot-checked local API output for representative edited lessons.

## Completed chapter groups

- Capital Volume I:
  - value-form to capital and labor-power transition
  - surplus-value rate and mass
  - relative surplus-value, cooperation, manufacture, machinery
  - wage-form chapters
  - reproduction, accumulation, primitive accumulation, and colonial theory
- Capital Volume II:
  - circuits of capital
  - production time, circulation time, turnover time, circulation costs
  - fixed/circulating capital and turnover categories
  - simple and expanded reproduction schemes, Department I/II
- Capital Volume III:
  - cost-price, profit, profit rate, turnover, constant-capital economy, price changes
  - average profit, prices of production, market-value, wage changes
  - commercial capital, commercial profit, money-dealing capital
  - interest-bearing capital, interest, profit of enterprise, `M-M'`
  - credit, bank capital, fictitious capital, money-capital vs real capital
  - world money, usury capital
  - differential rent I/II, absolute rent, land price, capitalist rent
  - trinity formula, income forms, distribution relations, classes

## Verification checklist

Use this if future edits touch `data/commulingo/lessons.json`:

1. Run `node scripts/validate-commulingo.js`.
2. Check for banned/generic patterns:
   - `피해야 할 오해`
   - `Misconception to avoid`
   - `발판이다`
   - `분석 대상과 핵심 구분`
   - `연결점은`
   - `tautology` / `tauntology`
   - `분석 대상` / `구분할 점` / `다음 연결`
   - `Object of analysis` / `Key distinction` / `Next link`
3. Spot-check one API route per edited group, e.g. `/commulingo/lesson/capital-v3-ch21-basic`.
4. Keep content edits scoped to `data/commulingo/lessons.json` unless intentionally updating this note.
