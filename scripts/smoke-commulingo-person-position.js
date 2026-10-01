// Card colour by political position (data/commulingo/person-position.js).
const assert = require('node:assert/strict');
const { personPosition } = require('../data/commulingo/person-position');

const primary = (affiliationId, startYear) => [{ primary: true, affiliationId, startYear }];

// Collections win over affiliation; the first listed collection wins a tie.
assert.equal(personPosition(primary('state-soviet'), ['anarchist']), 'anarchist');
assert.equal(personPosition(primary('state-hungary'), ['socialist-bloc-reform-leader', 'dissident']), 'dissident');
assert.equal(personPosition(primary('russian-white'), ['imperial-white']), 'white');
assert.equal(personPosition(primary('state-poland'), ['counterrevolution']), 'white');

assert.equal(personPosition(primary('german-nazi'), ['counterrevolution', 'fascist']), 'fascist');
// Earlier-career collections yield to a communist affiliation.
assert.equal(personPosition(primary('russian-mensheviks'), ['non-bolshevik-socialist']), 'socialist');
assert.equal(personPosition(primary('party-polish-pzpr'), ['non-bolshevik-socialist']), 'red');
assert.equal(personPosition(primary('russian-narodnaya-volya'), ['narodnik']), 'narodnik');
assert.equal(personPosition(primary('party-german-communist'), ['western-marxist']), 'western-marxist');
assert.equal(personPosition(primary('state-vietnam', 1945), ['national-liberation']), 'red');
assert.equal(personPosition(primary('party-paigc'), ['national-liberation']), 'national-liberation');

// Each communist force keeps its own red; sub-affiliations follow their parent.
assert.equal(personPosition(primary('state-soviet'), []), 'red-soviet');
assert.equal(personPosition(primary('soviet-ukraine'), []), 'red-soviet');
assert.equal(personPosition(primary('soviet-left-opposition'), []), 'red-soviet');
assert.equal(personPosition(primary('china-pla'), []), 'red-china');
assert.equal(personPosition(primary('party-german-communist'), []), 'red');
assert.equal(personPosition(primary('comintern'), []), 'red');

// Partly socialist states: only service starting in the socialist window, or
// alongside a communist activity, is red. Unknown years stay neutral.
assert.equal(personPosition(primary('state-hungary', 1920), []), '');
assert.equal(personPosition(primary('state-hungary', 1956), []), 'red');
assert.equal(personPosition([{ primary: true, affiliationId: 'state-czechoslovakia', startYear: 1940, endYear: 1948 }], []), '');
// Partisans who started before liberation and served mostly after it are red.
assert.equal(personPosition([{ primary: true, affiliationId: 'state-yugoslavia', startYear: 1941, endYear: 1955 }], []), 'red');
assert.equal(personPosition(primary('state-vietnam'), []), '');
assert.equal(personPosition([...primary('state-vietnam'), { primary: false, affiliationId: 'party-vietnamese-communist' }], []), 'red');

// No evidence of a position: neutral, never guessed.
assert.equal(personPosition(primary('state-usa'), []), '');
assert.equal(personPosition(primary('russian-mensheviks'), []), '');
assert.equal(personPosition([], []), '');

console.log('person position ok');
