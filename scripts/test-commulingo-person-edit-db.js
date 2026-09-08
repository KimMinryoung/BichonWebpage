// Requires an isolated copy of the current person schema, never the production DB.
// No dotenv/bootstrap and no snapshot refresh: every write uses an explicit client.
const assert = require('node:assert/strict');
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') {
    throw new Error('Requires COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test');
}
const db = require('../config/database');
const { admin, sections } = require('./lib/person-editorial-fixture');
const personId = 'person-edit-regression';
const groupId = 'person-edit-regression-group';

async function run() {
    const client = await db.connect();
    const options = { client, changedBy: 'person-edit-regression' };
    const get = () => admin.getPersonAdmin(personId, options);
    const update = payload => admin.updatePersonAdmin(personId, payload, options);
    const list = () => sections.listPersonSectionsAdmin(personId, options);
    const revision = async () => (await client.query(
        'SELECT snapshot FROM commulingo_people_revisions WHERE entity_id=$1 ORDER BY id DESC LIMIT 1', [personId]
    )).rows[0].snapshot;
    const content = section => {
        const rest = { ...section };
        delete rest.createdAt;
        delete rest.updatedAt;
        delete rest.revision;
        return rest;
    };
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO commulingo_people_groups(id) VALUES ($1)', [groupId]);
        await admin.createPersonAdmin({
            id: personId, groupId,
            givenName: { ko: '야노시', en: 'Janos' },
            familyName: { ko: '데 나지', en: 'de Nagy' },
            nativeName: 'Janos de Nagy', years: '1900–1980',
            citizenship: { code: 'france' }, nationalOrigin: { code: 'france' },
            role: { icon: 'book-open' },
            bio: { ko: '이전 소개', en: 'Original biography' },
            moment: { ko: '이전 일화', en: 'Original moment' },
            epithet: { ko: '이전 수식어', en: 'Original epithet' },
            aliases: { ko: ['원래 별칭'], en: ['Original alias'] },
            fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        }, options);
        await update({ bio: { ko: '새 소개' }, moment: { ko: '새 일화' }, epithet: { en: 'New epithet' } });
        let person = await get();
        assert.deepEqual(person.bio, { ko: '새 소개', en: 'Original biography' });
        assert.deepEqual(person.moment, { ko: '새 일화', en: 'Original moment' });
        assert.deepEqual(person.epithet, { ko: '이전 수식어', en: 'New epithet' });
        assert.equal((await revision()).before.bio.ko, '이전 소개');

        await update({ givenName: { ko: '새이름' } });
        person = await get();
        assert.equal(person.givenName.en, 'Janos');
        await update({ name: { ko: '다른 이름' } });
        person = await get();
        assert.equal(person.familyName.en, 'de Nagy', 'legacy KO edit must not re-split an EN compound surname');
        await update({ citizenship: { code: 'hungary' } });
        person = await get();
        assert.equal(person.name.ko, '이름 다른', 'changing citizenship recomposes derived names');
        assert.equal(person.citizenship.label.en, 'Hungary');

        await update({ aliases: { ko: ['새 별칭'] }, fate: { label: { ko: '옥사' } } });
        person = await get();
        assert.deepEqual(person.aliases, { ko: ['새 별칭'], en: ['Original alias'] });
        assert.equal(person.fate.kind, 'natural');
        assert.equal(person.fate.label.en, 'Natural causes');
        await update({ bio: '문자열 수정', moment: { en: '' }, epithet: null });
        person = await get();
        assert.equal(person.bio.en, 'Original biography');
        assert.deepEqual(person.moment, { ko: '새 일화', en: '' });
        assert.deepEqual(person.epithet, { ko: '', en: '' });
        await update({ fate: null });
        assert.deepEqual((await get()).fate, { kind: '', label: { ko: '', en: '' } });
        const beforeInvalid = await get();
        for (const patch of [{ bio: [] }, { bio: { en: null } }, { givenName: { en: 1 } }, { aliases: null }]) {
            await assert.rejects(update(patch), { status: 400 });
            assert.deepEqual(await get(), beforeInvalid);
        }

        const initialRevision = (await get()).revision;
        assert.match(initialRevision, /^v1-[a-f0-9]{64}$/);
        await update({ expectedRevision: initialRevision, aliasEdits: [{ op: 'add', lang: 'en', value: 'Second alias' }],
            careerEdits: [
                { op: 'add', entry: { y: '1920–1925', r: { ko: '연구원', en: 'Researcher' } } },
                { op: 'add', entry: { y: '1926–1930', r: { ko: '교수', en: 'Professor' } } },
            ], sceneEdits: [{ op: 'add', scene: ['course', 'episode-1'] }] });
        const added = await get();
        assert.notEqual(added.revision, initialRevision);
        await assert.rejects(update({ expectedRevision: initialRevision, bio: { ko: '오래된 편집' } }), { status: 409, code: 'revision_conflict' });
        assert.deepEqual(await get(), added);
        await update({ expectedRevision: added.revision,
            aliasEdits: [{ op: 'update', lang: 'en', value: 'Second alias', replacement: 'Renamed alias' }],
            careerEdits: [{ op: 'update', id: added.career[0].id, entry: { r: { ko: '주임 연구원' } } }],
            sceneEdits: [{ op: 'update', scene: ['course', 'episode-1'], replacement: ['course', 'episode-2'] }],
        });
        const edited = await get();
        assert.deepEqual(edited.career.map(c => c.id), added.career.map(c => c.id));
        assert.equal(edited.career[0].r.en, 'Researcher');
        assert.deepEqual(edited.career[1], added.career[1]);
        assert.deepEqual(edited.scenes, [['course', 'episode-2']]);
        assert.ok(edited.aliases.en.includes('Original alias'));
        await update({ careerEdits: [{ op: 'remove', id: added.career[0].id }],
            aliasEdits: [{ op: 'remove', lang: 'en', value: 'Renamed alias' }],
            sceneEdits: [{ op: 'remove', scene: ['course', 'episode-2'] }],
        });
        assert.deepEqual((await get()).career, [added.career[1]]);
        assert.deepEqual((await get()).scenes, []);
        const beforeBadCollection = await get();
        const lastGoodRevision = await revision();
        // Validate the entire operation list before changing even the unrelated bio.
        await assert.rejects(update({ bio: { ko: '저장되면 안 됨' },
            aliasEdits: [{ op: 'add', lang: 'ko', value: '유효한 별칭' }, { op: 'remove', lang: 'ko', value: '없는 별칭' }],
        }), { status: 400 });
        await assert.rejects(update({ careerEdits: [{ op: 'remove', id: '99999999999999' }] }), { status: 400 });
        await assert.rejects(update({ aliases: {}, aliasEdits: [] }), { status: 400 });
        await assert.rejects(update({ expectedRevision: null }), { status: 400 });
        assert.deepEqual(await get(), beforeBadCollection);
        assert.deepEqual(await revision(), lastGoodRevision);
        await assert.rejects(admin.deletePersonAdmin(personId, { ...options, expectedRevision: initialRevision }), { status: 409 });

        const original = await sections.upsertPersonSectionAdmin(personId, 'one-topic', {
            heading: { ko: '원래 제목', en: 'Original heading' },
            body: { ko: '원래 본문', en: 'Original body' }, sortOrder: 1950,
            sources: ['A published source, p. 12'],
        }, options);
        assert.equal((await revision()).sectionBefore, null);
        const beforeSectionEdit = (await get()).revision;
        const changed = await sections.upsertPersonSectionAdmin(personId, 'one-topic', {
            body: { ko: '수정 본문' }, expectedRevision: beforeSectionEdit,
        }, options);
        assert.notEqual(changed.revision, beforeSectionEdit);
        await assert.rejects(sections.upsertPersonSectionAdmin(personId, 'one-topic', {
            body: { ko: '오래된 절' }, expectedRevision: beforeSectionEdit,
        }, options), { status: 409 });
        await assert.rejects(sections.deletePersonSectionAdmin(personId, 'one-topic', {
            ...options, expectedRevision: beforeSectionEdit,
        }), { status: 409 });
        await assert.rejects(update({ expectedRevision: beforeSectionEdit, bio: { ko: '절 수정 전 버전' } }), { status: 409 });
        assert.deepEqual(changed.heading, original.heading);
        assert.equal(changed.body.en, original.body.en);
        assert.equal(changed.sortOrder, original.sortOrder);
        assert.deepEqual(changed.sources, original.sources);
        const edit = await revision();
        assert.deepEqual(content(edit.sectionBefore), content(original));
        assert.deepEqual(content(edit.sectionAfter), content(changed));
        // Undo a section edit through the same validated store, using only its revision.
        const restored = await sections.upsertPersonSectionAdmin(personId, 'one-topic', edit.sectionBefore, options);
        assert.deepEqual(content(restored), content(original));
        await sections.deletePersonSectionAdmin(personId, 'one-topic', options);
        assert.deepEqual(await list(), []);
        const deletion = await revision();
        assert.equal(deletion.sectionAfter, null);
        assert.deepEqual(content(deletion.sectionBefore), content(original));
        const recreated = await sections.upsertPersonSectionAdmin(personId, 'one-topic', deletion.sectionBefore, options);
        assert.deepEqual(content(recreated), content(original), 'deleted content and sources restore from the deletion revision alone');
        await assert.rejects(sections.upsertPersonSectionAdmin(personId, 'one-topic', { sources: [] }, options), { status: 400 });
        await sections.upsertPersonSectionAdmin(personId, 'one-topic', { body: { en: '' } }, options);
        assert.equal((await list())[0].body.ko, original.body.ko);
        assert.equal((await list())[0].body.en, '');
        assert.ok((await list())[0].sources.length);

        const beforeRollback = await get();
        const sectionsBeforeRollback = await list();
        const countRevisions = async () => (await client.query(
            'SELECT count(*) FROM commulingo_people_revisions WHERE entity_id=$1', [personId]
        )).rows[0].count;
        const revisionsBeforeRollback = await countRevisions();
        await client.query('SAVEPOINT failed_batch');
        await update({ bio: { ko: '롤백되어야 함' } });
        await sections.upsertPersonSectionAdmin(personId, 'one-topic', { body: { ko: '롤백 대상' } }, options);
        await assert.rejects(sections.upsertPersonSectionAdmin(personId, 'one-topic', { sources: 'invalid' }, options), { status: 400 });
        await client.query('ROLLBACK TO SAVEPOINT failed_batch');
        assert.deepEqual(await get(), beforeRollback);
        assert.deepEqual(await list(), sectionsBeforeRollback);
        assert.equal(await countRevisions(), revisionsBeforeRollback);
        console.log('PASS: partial edits, names, explicit clears, section undo/recreation and batch rollback against PostgreSQL');
    } finally {
        await client.query('ROLLBACK');
        client.release();
    }
}
run().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => db.end());
