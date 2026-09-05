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

// fate: { ko, en } labels (already year-stripped). Returns problem strings.
function fateLabelProblems(fate) {
    const problems = [];
    const ko = (fate && fate.ko) || '';
    const en = (fate && fate.en) || '';
    if (ko.length > FATE_KO_MAX) {
        problems.push(`fate.label.ko is a sentence (${ko.length} chars): «${ko}» — use a short card label (옥사, 전사, 수용소에서 사망…); the year already lives in years`);
    }
    if (en.length > FATE_EN_MAX) {
        problems.push(`fate.label.en is a sentence (${en.length} chars): «${en}» — use a short card label (Died in prison, Killed in action…)`);
    }
    return problems;
}

// labels: { citizenshipKo, citizenshipEn, originKo, originEn }.
function nationalityLabelProblems(labels) {
    const problems = [];
    const checks = [
        ['citizenship.label.ko', labels.citizenshipKo, BIRTHPLACE_KO],
        ['citizenship.label.en', labels.citizenshipEn, BIRTHPLACE_EN],
        ['nationalOrigin.label.ko', labels.originKo, BIRTHPLACE_KO],
        ['nationalOrigin.label.en', labels.originEn, BIRTHPLACE_EN],
    ];
    for (const [field, value, re] of checks) {
        if (value && re.test(value)) {
            problems.push(`${field} is a birthplace: «${value}» — citizenship/origin are nation labels (러시아인 (스웨덴계) style), never a place of birth or death`);
        }
    }
    return problems;
}

function isLongFateLabel(ko) {
    return typeof ko === 'string' && ko.length > FATE_KO_SOFT;
}

module.exports = { fateLabelProblems, nationalityLabelProblems, isLongFateLabel, FATE_KO_MAX, FATE_EN_MAX, FATE_KO_SOFT };
