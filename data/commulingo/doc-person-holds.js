// A reference document's personLinks can say "this name is nobody in the
// dictionary" (personId null, 미등록 인물). That decision is frozen in the
// document, so registering the person later does not link them there
// (예브게니 그네딘 in sukhanovka-annin-1989, 2026-10-17). A new card reports
// the documents still holding its full name unlinked so the decision is
// revisited. Surnames alone are left out: most of those holds are a different
// bearer of the same surname, which a new namesake does not change.

function fullNames(person) {
    const out = [];
    for (const lang of ['ko', 'en']) {
        const given = person.givenName?.[lang] || '';
        const family = person.familyName?.[lang] || '';
        const patronymic = person.patronymic?.[lang] || '';
        const names = [person.name?.[lang], given && patronymic && family ? `${given} ${patronymic} ${family}` : '',
            ...(person.aliases?.[lang] || [])];
        for (const text of names) if (text && /\s/.test(text.trim())) out.push({ lang, text: text.trim() });
    }
    return out;
}

async function docHoldsForPerson(client, person) {
    const names = fullNames(person);
    if (!names.length) return [];
    const { rows } = await client.query(`SELECT d.id AS doc_id, x->>'lang' AS lang, x->>'text' AS text, x->>'reason' AS reason
        FROM commulingo_docs d, jsonb_array_elements(d.entry->'personLinks'->'names') x
        WHERE x->'personId' = 'null'::jsonb AND x->>'kind' = 'identity'
          AND EXISTS (SELECT 1 FROM jsonb_to_recordset($1::jsonb) AS n(lang text, text text)
                      WHERE n.lang = x->>'lang' AND lower(n.text) = lower(x->>'text'))
        ORDER BY d.id`, [JSON.stringify(names)]);
    return rows.map(row => ({ docId: row.doc_id, lang: row.lang, text: row.text, reason: row.reason }));
}

module.exports = { docHoldsForPerson };
