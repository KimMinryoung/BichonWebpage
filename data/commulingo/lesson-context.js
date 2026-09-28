// 문항은 레슨 밖에서도 읽힌다(훈련장 쇼츠, 검색으로 들어온 문항 링크). 그래서
// 질문과 보기는 「이 문서」「이 장」「다음 장」처럼 레슨 맥락을 가리키지 않고
// 저작과 장을 이름으로 적는다: 『자본론』 3권 27장, 『고타강령 비판』.
// 질문 안에서 상황을 먼저 적고 가리키는 「이 장면」「이 주장」은 해당하지 않는다.
// validate-commulingo(규칙 lesson-context)와 쇼츠 피드가 같은 판정을 쓴다.

// 「이 문서」「이 장」「다음 장」「the chapter」 같은 지시·상대 표현은 문항 안에 기준점
// (『저작』이나 장 번호)이 적혀 있으면 그것을 받는 말이라 허용하고, 기준점 없이 레슨만
// 가리킬 때 잡는다. 영어는 한국어의 저작 표기를 함께 기준점으로 본다(두 언어는 같은 문항).
const REFERENCE_KO = /이 (문서|장|글|책|절|문헌|저작|논문|팸플릿|텍스트|강의|연설|서한|편지)(?=[\s은는이가을를의에서으로과와도만,.?]|$)|이번 장|(다음|앞|뒤|최종|마지막) (최종 )?장|(앞|뒤) 장들|서론 장|이어지는 장들/;
const REFERENCE_EN = /\bthis (chapter|document|text|pamphlet|work|book|section|article|letter|speech|lecture)\b|\b(the|next|following|previous|preceding|earlier|later|final|last) chapters?\b/i;
const ANCHOR_KO = /『|\d+장/;
const ANCHOR_EN = /\bChapters? \d+/;

function lessonContextText(question) {
    const prompt = (question && question.prompt) || {};
    const choices = (question && question.choices) || {};
    return {
        ko: [prompt.ko].concat(choices.ko || []).join(' '),
        en: [prompt.en].concat(choices.en || []).join(' '),
    };
}

// 판정은 질문과 보기를 한 글로 본다. 보기 속 「3장의 논의」는 질문이 3장을 밝혀 두면 풀린다.
function needsLessonContext(question) {
    const text = lessonContextText(question);
    if (!REFERENCE_KO.test(text.ko) && !REFERENCE_EN.test(text.en)) return false;
    return !ANCHOR_KO.test(text.ko) && !ANCHOR_EN.test(text.en);
}

module.exports = { needsLessonContext };
