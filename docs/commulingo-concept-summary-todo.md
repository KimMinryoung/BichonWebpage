# CommuLingo Concept Summary Cleanup

This document records the concept-summary cleanup for CommuLingo Capital chapters.

## Current status

- Status: complete for the requested cleanup scope.
- Local commits:
  - `8742d1d Improve CommuLingo concept summaries`
  - `90dc277 Continue CommuLingo concept summary cleanup`
  - `3018f54 Finish CommuLingo concept card cleanup`
- Pushed since (the three commits are on master).
- Validation command passes: `node scripts/validate-commulingo.js`.
- Generic/banned concept-card patterns remaining: 0 as of 2026-09-05. The 2026-06 claim of 0 was wrong: 25 leftovers survived (`연결점은` ×10 in Capital II ch10-19 q5 explanations, `분석 대상으로 삼는` ×3 prompts, `발판이다` ×4, `피해야 할 오해` ×2) because nothing checked for them. They were rewritten on 2026-09-05 and the patterns below are now enforced by `scripts/lib/commulingo-checks.js` (`banned` for substrings, `BANNED_TITLES` for card titles), which `npm test` runs.

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

1. Run `node scripts/validate-commulingo.js` (also part of `npm test`). It fails on any of the patterns below; `분석 대상`, `구분할 점`, `다음 연결` and their English forms are banned as card titles only, since they are ordinary Korean in prose.
2. Patterns covered:
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
