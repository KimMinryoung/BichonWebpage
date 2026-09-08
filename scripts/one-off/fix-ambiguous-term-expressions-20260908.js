// Run in the production app with --apply; default is a read-only preview.
// Content-only correction: keep ambiguous spellings searchable, not auto-linked.
require('dotenv').config();
const fs = require('fs');
const db = require('../../config/database');
const fixes = [
    { id: 'july-days', ko: '7월 사태 (1917년 러시아)', en: 'July Days (1917, Russia)',
        search: { ko: ['7월 사태', '7월 봉기', '7월 위기', '7월 시위'], en: ['July Days', 'July Uprising', 'July Crisis', 'July events', 'July demonstrations'] } },
    { id: 'cultural-revolution-soviet', ko: '소비에트 문화혁명', search: { ko: ['문화혁명'] } },
    { id: 'coalition-government-1917', search: {
        ko: ['연립정부', '연립내각', '임시정부 연립내각', '제1차 연립정부', '제2차 연립정부', '제3차 연립정부'],
        en: ['coalition government', 'coalition cabinet', 'coalition ministry', 'Provisional Government coalition', 'first coalition government', 'second coalition government', 'third coalition government'] } },
    { id: 'belovezha-accords', search: { ko: ['민스크 협정'], en: ['Minsk Agreement'] } },
    { id: 'geneva-accords-1988-on-afghanistan', search: { ko: ['제네바 협정'], en: ['Geneva Accords'] } },
    { id: 'paris-agreements-1954', search: { ko: ['파리 협정'], en: ['Paris Pacts', 'Paris Accords', 'Paris Agreements'] } },
    { id: 'riga-agreement-1921', ko: '리가 구호 협정 (1921년)', en: 'Riga Relief Agreement (1921)',
        search: { ko: ['리가 협정', '1921년 리가 협정', '리가 조약'], en: ['Riga Agreement (1921)', 'Riga Agreement', 'Riga Agreement of 1921', 'Riga Treaty', 'Riga accord'] } },
];
(async () => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query("SET LOCAL lock_timeout = '3s'");
        const before = (await client.query('SELECT * FROM commulingo_terms WHERE id = ANY($1) ORDER BY id FOR UPDATE', [fixes.map(f => f.id)])).rows;
        if (before.length !== fixes.length) throw new Error('Missing target term');
        const updates = fixes.map(f => {
            const row = before.find(r => r.id === f.id);
            const expressions = new Map((row.link_expressions || []).map(e => [e.lang + ':' + e.text, e]));
            for (const [lang, texts] of Object.entries(f.search)) for (const text of texts) {
                expressions.set(lang + ':' + text, { lang, text, role: 'short', policy: 'search' });
            }
            // Explicit qualified names are safe automatic identities.
            for (const lang of ['ko', 'en']) {
                const text = f[lang] || row['term_' + lang];
                expressions.set(lang + ':' + text, { lang, text, role: 'identity', policy: 'auto' });
            }
            return { id: f.id, ko: f.ko || row.term_ko, en: f.en || row.term_en, expressions: [...expressions.values()] };
        });
        console.log(JSON.stringify(updates, null, 2));
        if (!process.argv.includes('--apply')) { await client.query('ROLLBACK'); return; }
        const backup = '/tmp/commulingo-ambiguous-terms-' + Date.now() + '.json';
        fs.writeFileSync(backup, JSON.stringify(before, null, 2), { mode: 0o600, flag: 'wx' });
        for (const u of updates) await client.query(
            'UPDATE commulingo_terms SET term_ko=$2, term_en=$3, link_expressions=$4::jsonb, updated_at=NOW() WHERE id=$1',
            [u.id, u.ko, u.en, JSON.stringify(u.expressions)]);
        await client.query('COMMIT');
        console.log('Applied; backup: ' + backup);
        await require('../../data/commulingo/terms-store').loadCommuLingoTerms({ fresh: true });
    } catch (err) { await client.query('ROLLBACK'); throw err; }
    finally { client.release(); await db.end(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
