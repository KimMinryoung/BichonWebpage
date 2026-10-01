// The colour a person card carries: the person's political position, not the
// era group (the group already shows the era). Collection membership is the
// curated statement of position and wins; failing that, communist service is
// read from the activities; everyone else stays neutral rather than guessed.
const { affiliationMatches } = require('./person-activities');

// First match wins: a person in two collections (dissident + reform leader)
// takes the earlier one. A future collection for one communist force (e.g. a
// Chinese Communist Party position) maps to that force's red tone below.
const COLLECTION_POSITIONS = [
    ['anarchist', 'anarchist'],
    ['imperial-white', 'white'],
    ['counterrevolution', 'white'],
    ['left-opposition', 'left-opposition'],
    ['dissident', 'dissident'],
    ['socialist-bloc-reform-leader', 'reform'],
];

// Communist parties, the Comintern and states whose catalog existence is
// their socialist period. Subordinate rows (soviet-ukraine, PLA, party
// factions) match through parentId.
const COMMUNIST_AFFILIATIONS = [
    'soviet-party', 'state-soviet', 'comintern', 'china-ccp', 'china-prc',
    'state-east-germany', 'state-north-korea', 'state-south-yemen',
    'state-democratic-kampuchea', 'state-peoples-kampuchea',
    'party-german-communist', 'party-german-sed', 'german-kpo',
    'party-french-communist', 'party-czechoslovak-communist', 'party-polish-communist',
    'party-polish-workers', 'party-polish-pzpr', 'party-romanian-communist',
    'party-bulgarian-communist', 'party-hungarian-communist', 'party-hungarian-workers',
    'party-hungarian-socialist-workers', 'party-yugoslav-communist', 'party-albanian-labour',
    'party-italian-communist', 'party-spanish-communist', 'party-portuguese-communist',
    'party-greek-communist', 'party-finnish-communist', 'party-british-communist',
    'party-us-communist', 'party-us-swp', 'party-vietnamese-communist', 'party-korean-communist',
    'party-korean-workers', 'party-north-korean-workers', 'party-south-korean-workers',
    'party-indonesian-communist', 'party-indian-communist', 'party-indian-cpim',
    'party-japanese-communist', 'party-brazilian-communist', 'party-chilean-communist',
    'party-south-african-communist', 'party-cuban-communist', 'party-mongolian-people',
    'party-lao-revolutionary', 'party-kampuchean-communist', 'party-kampuchean-revolutionary',
    'party-ethiopian-workers', 'party-afghan-pdpa', 'party-yemeni-socialist',
    'party-angolan-mpla', 'party-mozambican-frelimo', 'party-congolese-labour',
    'party-grenadian-new-jewel',
];

// States that were socialist only for part of their catalog existence
// (Horthy's Hungary, Beneš's Czechoslovakia, royal Yugoslavia): service counts
// when the primary activity starts inside a socialist window [from, until),
// or when the person also has a communist activity. Without a start year the
// card stays neutral.
const SOCIALIST_WINDOWS = {
    'state-afghanistan': [[1978, 1992]], 'state-albania': [[1944, 1991]],
    'state-angola': [[1975, 1992]], 'state-benin': [[1975, 1990]],
    'state-bulgaria': [[1944, 1990]], 'state-cuba': [[1959, null]],
    'state-czechoslovakia': [[1948, 1989]], 'state-ethiopia': [[1974, 1991]],
    'state-grenada': [[1979, 1983]], 'state-hungary': [[1919, 1920], [1948, 1989]],
    'state-laos': [[1975, null]], 'state-madagascar': [[1975, 1992]],
    'state-mongolia': [[1921, 1992]], 'state-mozambique': [[1975, 1990]],
    'state-poland': [[1944, 1989]], 'state-republic-of-congo': [[1969, 1992]],
    'state-romania': [[1945, 1989]], 'state-somalia': [[1969, 1991]],
    'state-vietnam': [[1945, null]], 'state-yugoslavia': [[1945, 1992]],
};

// Each communist force keeps its own red: the Soviet and Chinese reds follow
// their flags; every other communist party and state shares the generic red.
const RED_TONES = [
    ['red-soviet', ['state-soviet', 'soviet-party']],
    ['red-china', ['china-ccp', 'china-prc']],
];

const redTone = id => (RED_TONES.find(([, roots]) => roots.some(r => affiliationMatches(id, r))) || ['red'])[0];

const isCommunist = id => !!id && COMMUNIST_AFFILIATIONS.some(c => affiliationMatches(id, c));

// collectionIds: the collections the person belongs to.
function personPosition(activities, collectionIds) {
    const inCollection = new Set(collectionIds || []);
    const hit = COLLECTION_POSITIONS.find(([id]) => inCollection.has(id));
    if (hit) return hit[1];
    const rows = activities || [];
    const primary = rows.find(a => a.primary);
    if (!primary) return '';
    if (isCommunist(primary.affiliationId)) return redTone(primary.affiliationId);
    const windows = SOCIALIST_WINDOWS[primary.affiliationId];
    if (windows && (rows.some(a => isCommunist(a.affiliationId))
        || (primary.startYear != null && windows.some(([from, until]) => from <= primary.startYear && (until == null || primary.startYear < until))))) return 'red';
    return '';
}

module.exports = { personPosition, COLLECTION_POSITIONS, RED_TONES };
