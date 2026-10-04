// 러시아 사회혁명당 표기를 「사회혁명당」으로 통일(사용자 지시 2026-10-04): 에스에르·에세르(당)·
// 사회주의혁명당 → 사회혁명당, 당원을 가리키면 사회혁명당원. 조사(와/과 등)도 받침에 맞춘다.
// 인물(별칭·소개·결정적 장면·경력·절), 용어(표제어·정의·본문), 사건 본문·연표, 사건-인물 관계 설명.
// 근거 기록(evidence)과 큐레이션 기록은 편집 이력이라 고치지 않는다. 「에스에르」 계열 용어 별칭은
// 옛 문헌·검색어로 남긴다. 참고 문헌 HTML은 --docs로 저장소 안에서 고친다.
//   docker exec -w /app leninbot-frontend node /tmp/sr/fix.js [--apply]
//   node scripts/content/sr-party-spelling-20261004.js --docs [--apply]
const apply = process.argv.includes('--apply');
const ACTOR = 'claude-sr-party-spelling';
const NOTE = '표기만 고침: 러시아 사회혁명당의 약칭 에스에르·에세르와 사회주의혁명당을 「사회혁명당」으로 통일(사용자 지시). 내용 변경 없음';
const OLD = /에스에르|에세르|사회주의혁명당/;

// Vowel-final 에스에르 → consonant-final 사회혁명당: the particle that follows changes.
const PARTICLE = { 와: '과', 는: '은', 를: '을', 가: '이', 로: '으로', 라는: '이라는', 라고: '이라고', 였: '이었', 나: '이나', 다: '이다' };
const fix = s => s
    .replace(/사회(?:주의)?혁명당\s?\((?:에스에르|에세르)\)/g, '사회혁명당')
    .replace(/(?:사회주의혁명당|에스에르당|에세르당|에스에르\s|에세르\s)\s*당원/g, '사회혁명당원')
    .replace(/(?:사회주의혁명당|에스에르당|에세르당)원/g, '사회혁명당원')
    .replace(/사회혁명당 당원/g, '사회혁명당원')
    .replace(/에세르파(?= 노선)/g, '사회혁명당')
    .replace(/에세르파(는|가|를|와|로)?/g, (_, particle) => '사회혁명당원' + (particle ? PARTICLE[particle] : ''))
    .replace(/사회주의혁명당|에스에르당|에세르당/g, '사회혁명당')
    .replace(/좌파(?=에스에르)/g, '좌파 ')
    .replace(/(?:에스에르|에세르)(['’」』"]?)(라는|라고|와|는|를|가|로|였|나|다(?=[.,\s]|$))?/g,
        (_, quote, particle) => '사회혁명당' + quote + (particle ? PARTICLE[particle] : ''))
    .replace(/사회혁명당(\([^)]*\))와/g, '사회혁명당$1과')
    // A person, not the party.
    .replace(/(한|하다) 좌파 사회혁명당$/, '$1 좌파 사회혁명당원')
    .replace('분산된 사회혁명당 그룹들을 단일 사회혁명당으로', '분산된 사회혁명주의 그룹들을 단일 사회혁명당으로')
    .replace('1917년 좌파 사회혁명당으로 출발', '1917년 좌파 사회혁명당원으로 출발')
    .replace('우리 좌파 사회혁명당에게서', '우리 좌파 사회혁명당원들에게서')
    .replace('우파 사회혁명당 니콜라이 압크센티예프', '우파 사회혁명당의 니콜라이 압크센티예프');
const has = s => typeof s === 'string' && OLD.test(s);
module.exports = { fix, has };

function showDiff(where, a, b) {
    console.log(`## ${where}`);
    // Print the new wording around each 사회혁명당 of every changed line.
    const al = a.split('\n'), bl = b.split('\n');
    al.forEach((line, i) => {
        if (line === bl[i]) return;
        for (const m of bl[i].matchAll(/사회혁명당/g)) console.log(`   ${bl[i].slice(Math.max(0, m.index - 22), m.index + 22).replace(/\s+/g, ' ')}`);
    });
}

async function docs() {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(__dirname, '../../data/commulingo/docs');
    for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.html'))) {
        const file = path.join(dir, name), a = fs.readFileSync(file, 'utf8');
        if (!has(a)) continue;
        // The text is HTML: run the rule over each paragraph so the end-of-field rule cannot fire.
        const b = a.split('\n').map(fix).join('\n');
        showDiff(name, a, b);
        if (apply) fs.writeFileSync(file, b);
    }
}

async function database() {
    const people = require('/app/data/commulingo/person-editorial-service');
    const terms = require('/app/data/commulingo/term-editorial-service');
    const db = require('/app/config/database');
    const { applyFixes } = require('/app/scripts/apply-event-text-fixes');
    const ids = async sql => (await db.query(sql)).rows.map(r => r.id);
    const LIKE = "~ '에스에르|에세르|사회주의혁명당'";
    const out = [];
    try {
        const personIds = await ids(`SELECT id FROM commulingo_people WHERE epithet_ko ${LIKE} OR bio_ko ${LIKE} OR moment_ko ${LIKE}
            UNION SELECT person_id FROM commulingo_person_career_entries WHERE role_ko ${LIKE}
            UNION SELECT person_id FROM commulingo_person_sections WHERE heading_ko ${LIKE} OR body_ko ${LIKE} OR sources::text ${LIKE}`);
        for (const id of personIds) {
            const p = await people.readPersonEditorial(id);
            const fields = { expectedRevision: p.revision };
            for (const key of ['epithet', 'bio', 'moment']) if (p[key] && has(p[key].ko)) {
                fields[key] = { ...p[key], ko: fix(p[key].ko) };
                showDiff(`${id}.${key}`, p[key].ko, fields[key].ko);
            }
            const careerEdits = p.career.filter(c => has(c.r.ko)).map(c => {
                showDiff(`${id}.career#${c.id}`, c.r.ko, fix(c.r.ko));
                return { op: 'update', id: String(c.id), entry: { r: { ko: fix(c.r.ko) } } };
            });
            if (careerEdits.length) fields.careerEdits = careerEdits;
            const evSource = (p.evidence || []).map(e => e.source).find(Boolean)
                || p.activities.flatMap(a => a.evidence || []).map(e => e.source).find(Boolean);
            const prose = ['epithet', 'bio', 'moment'].filter(k => fields[k]);
            if (prose.length) fields.evidence = prose.map(field => ({ field, claim: NOTE, source: evSource, locator: '사회혁명당 표기', stance: 'supports' }));
            if (Object.keys(fields).length > 1) {
                out.push([id, Object.keys(fields).filter(k => k !== 'expectedRevision'),
                    await people.submitPersonEdit({ target: 'person', action: 'update', id, fields, sources: [evSource].filter(Boolean), dryRun: !apply, changedBy: ACTOR })]);
            }
            for (const s of p.sections.filter(s => has(s.heading.ko) || has(s.body.ko) || has(JSON.stringify(s.sources)))) {
                const fresh = apply ? await people.readPersonEditorial(id) : p;
                const heading = { ...s.heading, ko: fix(s.heading.ko) }, body = { ...s.body, ko: fix(s.body.ko) };
                const sources = JSON.parse(fix(JSON.stringify(s.sources)));
                showDiff(`${id}§${s.slug}`, [s.heading.ko, s.body.ko, JSON.stringify(s.sources)].join('\n'), [heading.ko, body.ko, JSON.stringify(sources)].join('\n'));
                out.push([`${id}§${s.slug}`, ['section'], await people.submitPersonEdit({ target: 'person_section', action: 'update', id,
                    fields: { slug: s.slug, sortOrder: s.sortOrder, heading, body, sources, expectedRevision: fresh.revision,
                        evidence: [{ field: 'body', claim: NOTE, source: sources[0], locator: '사회혁명당 표기', stance: 'supports' }] },
                    sources, dryRun: !apply, changedBy: ACTOR })]);
            }
        }

        const termIds = await ids(`SELECT id FROM commulingo_terms WHERE term_ko ${LIKE} OR definition_ko ${LIKE} OR body_ko ${LIKE}`);
        for (const id of termIds) {
            const t = await terms.readTermEditorial(id);
            const fields = { expectedRevision: t.revision };
            for (const key of ['term', 'definition', 'body']) if (has(t[key].ko)) {
                fields[key] = { ko: fix(t[key].ko) };
                showDiff(`${id}.${key}`, t[key].ko, fields[key].ko);
            }
            if (fields.term) {
                fields.carryLinkReviews = true;
                // The old alias 사회혁명당 is now the headword itself.
                fields.aliases = { ...t.aliases, ko: t.aliases.ko.filter(a => a !== fields.term.ko) };
            }
            fields.evidence = Object.keys(fields).filter(k => ['term', 'definition', 'body'].includes(k))
                .map(field => ({ field, claim: NOTE, source: t.sources[0], locator: '사회혁명당 표기' }));
            const req = { id, action: 'update', sources: t.sources, changedBy: ACTOR, fields };
            if (!apply) { out.push([id, await terms.submitTermEdit({ ...req, dryRun: true })]); continue; }
            const r = await terms.submitTermEdit(req);
            out.push([id, r.status, (await terms.reviewTermSuggestion(r.suggestionId, true, '표기 통일(사용자 지시)', { changedBy: ACTOR })).status]);
        }
        // 「에스에르 토지 강령」 alias → 「사회혁명당 토지 강령」 (its link review is in scripts/reviews).
        {
            const t = await terms.readTermEditorial('land-socialization');
            if (t.aliases.ko.includes('에스에르 토지 강령')) {
                const req = { id: t.id, action: 'update', sources: t.sources, changedBy: ACTOR,
                    fields: { expectedRevision: t.revision, aliases: { ...t.aliases, ko: t.aliases.ko.map(a => (a === '에스에르 토지 강령' ? '사회혁명당 토지 강령' : a)) } } };
                if (!apply) out.push(['land-socialization.aliases', await terms.submitTermEdit({ ...req, dryRun: true })]);
                else {
                    const r = await terms.submitTermEdit(req);
                    out.push(['land-socialization.aliases', r.status, (await terms.reviewTermSuggestion(r.suggestionId, true, '표기 통일(사용자 지시)', { changedBy: ACTOR })).status]);
                }
            }
        }

        const changes = [];
        for (const e of (await db.query(`SELECT id, body_ko, summary_ko, timeline FROM commulingo_history_events WHERE body_ko ${LIKE} OR summary_ko ${LIKE} OR timeline::text ${LIKE}`)).rows) {
            for (const column of ['body_ko', 'summary_ko']) if (has(e[column])) {
                // Replace paragraph by paragraph so every "from" is unique and readable.
                for (const para of e[column].split('\n').filter(has)) {
                    showDiff(`${e.id}.${column}`, para, fix(para));
                    changes.push({ event: e.id, column, from: para, to: fix(para) });
                }
            }
            if (has(JSON.stringify(e.timeline))) {
                const value = JSON.parse(fix(JSON.stringify(e.timeline)));
                showDiff(`${e.id}.timeline`, JSON.stringify(e.timeline).replace(/\},/g, '},\n'), JSON.stringify(value).replace(/\},/g, '},\n'));
                changes.push({ event: e.id, column: 'timeline', expected: e.timeline, value });
            }
        }
        out.push(['events', await applyFixes(db, { id: 'sr-party-spelling-20261004', changes }, { apply, backup: '/tmp/sr/before-events.json' })]);

        const rel = (await db.query(`SELECT event_id, person_id, relation_ko, note_ko FROM commulingo_history_event_people WHERE relation_ko ${LIKE} OR note_ko ${LIKE}`)).rows;
        for (const r of rel) {
            const relation = r.relation_ko && fix(r.relation_ko), note = r.note_ko && fix(r.note_ko);
            showDiff(`${r.event_id}/${r.person_id}`, `${r.relation_ko}\n${r.note_ko}`, `${relation}\n${note}`);
            if (apply) await db.query(`UPDATE commulingo_history_event_people SET relation_ko=$3, note_ko=$4
                WHERE event_id=$1 AND person_id=$2 AND relation_ko IS NOT DISTINCT FROM $5 AND note_ko IS NOT DISTINCT FROM $6`,
            [r.event_id, r.person_id, relation, note, r.relation_ko, r.note_ko]);
        }
        out.push(['event-people', rel.length]);
    } finally {
        console.log('\n' + JSON.stringify(out.map(([id, ...rest]) => [id, ...rest.map(r => (r && typeof r === 'object' ? (r.status || (r.dryRun && 'dry-run') || r) : r))]), null, 1));
        await db.end();
    }
}

if (require.main === module) {
    (process.argv.includes('--docs') ? docs() : database()).catch(e => { console.error(e.stack); process.exitCode = 1; });
}
