# CommuLingo Handoff

## Purpose

CommuLingo is a chapter-by-chapter learning path for visitors who are not already comfortable with Marxist theory. The current public scope is Marx's Capital, volumes 1-3, plus Lenin's Imperialism.

The service should feel like guided study, not an exam ambush. The learner should be able to read a short chapter card, get a concept brief before the quiz, answer five questions, and understand why the distinction matters.

## Current Public Scope

- Capital Volume I: 33 chapters
- Capital Volume II: 21 chapters
- Capital Volume III: 52 chapters
- Lenin, Imperialism: 10 chapters
- Two lessons per chapter:
  - Basic: 5 multiple-choice questions
  - Advanced: 5 multiple-choice questions
- Current totals:
  - 116 chapters
  - 232 lessons
  - 1,160 questions

## Current Files

- Base Capital data: `data/commulingo/lessons.json`
- Additional course modules: `data/commulingo/courses/*.js`
- Data loader: `data/commulingo/index.js`
- Public route and data API: `routes/commulingo.js`
- Page template: `views/public/commulingo.ejs`
- Client UI: `public/js/commulingo.js`
- Styles: `public/css/commulingo.css`
- Content validator: `scripts/validate-commulingo.js`
- Quality audit: `scripts/audit-commulingo-quality.js`
- Progress table migration: `scripts/migrations/005_commulingo_progress.sql`

## Completed Work, May 31 2026

The recent pass changed CommuLingo from a full-question dump page into a lighter chapter learning interface.

Completed content work:

- Published all Capital Volumes I, II, and III chapters.
- Rewrote and improved late Volume III questions, especially chapters 33-52.
- Improved card summaries and learning-focus text for Volume I, Volume II, and earlier Volume III chapters.
- Removed exact duplicate card text such as the old Volume I Chapter 1 repetition.
- Added a validator script for collection counts, lesson counts, question counts, correct-choice-first answers, and known bad phrase checks.

Completed UI work:

- Volume sections initially show only buttons for Volume I, II, and III.
- Clicking a volume expands that volume's chapters.
- The volume containing the most recently selected lesson auto-expands when returning to the lesson list.
- Basic and advanced lessons are no longer separate duplicate cards.
- Each chapter card now shows:
  - chapter title
  - summary
  - learning focus
  - Basic row with progress, question count, and start action
  - Advanced row with progress, question count, and start action
- Completed Basic/Advanced rows get a distinct container background and border, not only a progress bar.
- The old part-level arrow diagram was removed.
- The pre-quiz concept brief now uses explanation blocks rather than a generic A -> B -> C flow.
- Some key chapters have custom concept diagrams, for example:
  - Volume I Chapter 1: use-value, value, and the confusion to avoid
  - Volume I Chapter 16: absolute surplus-value, relative surplus-value, and their common point
  - Volume II Chapter 7: production time, circulation time, turnover time
  - Volume III Chapter 24: M-M', missing production link, fetishism

Completed performance work:

- Server now memoizes the loaded CommuLingo bundle by the maximum mtime across `lessons.json` and `courses/*.js` instead of rebuilding it on every request.
- The initial `/commulingo` HTML embeds only a slim catalog:
  - collection data
  - chapter titles
  - summaries
  - learning-focus text
  - lesson ids and question counts
- The initial HTML no longer embeds question arrays.
- Lesson questions are lazy-loaded from `/commulingo/lesson/:lessonId?v={catalogVersion}` when the learner starts Basic or Advanced.
- `/commulingo/catalog.json` is available for cacheable catalog access.
- Cache policy:
  - unversioned catalog: `public, max-age=3600, stale-while-revalidate=86400`
  - versioned lesson detail: `public, max-age=31536000, immutable`

Production verification from the last deployment:

- Commit: `e8926d1 Cache CommuLingo catalog and lazy-load lessons`
- Production `/commulingo` returned `200`.
- Production initial HTML was about `145,936` bytes.
- Embedded question count in initial HTML was `0`.
- Catalog payload was about `137,362` bytes.
- A single lesson payload was about `10KB`.

## Current Data Shape

Runtime data is loaded through `data/commulingo/index.js`. It combines the base Capital collections in `data/commulingo/lessons.json` with additional course modules from `data/commulingo/courses/*.js`.

Capital still keeps questions directly in `data/commulingo/lessons.json`:

```json
{
  "collections": [
    {
      "id": "capital-vol1",
      "title": { "ko": "자본론 1권", "en": "Capital Volume I" },
      "chapters": [
        {
          "id": "capital-v1-ch01",
          "chapterNumber": 1,
          "title": { "ko": "상품", "en": "Commodities" },
          "summary": { "ko": "...", "en": "..." },
          "learningFocus": { "ko": "...", "en": "..." },
          "lessons": [
            {
              "id": "capital-v1-ch01-basic",
              "level": "basic",
              "title": { "ko": "상품 기본", "en": "Commodities: Basics" },
              "questions": []
            }
          ]
        }
      ]
    }
  ]
}
```

Each question should preserve the existing fields. For multiple-choice questions, source data must keep the correct choice first and `answer: 0`; the browser shuffles choices at render time while preserving the original index for grading:

```json
{
  "id": "q1",
  "type": "multiple_choice",
  "points": 2,
  "prompt": { "ko": "...", "en": "..." },
  "choices": { "ko": ["...", "...", "...", "..."], "en": ["...", "...", "...", "..."] },
  "answer": 0,
  "explanation": { "ko": "...", "en": "..." }
}
```

Additional courses can be authored as CommonJS modules under `data/commulingo/courses/`, exporting one collection object. The Lenin course uses local helpers to keep authoring compact, but the exported shape must match the same collection/chapter/lesson/question schema.

Runtime delivery is different from source storage:

- `/commulingo` receives a slim catalog generated from the loaded bundle.
- `/commulingo/lesson/:lessonId` returns full questions for one lesson.
- Do not assume question arrays are present in the browser's initial `commulingo-data` script tag.

## Quality Target

Good CommuLingo questions should teach a concept through the prompt, the choices, and the explanation.

Korean quality matters. Korean prompts and choices must read as natural Korean written for Korean speakers. Avoid stiff translationese, unnatural word order, and repeated template phrases. If a sentence sounds like English translated word-for-word, rewrite it.

The user specifically rejected questions like:

- "이 장을 원문에서 찾고 맥락화할 때 가장 유용한 표지는 무엇입니까?"
- "다음 중 이 장을 읽는 방식으로 가장 문제가 큰 것은 무엇입니까?"
- Vague meta-reading questions about how to read the chapter.
- Questions where the answer is obvious because the distractors are silly.
- Questions that ask for "the core of the chapter" as the first item without giving any conceptual runway.

The desired direction is closer to:

- Ask about the actual argument of the chapter.
- Use a concrete situation, quote-like paraphrase, or conceptual tension.
- Make wrong choices plausible misunderstandings.
- Use explanations to teach the distinction, not merely say "correct".
- Before a learner answers, help them distinguish key concepts visually or schematically.

## Lesson Progression

Each 5-question lesson should have an internal learning arc.

Basic lesson:

1. Recognition question: introduce the chapter's object of analysis without demanding synthesis.
2. Mechanism question: ask how one relation/process works.
3. Distinction question: separate Marx's concept from a common-sense or bourgeois-economics reading.
4. Scenario question: apply the concept to a concrete situation.
5. Synthesis question: ask what the chapter demonstrates in the larger argument.

Advanced lesson:

1. Tension question: identify the contradiction or analytical problem Marx is solving.
2. Mediation question: ask what connects two categories or moments.
3. Critique question: test why a rival explanation is inadequate.
4. Scenario question: apply the chapter to a sharper or less obvious case.
5. System question: connect the chapter to the volume's broader movement.

This arc avoids putting the hardest "what is the essence?" question at the start.

## Prompt Pattern

Use prompts like these:

- "마르크스가 여기서 보여주려는 것은 무엇인가?"
- "왜 이 상황에서는 단순히 X라고 말할 수 없는가?"
- "다음 사례를 마르크스의 개념으로 보면 무엇이 드러나는가?"
- "이 설명이 놓치는 핵심은 무엇인가?"
- "이 장에서 A와 B의 차이는 왜 중요한가?"

Avoid prompts like these:

- "이 장의 핵심은 무엇인가?"
- "이 장을 읽는 가장 좋은 방법은 무엇인가?"
- "이 장의 위치를 찾는 표지는 무엇인가?"
- "다음 중 올바른 설명은?"

The last form is technically valid, but too generic. Prefer a concrete conceptual situation.

## Choice Design

A good multiple-choice item has four choices:

- One correct answer.
- Two plausible wrong answers that reflect real misunderstandings.
- One tempting but incomplete answer.

Do not use joke choices, empty opposites, or obviously anti-Marxist caricatures. The wrong answers should help diagnose what the learner is confusing.

Example bad choices:

- "자본주의는 언제나 모두를 부자로 만든다"
- "노동자는 아무 역할도 하지 않는다"
- "마르크스는 가격을 전혀 다루지 않는다"

Example better distractor types:

- Confuses money with capital.
- Treats circulation as production.
- Treats a historical condition as a natural fact.
- Treats appearance-form as the underlying relation.
- Treats individual exchange as enough to explain a social relation.

## Explanation Design

Each explanation should do three things in 1-3 sentences:

1. State why the answer is right.
2. Name the misconception behind at least one wrong option.
3. Tie the point back to the chapter's argument.

Do not merely repeat the correct choice.

## Concept Brief And Diagram Guidance

The concept brief appears before the first question. It should help a beginner distinguish the chapter's main concepts before answering.

Current implementation:

- `renderIntro()` displays summary, learning focus, and a diagram.
- `conceptMap(lesson)` in `public/js/commulingo.js` provides custom diagrams for selected chapters.
- `fallbackConceptMap(lesson)` builds a generic but chapter-specific explanation from title, summary, and learning focus.

Good concept diagrams should explain distinctions, not merely show a table of contents flow.

Good diagram patterns:

- Use-value vs value.
- Necessary labor vs surplus labor.
- Absolute surplus-value vs relative surplus-value.
- Production time vs circulation time vs turnover time.
- Real capital vs loanable money-capital vs fictitious capital.
- Profit, interest, rent as income forms tied to underlying production relations.

Avoid diagrams like:

- "상품의 두 얼굴 -> 가치형태와 화폐 -> 자본 분석의 출발점" when shown for every chapter in the same part.
- Generic part-level flow diagrams repeated across multiple chapters.
- Diagrams whose meaning is not obvious to a beginner.

## Known Quality Gaps

The main remaining problem is content quality variance. Some chapters still have questions that repeat the same idea too often, especially within the five questions of a lesson. Some choices are also too weak: the wrong options are sometimes obviously wrong, too abstract, or not diagnostic of a real misunderstanding.

Priority quality improvements:

1. Audit repeated question substance within each Basic/Advanced pair.
2. Replace weak distractors with plausible misunderstandings.
3. Make Korean prompts more natural and less template-like.
4. Add more custom concept diagrams for chapters where learners need a distinction before solving questions.
5. Improve explanations that merely restate the answer.
6. Ensure Basic and Advanced lessons feel different:
   - Basic should clarify the chapter's central distinction.
   - Advanced should test mediation, contradiction, critique, or system-level relation.

Useful automated checks to add later:

- Detect repeated Korean prompt openings within the same lesson.
- Detect repeated explanation endings.
- Flag choices containing extreme words like "언제나", "아무 역할도", "전혀" unless conceptually justified.
- Flag answer choices that are much longer than the others.
- Flag lessons where all five correct answers are conceptually the same sentence.

## Recommended QA Workflow

Recommended workflow for a chapter rewrite:

1. Pick one chapter only.
2. Create a 5-8 bullet chapter argument map:
   - object of analysis
   - central problem
   - key categories
   - movement of the argument
   - common misunderstandings
   - what Basic learners should grasp
   - what Advanced learners should grasp
3. Audit the existing 10 questions:
   - repeated concept?
   - weak distractors?
   - unnatural Korean?
   - explanation only repeats answer?
4. Rewrite only the weak items.
5. For every wrong choice, label the misconception it tests.
6. Run `node scripts/validate-commulingo.js`.
7. Spot-check in the UI.

Do not mass-generate all volumes in one pass. That was the source of many generic questions.

## Example Conversion

Weak:

> 마르크스가 식민지를 통해 보여주려는 핵심 조건은 무엇인가?

Better multiple-choice:

```json
{
  "type": "multiple_choice",
  "prompt": {
    "ko": "식민지에서 어떤 자본가가 돈과 기계는 갖고 있지만, 노동자들이 조금만 저축하면 곧바로 토지를 얻어 독립생산자가 된다. 마르크스가 이 사례로 보여주려는 것은 무엇인가?",
    "en": "In a colony, a capitalist has money and machinery, but workers can soon acquire land and become independent producers. What does Marx use this case to show?"
  },
  "choices": {
    "ko": [
      "자본주의는 돈과 생산수단만으로 성립하지 않고, 노동자가 생산수단에서 분리되어 임금노동자로 남아야 한다.",
      "식민지에서는 기계가 부족하기 때문에 자본주의가 발전하지 못한다.",
      "높은 임금은 언제나 자본주의 축적을 불가능하게 만든다.",
      "토지 소유가 넓게 퍼질수록 자본가의 이윤율은 자동으로 상승한다."
    ],
    "en": [
      "Capitalism does not arise from money and means of production alone; workers must be separated from the means of production and remain wage-labourers.",
      "Capitalism fails in colonies because machinery is scarce.",
      "High wages always make capitalist accumulation impossible.",
      "The wider land ownership becomes, the more automatically the capitalist profit rate rises."
    ]
  },
  "answer": 0,
  "explanation": {
    "ko": "마르크스의 요점은 자본이 물건이 아니라 사회관계라는 데 있다. 노동자가 토지와 생산수단에 접근할 수 있으면 임금노동자로 안정적으로 묶이지 않으므로, 돈과 기계만으로는 자본주의적 생산관계가 완성되지 않는다.",
    "en": "Marx's point is that capital is a social relation, not just a pile of things. If workers can access land and means of production, they are not stably bound as wage-labourers, so money and machinery alone do not establish capitalist production relations."
  }
}
```

## Codex Prompt To Use

When using Codex, give it a content-generation role before asking for edits:

```text
You are not coding yet. Act as a Marx study-guide editor.

For Capital Volume {n}, Chapter {m}, first write a chapter argument map in Korean:
- object of analysis
- central problem
- key categories
- movement of the argument
- common misunderstandings
- what basic learners should grasp
- what advanced learners should grasp

Then audit the existing Basic and Advanced questions:
- identify repeated substance
- identify weak or implausible distractors
- identify unnatural Korean
- identify explanations that merely repeat the answer

Then produce only the replacement questions needed:
- 4 choices each
- plausible distractors
- explanations that teach the concept
- no meta-reading questions
- no obvious joke choices
- first Basic question must be low-pressure and concrete

Only after the questions pass this rubric, update the relevant source file: `data/commulingo/lessons.json` for Capital, or a module under `data/commulingo/courses/` for newer courses.
```

## Validation Commands

Run these after content or UI changes:

```bash
node scripts/validate-commulingo.js
node --check public/js/commulingo.js
node --check routes/commulingo.js
node --check data/commulingo/index.js
node --check data/commulingo/courses/lenin-imperialism.js
```

For local UI smoke testing, run a temporary server on an unused port and check:

- `/commulingo` returns 200.
- Initial HTML contains 0 embedded questions.
- Volume buttons render quickly.
- Expanding a volume shows chapter cards.
- Starting a lesson fetches exactly one `/commulingo/lesson/:lessonId?v=...` request.
- The concept brief appears before questions.
- Returning to lessons keeps the selected volume expanded.
- Returning to lessons scrolls back to the selected chapter; after completing an Advanced lesson, it scrolls to the next chapter when one exists.
- Mobile viewport has no horizontal overflow.

## Quality Audit

`scripts/audit-commulingo-quality.js` reads the loaded CommuLingo bundle, including `courses/*.js`, and reports common quality risks:

1. Honorific or translationese phrasing.
2. Embedded "Correct"/"Incorrect" markers.
3. Generic prompt stems.
4. Overly extreme or caricatured distractors.
5. Choice length skew.
6. Repeated openings within a lesson.

The audit is heuristic. Treat hits as review prompts, not automatic failures; `scripts/validate-commulingo.js` is the blocking structural gate.

A separate generation script can then rewrite only flagged chapters, rather than regenerating the whole dataset.
