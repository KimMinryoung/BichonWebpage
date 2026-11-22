// Card-field rules for a CommuLingo person: the short labels the people card
// prints beside the flag and the fate icon, and the role row the office /
// category pages index. Pure functions — shared by the admin store (rejects on
// write), scripts/audit-person-card-fields.js (backstop for hand-run SQL) and
// the smoke test. Migration 167 (2026-09-05) motivated it: voldemar-ulmer was
// inserted by SQL with no role row, a sentence for a fate label and a
// birthplace in the national-origin label.

const FATE_KO_MAX = 24;
const FATE_EN_MAX = 50;
const FATE_KO_SOFT = 16;
const BIRTHPLACE_KO = /출생\s*(\(|$)/;
const BIRTHPLACE_EN = /^born\b/i;

// Fate is how the person died, nothing else (2026-11-22 owner decision):
// falls from power, exile and expulsion belong in the career timeline. The
// kinds and their default labels are the shared contract (leninbot reads it
// too); an empty label shows the kind's default. A label only narrows the
// cause — 총살, 교수형, 폐암, 수용소에서 사망 — with no year, list or note.
const { fateKinds: FATE_KINDS } = require('./person-editorial-contract.json');
const FATE_NOTE = /[0-9,;·()/]/;

function fateDefaultLabel(kind, lang) {
    const entry = FATE_KINDS[kind];
    return entry ? entry[lang === 'en' ? 'en' : 'ko'] : '';
}

// fate: { kind?, ko, en } (labels already year-stripped). kind is checked
// when given (undefined skips it; '' is a living person's empty fate).
function fateLabelProblems(fate) {
    const problems = [];
    const ko = (fate && fate.ko) || '';
    const en = (fate && fate.en) || '';
    const kind = fate && fate.kind;
    if (kind !== undefined && kind !== null && kind !== '' && !FATE_KINDS[kind]) {
        problems.push(`fate.kind «${kind}» is not one of ${Object.keys(FATE_KINDS).join(', ')} — fate is the manner of death; a fall from power or exile goes in the career timeline`);
    }
    if (FATE_NOTE.test(ko) || FATE_NOTE.test(en)) {
        problems.push(`fate.label «${ko}» / «${en}» names the cause only — no years, lists or bracketed notes (disputes and rehabilitation go in the bio)`);
    }
    if (ko.length > FATE_KO_MAX) {
        problems.push(`fate.label.ko is a sentence (${ko.length} chars): «${ko}» — use a short card label (옥사, 전사, 수용소에서 사망…); the year already lives in years`);
    }
    if (en.length > FATE_EN_MAX) {
        problems.push(`fate.label.en is a sentence (${en.length} chars): «${en}» — use a short card label (Died in prison, Killed in action…)`);
    }
    return problems;
}

// Label form (2026-11-22 owner decision; the 1,212 cards were normalized to
// it the same day). The flag code carries the country, so a label is the
// country's name and at most one bracketed qualifier:
//   citizenship  one state: the code's default name or a former state that has
//                no code of its own (러시아 제국, 프로이센) — no "A → B" history,
//                naturalization years or notes (those belong in the bio);
//   origin       the code's default name, optionally « (○○계) » or a region
//                « (스코틀랜드) »: 「러시아 (유대계)」 / "Russia (Jewish)" — never
//                「러시아인」, 「유대계 독일인」 or a family remark (「아버지는 …」).
const NOTE_KO = /[→,;/()]|출처|미확인/;
const NOTE_EN = /[→,;/()]|attributed|unverified/i;
const FAMILY_KO = /출생|어머니|아버지|모친|부친|가정|집안|외가|친가/;
const QUALIFIED = /^(.+?)(?: \(([^()]+)\))?$/;

function nationalityFormProblems(labels) {
    const { FLAG_NAMES } = require('./flag-icons');
    const problems = [];
    const cit = FLAG_NAMES[labels.citizenshipCode];
    if (cit) {
        const ko = labels.citizenshipKo || '';
        const en = labels.citizenshipEn || '';
        if (NOTE_KO.test(ko) || NOTE_EN.test(en)) {
            problems.push(`citizenship.label «${ko}» / «${en}» must name one state — no "A → B" history, years, brackets or notes; put naturalization or loss of citizenship in the bio`);
        }
        if (ko !== cit.ko && (ko === `${cit.ko}인` || ko === `${cit.ko}계`)) {
            problems.push(`citizenship.label.ko «${ko}» — write the state, 「${cit.ko}」`);
        }
    }
    const origin = FLAG_NAMES[labels.originCode];
    if (origin) {
        const ko = (labels.originKo || '').match(QUALIFIED);
        const en = (labels.originEn || '').match(QUALIFIED);
        const shape = `「${origin.ko}」 or 「${origin.ko} (○○계)」 / "${origin.en}" or "${origin.en} (…)"`;
        if (labels.originKo && (!ko || ko[1] !== origin.ko)) {
            problems.push(`nationalOrigin.label.ko «${labels.originKo}» must start with the code's country — ${shape}`);
        } else if (ko && ko[2] && (FAMILY_KO.test(ko[2]) || /[,;]/.test(ko[2]) || /인$/.test(ko[2]))) {
            problems.push(`nationalOrigin.label.ko «${labels.originKo}» — the bracket is one descent or region (유대계, 스코틀랜드), not a family remark or 「~인」`);
        }
        if (labels.originEn && (!en || en[1] !== origin.en)) {
            problems.push(`nationalOrigin.label.en «${labels.originEn}» must start with the code's country — ${shape}`);
        }
    }
    return problems;
}

// labels: { citizenshipCode?, citizenshipKo, citizenshipEn, originCode?, originKo, originEn }.
// The form rules apply when the code is given.
function nationalityLabelProblems(labels) {
    const problems = nationalityFormProblems(labels);
    const checks = [
        ['citizenship.label.ko', labels.citizenshipKo, BIRTHPLACE_KO],
        ['citizenship.label.en', labels.citizenshipEn, BIRTHPLACE_EN],
        ['nationalOrigin.label.ko', labels.originKo, BIRTHPLACE_KO],
        ['nationalOrigin.label.en', labels.originEn, BIRTHPLACE_EN],
    ];
    for (const [field, value, re] of checks) {
        if (value && re.test(value)) {
            problems.push(`${field} is a birthplace: «${value}» — citizenship/origin are nation labels (러시아 (스웨덴계) style), never a place of birth or death`);
        }
    }
    return problems;
}

// Career rows (2026-11-22 owner decision), checked on rows that are new or
// changed — the rows already stored are left as they are:
//   one row is one post or event in one period: a year other than the
//   period's own start/end year means a second step that needs its own row
//   (「US스틸 이사, 1938년 이사회 의장」 on a 1934 row → two rows), and so does
//   an 「A → B」 chain; posts held together in the same period may share a row
//   with a comma;
//   a row is a noun phrase, not a sentence (「…를 지냈다.」).
const ROLE_YEAR = /(?<![\d.])(1[5-9]\d\d|20[0-2]\d)(?!\d)/g;
const EN_ABBREV_END = /\b(?:Co|Inc|Ltd|Corp|St|Jr|Sr|No|Nos|vs|etc|Bros|Dept|Gen|Col|Lt|Adm|Capt)\.$/;

function careerRoleProblems(entry) {
    const problems = [];
    const r = (entry && (entry.r || entry.role)) || {};
    const ko = String(r.ko || '').trim();
    const en = String(r.en || '').trim();
    const period = (entry && entry.period) || {};
    const own = new Set([period.start, period.end].filter(Array.isArray).map(part => Number(part[0])));
    const label = `career row «${ko}» / «${en}»`;
    const others = [...new Set([...`${ko} ${en}`.matchAll(ROLE_YEAR)].map(m => Number(m[1])).filter(y => !own.has(y)))];
    if (others.length) {
        problems.push(`${label} names ${others.join(', ')} besides its own period — one row is one post or event; give that step its own row and period`);
    }
    if (/→|->/.test(`${ko} ${en}`)) {
        problems.push(`${label} chains steps with → — give each post its own row and period`);
    }
    if (/다\.?$/.test(ko) || (/[.!]$/.test(en) && !EN_ABBREV_END.test(en))) {
        problems.push(`${label} is a sentence — write a noun phrase (「아제르바이잔 내무인민위원, 대숙청 집행」 / "People's Commissar of Internal Affairs of Azerbaijan; carried out the Great Purge")`);
    }
    return problems;
}

function isLongFateLabel(ko) {
    return typeof ko === 'string' && ko.length > FATE_KO_SOFT;
}

module.exports = { careerRoleProblems, fateLabelProblems, fateDefaultLabel, FATE_KINDS, nationalityLabelProblems, isLongFateLabel, FATE_KO_MAX, FATE_EN_MAX, FATE_KO_SOFT };
