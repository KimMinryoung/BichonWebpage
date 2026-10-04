// Drop the Finland clause from Kolchak's note on the Baltic event (moved to finland-1917-1920).
const db = require('/app/config/database');
(async () => {
    const r = await db.query(`UPDATE commulingo_history_event_people SET note_ko=$3, note_en=$4
        WHERE event_id=$1 AND person_id=$2 AND note_ko=$5 RETURNING person_id`, ['baltic-wars-of-independence', 'alexander-kolchak',
        '유데니치를 북서 전선 총사령관으로 임명했으나 에스토니아의 독립 승인을 인정하지 않았다.',
        "He appointed Yudenich to the North-Western front but would not recognise Estonia's independence.",
        '유데니치를 북서 전선 총사령관으로 임명했으나 에스토니아의 독립 승인을 인정하지 않았고, 핀란드의 참전 조건도 거부했다.']);
    console.log('updated', r.rowCount);
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => db.end());
