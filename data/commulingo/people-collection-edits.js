const { badRequest, periodColumns, contentLocalized, localized } = require('./people-admin-fields');
const { assertStringList } = require('./headword-validation');
const { mergeLocalizedPatch } = require('./people-patch');

function object(value, keys, field) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw badRequest(`${field} must be an object`);
    for (const key of Object.keys(value)) if (!keys.includes(key)) throw badRequest(`${field}: unknown key ${key}`);
}

function operations(payload, field, replacement) {
    if (payload[field] === undefined) return [];
    if (payload[replacement] !== undefined) throw badRequest(`send ${field} or ${replacement}, not both`);
    if (!Array.isArray(payload[field]) || payload[field].length > 100) throw badRequest(`${field} must be an array of at most 100 operations`);
    return payload[field];
}

function operation(value, keys, field) {
    object(value, ['op', ...keys], field);
    if (!['add', 'update', 'remove'].includes(value.op)) throw badRequest(`${field}.op must be add, update or remove`);
}

function sceneKey(value) {
    if (!Array.isArray(value) || value.length !== 2 || value.some(v => typeof v !== 'string' || !v.trim() || v !== v.trim())) {
        throw badRequest('scene must be [collectionId, episodeId] with two non-empty trimmed strings');
    }
    return JSON.stringify(value);
}

// Build the entire plan while holding the parent lock, before any mutation.
// References are stable: aliases by language/text, scenes by pair, careers by DB id.
function planCollectionEdits(before, payload) {
    const aliases = { ko: [...before.aliases.ko], en: [...before.aliases.en] };
    const aliasOps = operations(payload, 'aliasEdits', 'aliases');
    for (const edit of aliasOps) {
        operation(edit, ['lang', 'value', 'replacement'], 'aliasEdits');
        if (!['ko', 'en'].includes(edit.lang)) throw badRequest('aliasEdits.lang must be ko or en');
        assertStringList([edit.value], 'aliasEdits.value');
        const values = aliases[edit.lang], index = values.indexOf(edit.value);
        if (edit.op !== 'add' && index < 0) throw badRequest(`alias not found: ${edit.value}`);
        if (edit.op === 'add') {
            if (edit.replacement !== undefined) throw badRequest('alias add does not accept replacement');
            values.push(edit.value);
        } else if (edit.op === 'remove') {
            if (edit.replacement !== undefined) throw badRequest('alias remove does not accept replacement');
            values.splice(index, 1);
        } else {
            assertStringList([edit.replacement], 'aliasEdits.replacement');
            values[index] = edit.replacement;
        }
        assertStringList(values, `aliases.${edit.lang}`);
    }
    const scenes = before.scenes.map(scene => [...scene]);
    const sceneOps = operations(payload, 'sceneEdits', 'scenes');
    for (const edit of sceneOps) {
        operation(edit, ['scene', 'replacement'], 'sceneEdits');
        const key = sceneKey(edit.scene), index = scenes.findIndex(scene => sceneKey(scene) === key);
        if (edit.op !== 'add' && index < 0) throw badRequest('scene not found');
        if (edit.op === 'add') {
            if (edit.replacement !== undefined) throw badRequest('scene add does not accept replacement');
            scenes.push([...edit.scene]);
        } else if (edit.op === 'remove') {
            if (edit.replacement !== undefined) throw badRequest('scene remove does not accept replacement');
            scenes.splice(index, 1);
        } else {
            sceneKey(edit.replacement);
            scenes[index] = [...edit.replacement];
        }
        if (new Set(scenes.map(sceneKey)).size !== scenes.length) throw badRequest('duplicate scene');
    }
    const career = before.career.map(entry => ({ ...entry, r: { ...entry.r } }));
    const careerOps = operations(payload, 'careerEdits', 'career');
    const touched = new Set();
    for (const edit of careerOps) {
        operation(edit, ['id', 'entry'], 'careerEdits');
        let index = -1;
        if (edit.op === 'add') {
            if (edit.id !== undefined) throw badRequest('career add does not accept id');
        } else {
            if (!/^[1-9]\d*$/.test(String(edit.id)) || (typeof edit.id !== 'string' && !Number.isSafeInteger(edit.id))) {
                throw badRequest('career id must be a positive integer or decimal string');
            }
            index = career.findIndex(entry => String(entry.id) === String(edit.id));
            if (index < 0) throw badRequest('career id not found on this person');
            touched.add(String(edit.id));
        }
        if (edit.op === 'remove') {
            if (edit.entry !== undefined) throw badRequest('career remove does not accept entry');
            career.splice(index, 1);
            continue;
        }
        object(edit.entry, ['y', 'r'], 'careerEdits.entry');
        if (!Object.keys(edit.entry).length) throw badRequest('career entry patch must contain y or r');
        const stored = index < 0 ? { y: '', r: {} } : career[index];
        const y = edit.entry.y === undefined ? stored.y : edit.entry.y;
        if (typeof y !== 'string') throw badRequest('career entry.y must be a period label string');
        const r = mergeLocalizedPatch(stored.r, edit.entry.r, 'career entry.r');
        if (!r.ko.trim() || !r.en.trim()) throw badRequest('career entry requires non-empty ko/en roles');
        const entry = { ...stored, y, r };
        if (index < 0) career.push(entry);
        else career[index] = entry;
    }
    return {
        aliases: aliasOps.length ? aliases : undefined,
        scenes: sceneOps.length ? scenes : undefined,
        career: careerOps.length ? { entries: career, before: before.career, touched } : undefined,
    };
}

async function applyCareerEdits(client, personId, plan) {
    if (!plan) return;
    const retained = new Set(plan.entries.filter(e => e.id !== undefined).map(e => String(e.id)));
    for (const entry of plan.before) {
        if (!retained.has(String(entry.id))) await client.query(
            'DELETE FROM commulingo_person_career_entries WHERE person_id=$1 AND id=$2', [personId, entry.id]);
    }
    const { rows } = await client.query(
        'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_sort FROM commulingo_person_career_entries WHERE person_id=$1', [personId]);
    let nextSort = rows[0].next_sort;
    for (const entry of plan.entries) {
        if (entry.id !== undefined && !plan.touched.has(String(entry.id))) continue;
        const p = periodColumns(entry.y);
        const values = [personId, entry.y, p.startYear, p.startMonth, p.endYear, p.endMonth,
            contentLocalized(entry.r, 'ko'), localized(entry.r, 'en')];
        if (entry.id === undefined) {
            await client.query(`INSERT INTO commulingo_person_career_entries
                (person_id, period_label, start_year, start_month, end_year, end_month, role_ko, role_en, sort_order, updated_at)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())`, [...values, nextSort++]);
        } else {
            await client.query(`UPDATE commulingo_person_career_entries SET period_label=$2,
                start_year=$3, start_month=$4, end_year=$5, end_month=$6, role_ko=$7, role_en=$8, updated_at=NOW()
                WHERE person_id=$1 AND id=$9`, [...values, entry.id]);
        }
    }
}

module.exports = { planCollectionEdits, applyCareerEdits };
