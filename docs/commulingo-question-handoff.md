# Commulingo Question Handoff

## Goal

Commulingo is a chapter-by-chapter learning path for revolutionary theory. The current dataset starts with Marx's Capital, volumes 1-3, and keeps two lessons per chapter:

- Basic: 5 questions
- Advanced: 5 questions

The quiz format stays multiple choice. The next quality pass should improve the questions, not replace the interaction model.

## Current Files

- Data: `data/commulingo/lessons.json`
- Public route: `routes/commulingo.js`
- Page template: `views/public/commulingo.ejs`
- Client UI: `public/js/commulingo.js`
- Styles: `public/css/commulingo.css`
- Progress table migration: `scripts/migrations/005_commulingo_progress.sql`

## Data Shape

The lesson data is organized as:

```json
{
  "collections": [
    {
      "id": "capital-vol1",
      "title": { "ko": "자본론 1권", "en": "Capital Volume I" },
      "chapters": [
        {
          "id": "capital-vol1-ch01",
          "chapterNumber": 1,
          "title": { "ko": "상품", "en": "Commodities" },
          "summary": { "ko": "...", "en": "..." },
          "lessons": [
            {
              "id": "capital-vol1-ch01-basic",
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

Each question should preserve the existing fields:

```json
{
  "type": "multiple_choice",
  "prompt": { "ko": "...", "en": "..." },
  "choices": { "ko": ["...", "...", "...", "..."], "en": ["...", "...", "...", "..."] },
  "answer": 0,
  "explanation": { "ko": "...", "en": "..." }
}
```

## Quality Target

Good Commulingo questions should feel like guided study, not an exam ambush. A user who has not fully mastered the chapter should still learn something from the prompt, the choices, and the explanation.

The user specifically rejected questions like:

- "이 장을 원문에서 찾고 맥락화할 때 가장 유용한 표지는 무엇입니까?"
- "다음 중 이 장을 읽는 방식으로 가장 문제가 큰 것은 무엇입니까?"
- Vague meta-reading questions about how to read the chapter
- Questions where the answer is obvious because the distractors are silly
- Questions that ask for "the core of the chapter" as the first item without giving any conceptual runway

The desired direction is closer to:

- Ask about the actual argument of the chapter.
- Use a concrete situation, quote-like paraphrase, or conceptual tension.
- Make wrong choices plausible misunderstandings.
- Use explanations to teach the distinction, not merely say "correct".

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

## Generation Workflow

Recommended workflow for a full rewrite:

1. Work one chapter at a time.
2. Before writing questions, create a 5-8 bullet "chapter argument map".
3. Draft 10 questions from the map: 5 basic, 5 advanced.
4. For each question, label the misconception tested by each wrong choice.
5. Run a critic pass that deletes meta-reading questions and obvious-answer questions.
6. Validate JSON.
7. Spot-check in the UI.

Do not mass-generate all volumes in one prompt without a chapter map. That was the source of many low-quality generic questions.

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

Then produce exactly 10 multiple-choice questions:
- 5 basic, 5 advanced
- 4 choices each
- plausible distractors
- explanations that teach the concept
- no meta-reading questions
- no obvious joke choices
- first question must be low-pressure and concrete

Only after the questions pass this rubric, update `data/commulingo/lessons.json`.
```

## Why ChatGPT May Produce Better Questions Than Codex By Default

This is likely not because Codex cannot write good educational content. The issue is workflow pressure.

Codex is optimized for repository work: inspect files, edit code, keep JSON valid, run checks, preserve existing structure, and finish the task. Under that pressure, it tends to satisfy the schema at scale and can drift into generic templated questions.

ChatGPT, especially in a normal chat setting, is usually being used in a more editorial mode: it can spend the whole answer on pedagogy, examples, tone, and conceptual sequencing without also managing file edits, UI constraints, JSON escaping, and verification.

To get better questions from Codex, split the job into two phases:

1. Content phase: no file edits. Generate and critique the chapter map and questions.
2. Integration phase: write the accepted questions into JSON and run checks.

If Codex is asked to generate hundreds of questions and commit them in one pass, quality will degrade. If it is asked to behave as a study-guide editor chapter by chapter, with a rubric and critic pass, it can do much better while still avoiding manual copy-paste.

## Suggested Automation

Add a script later, for example `scripts/generate_commulingo_chapter.py`, that:

1. Reads one chapter entry from `data/commulingo/lessons.json`.
2. Sends the chapter title, summary, and source notes to a high-quality model.
3. Requires a chapter argument map plus 10 questions.
4. Runs a second model pass as critic.
5. Writes only the approved chapter back to JSON.
6. Validates the file with `python3 -m json.tool`.

This would let ChatGPT-like content quality and Codex-like repo integration work together without manual copy-paste.

## Acceptance Checklist

Before accepting a rewritten chapter:

- Each lesson has exactly 5 questions.
- The first basic question is concrete and low-pressure.
- Every prompt asks about chapter content, not how to read or locate the chapter.
- Wrong choices are plausible misconceptions.
- No answer is obvious from tone alone.
- Explanations teach the concept.
- Basic and advanced questions are meaningfully different.
- Korean text is natural, not stiff translationese.
- English text is acceptable if the site is viewed in English.
- `python3 -m json.tool data/commulingo/lessons.json` passes.
- The `/commulingo` page renders the chapter correctly.
