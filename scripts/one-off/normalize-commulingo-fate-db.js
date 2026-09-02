#!/usr/bin/env node
// Full semantic normalization of commulingo_people.fate_* to the CommuLingo fate
// standard: label = cause of death only (no death year), execution unified to
// 처형/Executed, vague natural death unified to 자연사/Natural causes, specific
// illnesses kept (redundant "사망" suffix dropped), prison death as 옥사, place
// kept with " · ", political fates keep their event year(s) with canonical EN.
//
// Death-year noise is stripped first (normalizeFateLabel), then the resulting KO
// key is looked up in MAP. Political fates carry an event year that differs from
// the death year, so they survive the strip and are mapped by their exact key.
//
// Usage (inside the frontend container, which can reach the DB):
//   node /app/scripts/normalize-commulingo-fate-db.js            # dry run (ROLLBACK)
//   node /app/scripts/normalize-commulingo-fate-db.js --apply    # write
const { db: db } = require('../lib/bootstrap');
const { normalizeFateLabel } = require('../../data/commulingo/people-standard');

const APPLY = process.argv.includes('--apply');

// Year-stripped KO label  ->  [canonical KO, canonical EN].
// Covers every distinct value observed across all rows; unmapped keys are
// reported so the map can be extended before applying.
const MAP = {
    // ── natural death (vague forms unified) ──
    '자연사': ['자연사', 'Natural causes'],
    '사망': ['자연사', 'Natural causes'],
    '노환': ['자연사', 'Natural causes'],
    '노환 사망': ['자연사', 'Natural causes'],
    '노환으로 사망': ['자연사', 'Natural causes'],
    '재임 중 사망': ['자연사', 'Natural causes'],
    '급사': ['자연사', 'Natural causes'],
    '타계': ['자연사', 'Natural causes'],
    '': ['', ''],
    // ── specific illness (kept; redundant "사망" dropped) ──
    '병사': ['병사', 'Illness'],
    '병사(病死)': ['병사', 'Illness'],
    '심장마비': ['심장마비', 'Heart attack'],
    '심장마비 사망': ['심장마비', 'Heart attack'],
    '심근경색': ['심근경색', 'Heart attack'],
    '뇌출혈': ['뇌출혈', 'Cerebral hemorrhage'],
    '뇌출혈 사망': ['뇌출혈', 'Cerebral hemorrhage'],
    '뇌졸중 사망': ['뇌졸중', 'Stroke'],
    '뇌동맥경화': ['뇌동맥경화', 'Cerebral arteriosclerosis'],
    '뇌막염': ['뇌막염', 'Meningitis'],
    '폐암': ['폐암', 'Lung cancer'],
    '폐암 사망': ['폐암', 'Lung cancer'],
    '폐암, 사망': ['폐암', 'Lung cancer'],
    '위암 사망': ['위암', 'Stomach cancer'],
    '암': ['암', 'Cancer'],
    '암으로 사망': ['암', 'Cancer'],
    '자연사 (암)': ['암', 'Cancer'],
    '백혈병': ['백혈병', 'Leukemia'],
    '결핵': ['결핵', 'Tuberculosis'],
    '결핵 사망': ['결핵', 'Tuberculosis'],
    '폐렴': ['폐렴', 'Pneumonia'],
    '폐렴 사망': ['폐렴', 'Pneumonia'],
    '복막염': ['복막염', 'Peritonitis'],
    '콜레라': ['콜레라', 'Cholera'],
    '장티푸스': ['장티푸스', 'Typhoid'],
    '장티푸스사': ['장티푸스', 'Typhoid'],
    '발진티푸스': ['발진티푸스', 'Typhus'],
    '신장병': ['신장병', 'Kidney disease'],
    '당뇨': ['당뇨', 'Diabetes'],
    '진폐증 사망': ['진폐증', 'Pneumoconiosis'],
    '수술 중 사망': ['수술 중 사망', 'Died in surgery'],
    // ── execution (unified to 처형 / Executed) ──
    '처형': ['처형', 'Executed'],
    '총살': ['처형', 'Executed'],
    '총살형': ['처형', 'Executed'],
    '교수형': ['처형', 'Executed'],
    '사형': ['처형', 'Executed'],
    '숙청, 총살': ['처형', 'Executed'],
    '숙청 1938': ['처형', 'Executed'],
    // ── suicide ──
    '자살': ['자살', 'Suicide'],
    '권총 자살': ['자살', 'Suicide'],
    '자결': ['자살', 'Suicide'],
    '동반자살': ['자살', 'Suicide'],
    // ── murder / assassination / poisoning ──
    '살해': ['살해', 'Murdered'],
    '암살': ['암살', 'Assassinated'],
    'NKVD 피살': ['살해', 'Murdered'],
    'NKVD 살해': ['살해', 'Murdered'],
    '독살': ['독살', 'Poisoned'],
    '의문사': ['의문사', 'Mysterious death'],
    // ── war / duty / accident ──
    '전사': ['전사', 'Killed in action'],
    '순직': ['순직', 'Died on duty'],
    '교통사고': ['교통사고', 'Car crash'],
    '항공 사고': ['추락사', 'Killed in crash'],
    '항공기 추락': ['추락사', 'Killed in crash'],
    '추락사': ['추락사', 'Killed in crash'],
    '사고사': ['사고사', 'Accidental death'],
    '기차 사망': ['사고사', 'Accidental death'],
    // ── prison / confinement death ──
    '옥사': ['옥사', 'Died in prison'],
    '수용소 사망': ['옥사', 'Died in prison'],
    '구금 중 사망': ['옥사', 'Died in prison'],
    '수감 중 살해': ['옥중 살해', 'Killed in prison'],
    '정신병원 사망': ['정신병원 사망', 'Died in a psychiatric hospital'],
    // ── exile / place-of-death ──
    '망명지 사망': ['망명지 사망', 'Died in exile'],
    '망명 중 사망': ['망명지 사망', 'Died in exile'],
    '망명 중 병사': ['망명 중 병사', 'Died of illness in exile'],
    '망명 · 뉴욕': ['망명 · 뉴욕', 'Émigré · New York'],
    '로마에서 사망': ['자연사 · 로마', 'Natural causes · Rome'],
    '하얼빈 사망': ['자연사 · 하얼빈', 'Natural causes · Harbin'],
    '중국 출장 중 사망': ['자연사', 'Natural causes'],
    '파리': ['자연사 · 파리', 'Natural causes · Paris'],
    // ── cause + place (kept with " · ") ──
    '암살 멕시코': ['암살 · 멕시코', 'Assassinated · Mexico'],
    '살해 베를린': ['살해 · 베를린', 'Murdered · Berlin'],
    '자연사 뉴욕': ['자연사 · 뉴욕', 'Natural causes · New York'],
    '처형 도쿄': ['처형 · 도쿄', 'Executed · Tokyo'],
    '심장마비 뉴욕': ['심장마비 · 뉴욕', 'Heart attack · New York'],
    '자살 · 파리': ['자살 · 파리', 'Suicide · Paris'],
    '골결핵 파리': ['골결핵 · 파리', 'Bone tuberculosis · Paris'],
    // ── still living ──
    '생존': ['생존', 'Living'],
    // ── tail cases (count 1) ──
    '옥고 후 병사': ['병사', 'Illness'],
    '지병사': ['병사', 'Illness'],
    '이송 중 사망': ['옥사', 'Died in prison'],
    '권총 자결': ['자살', 'Suicide'],
    '피살': ['살해', 'Murdered'],
    '재임 중 급서': ['자연사', 'Natural causes'],
    '수용 10년': ['수용 10년', '10 years in camps'],
    '암살 로잔': ['암살 · 로잔', 'Assassinated · Lausanne'],
    '총살. 부티르카 교도소, 모스크바.': ['처형 · 모스크바', 'Executed · Moscow'],
    '뉴욕 사망': ['자연사 · 뉴욕', 'Natural causes · New York'],
    '모스크바 사망': ['자연사 · 모스크바', 'Natural causes · Moscow'],
    '사망 · 뉴욕': ['자연사 · 뉴욕', 'Natural causes · New York'],
};

// Political fate: canonical EN per Korean event word. The KO label (event word +
// event year, possibly a " · " compound) is kept verbatim; only EN is rebuilt.
const POL_WORD = {
    '실각': 'Removed', '퇴임': 'Left office', '해임': 'Dismissed', '전보': 'Transferred',
    '은퇴': 'Retired', '강제은퇴': 'Forced retirement', '좌천': 'Demoted', '체포': 'Arrested', '사면': 'amnestied',
    '복권': 'rehabilitated', '유형': 'Internal exile', '추방': 'Deported', '귀국': 'returned',
    '자연사': 'natural causes', '주변화': 'sidelined',
};
// Multi-word political phrases handled as whole segments.
const POL_PHRASE = {
    '당 해체': 'Party dissolved', '정치국 퇴진': 'Left Politburo', '중앙직 사임': 'Resigned central post',
    '실각 후 실종': 'Vanished after removal',
};

function isPolitical(nko) {
    return Object.keys(POL_PHRASE).some(p => nko.startsWith(p)) ||
        Object.keys(POL_WORD).some(w => new RegExp('^' + w + '(\\s|$)').test(nko));
}

function politicalEn(nko) {
    // Translate each " · "-separated segment: leading Korean word/phrase -> EN,
    // trailing year kept. First segment capitalized, later ones lower-case.
    return nko.split('·').map(s => s.trim()).map((seg, i) => {
        for (const [ph, en] of Object.entries(POL_PHRASE)) {
            if (seg.startsWith(ph)) return (en + seg.slice(ph.length)).trim();
        }
        const m = /^(\S+)(.*)$/.exec(seg);
        const word = m ? m[1] : seg;
        const rest = m ? m[2] : '';
        let en = POL_WORD[word] || word;
        if (i === 0) en = en.charAt(0).toUpperCase() + en.slice(1);
        return (en + rest).replace(/\s+/g, ' ').trim();
    }).join(' · ');
}

function canonicalFate(ko, en, deathYear) {
    const nko = normalizeFateLabel(ko, deathYear);
    if (isPolitical(nko)) return { ko: nko, en: politicalEn(nko) };
    const hit = MAP[nko];
    if (hit) return { ko: hit[0], en: hit[1] };
    return null; // unmapped -> reported
}

(async () => {
    const { rows } = await db.query(
        `SELECT id, death_year, fate_kind, fate_label_ko, fate_label_en
         FROM commulingo_people ORDER BY sort_order, id`
    );
    const unmapped = new Set();
    const client = await db.connect();
    let changed = 0;
    try {
        await client.query('BEGIN');
        for (const r of rows) {
            const canon = canonicalFate(r.fate_label_ko || '', r.fate_label_en || '', r.death_year);
            if (!canon) { unmapped.add(normalizeFateLabel(r.fate_label_ko || '', r.death_year)); continue; }
            const dirty = canon.ko !== (r.fate_label_ko || '') || canon.en !== (r.fate_label_en || '');
            if (!dirty) continue;
            changed++;
            if (process.env.VERBOSE) {
                console.log(`${r.id.padEnd(20)} ${(r.fate_label_ko || '') + ' / ' + (r.fate_label_en || '')}  ->  ${canon.ko} / ${canon.en}`);
            }
            if (APPLY) {
                await client.query(
                    `UPDATE commulingo_people SET fate_label_ko = $2, fate_label_en = $3, updated_at = NOW() WHERE id = $1`,
                    [r.id, canon.ko, canon.en]
                );
            }
        }
        if (unmapped.size) {
            console.log('UNMAPPED (' + unmapped.size + '):');
            for (const u of unmapped) console.log('  ' + JSON.stringify(u));
            await client.query('ROLLBACK');
            console.log('Aborted: extend MAP to cover the above, then re-run.');
            process.exit(2);
        }
        if (APPLY) {
            await client.query('COMMIT');
            console.log(`APPLIED: ${changed} rows updated (of ${rows.length}).`);
        } else {
            await client.query('ROLLBACK');
            console.log(`DRY RUN: ${changed} of ${rows.length} rows would change. Re-run with --apply to write.`);
        }
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('FAILED, rolled back:', err.message);
        process.exitCode = 1;
    } finally {
        client.release();
        process.exit(process.exitCode || 0);
    }
})();
