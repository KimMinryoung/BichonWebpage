const assert = require('node:assert/strict');
// These validators are pure; fail if they attempt database access.
const dbPath = require.resolve('../config/database');
require.cache[dbPath] = {id:dbPath,filename:dbPath,loaded:true,exports:{
    query() { throw new Error('unexpected database access'); },
    connect() { throw new Error('unexpected database access'); }
}};
const {validateEditorial} = require('../data/commulingo/person-editorial-policy');
const {validateFields} = require('../data/commulingo/term-editorial-service');
const source = 'https://example.org/archive';
const evidence = field => Array.from({length: 63}, (_, i) => ({field, claim: `Documented fact ${i}`, source, locator: `section ${i}`, excerpt: 'A documented fact from the original source.'}));
for (const section of [false,true]) {
    const field = section ? 'body' : 'bio';
    const payload = {[field]: {ko:'사실',en:'Fact'}, sources:[source], evidence:evidence(field)};
    assert.equal(validateEditorial(payload,{},section).evidence.length,63);
    assert.throws(() => validateEditorial({...payload,evidence:{}},{},section),/array/);
    assert.throws(() => validateEditorial({...payload,evidence:[]},{},section),/evidence must identify/);
    payload.evidence[62].source = 'https://example.org/uncited';
    assert.throws(() => validateEditorial(payload,{},section),/evidence/);
}
const current = {term:{ko:'용어',en:'Term'},definition:{ko:'정의',en:'Definition'},period:{ko:'시기',en:'Period'},category:'concept'};
const fields = {definition:{ko:'새 정의',en:'New definition'},evidence:evidence('definition')};
assert.equal(validateFields(fields,current,'update',[source]).evidence.length,63);
assert.throws(() => validateFields({...fields,evidence:{}},current,'update',[source]),/array/);
assert.throws(() => validateFields({...fields,evidence:[]},current,'update',[source]),/evidence required/);
fields.evidence[62].source = 'https://example.org/uncited';
assert.throws(() => validateFields(fields,current,'update',[source]),/invalid field evidence/);
console.log('63 evidence items accepted for people, sections and terms; malformed and unsupported evidence rejected');
