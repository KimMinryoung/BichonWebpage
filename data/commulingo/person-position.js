// The colour a person card carries: the person's political position, not the
// era group (the group already shows the era). Collection membership is the
// curated statement of position and wins; failing that, communist service is
// read from the activities; everyone else stays neutral rather than guessed.
const { affiliationMatches, affiliations } = require('./person-activities');

// First match wins: a person in two collections (dissident + reform leader,
// fascist + counterrevolution) takes the earlier one. A future collection for
// one communist force (e.g. a Chinese Communist Party position) maps to that
// force's red tone below.
const COLLECTION_POSITIONS = [
    ['anarchist', 'anarchist'],
    ['fascist', 'fascist'],
    ['imperial-white', 'white'],
    ['counterrevolution', 'white'],
    ['left-opposition', 'left-opposition'],
    ['trotskyism', 'trotskyist'],
    ['left-communism', 'left-communist'],
    ['dissident', 'dissident'],
    ['socialist-bloc-reform-leader', 'reform'],
    ['eurocommunism', 'reform'],
    ['western-marxist', 'western-marxist'],
    ['monarchist', 'monarchist'],
    ['conservative', 'conservative'],
    ['liberal-republican', 'liberal-republican'],
    ['agrarian', 'agrarian'],
    ['nationalist', 'nationalist'],
];

// Collections for an earlier stage of a career: they colour a card only when
// the person's own affiliation does not make it red (a social democrat who
// later led a ruling communist party is red).
const EARLIER_POSITIONS = [
    // The communist currents (2026-10-08 split of the old 'communist'
    // collection along the communist-currents genealogy). Documented
    // Soviet/Chinese service keeps its own red; the chip names the current.
    ['maoism', 'red-china'],
    ['titoism', 'red'],
    ['juche', 'red-korea'],
    ['marxism-leninism', 'red'],
    ['marxism', 'red'],
    ['social-democrat', 'socialist'],
    ['early-socialist', 'socialist'],
    ['revolutionary-socialist', 'revolutionary-socialist'],
    ['narodnik', 'narodnik'],
    ['jacobin', 'jacobin'],
    ['revolutionary-democrat', 'revolutionary-democrat'],
    ['national-liberation', 'national-liberation'],
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
// when the primary activity starts inside a socialist window [from, to]
// (years inclusive) or most of its years fall inside one — partisans who started before liberation and ruled after it
// count, an interwar minister who stayed until the takeover does not — or when
// the person also has a communist activity. Without a start year the card
// stays neutral. Anti-communists who served such a state through the
// socialist years (South Vietnam, exile councils) belong in a collection,
// which wins over this rule.
const SOCIALIST_WINDOWS = {
    'state-afghanistan': [[1978, 1992]], 'state-albania': [[1944, 1990]],
    'state-angola': [[1975, 1991]], 'state-benin': [[1975, 1989]],
    'state-bulgaria': [[1944, 1989]], 'state-cuba': [[1959, null]],
    'state-czechoslovakia': [[1948, 1989]], 'state-ethiopia': [[1974, 1991]],
    'state-grenada': [[1979, 1983]], 'state-hungary': [[1919, 1919], [1948, 1989]],
    'state-laos': [[1975, null]], 'state-madagascar': [[1975, 1991]],
    'state-mongolia': [[1921, 1990]], 'state-mozambique': [[1975, 1990]],
    'state-poland': [[1944, 1989]], 'state-republic-of-congo': [[1969, 1990]],
    'state-romania': [[1945, 1989]], 'state-somalia': [[1969, 1991]],
    'state-vietnam': [[1945, null]], 'state-yugoslavia': [[1945, 1991]],
};

// Each communist force keeps its own red: the Soviet, Chinese and North Korean
// reds follow their flags; every other communist party and state shares the
// generic red.
const RED_TONES = [
    ['red-soviet', ['state-soviet', 'soviet-party']],
    ['red-china', ['china-ccp', 'china-prc']],
    ['red-korea', ['state-north-korea', 'party-korean-workers', 'party-north-korean-workers']],
];

const redTone = id => (RED_TONES.find(([, roots]) => roots.some(r => affiliationMatches(id, r))) || ['red'])[0];

const isCommunist = id => !!id && COMMUNIST_AFFILIATIONS.some(c => affiliationMatches(id, c));

function mostlySocialist({ startYear, endYear }, windows) {
    if (startYear == null) return false;
    const end = endYear ?? startYear;
    const span = end - startYear + 1;
    const within = (from, to) => Math.max(0, Math.min(end, to ?? Infinity) - Math.max(startYear, from) + 1);
    return windows.some(([from, to]) => from <= startYear && (to == null || startYear <= to))
        || windows.reduce((sum, [from, to]) => sum + within(from, to), 0) * 2 > span;
}

const RED_LABELS = {
    'red-soviet': { ko: '소련 공산주의', en: 'Soviet communism' },
    'red-china': { ko: '중국 공산주의', en: 'Chinese communism' },
    'red-korea': { ko: '북한 공산주의', en: 'North Korean communism' },
    red: { ko: '공산주의', en: 'Communism' },
};

// collectionIds: the collections the person belongs to. Returns the position
// key and, when a collection decided it, that collection's id (the card's
// position tag links there); a red read from the activities has none (its
// chip names the person's communist-current collection).
function resolvePosition(activities, collectionIds) {
    const inCollection = new Set(collectionIds || []);
    const hit = COLLECTION_POSITIONS.find(([id]) => inCollection.has(id));
    if (hit) return { position: hit[1], collectionId: hit[0] };
    const rows = activities || [];
    const primary = rows.find(a => a.primary);
    if (primary && isCommunist(primary.affiliationId)) return { position: redTone(primary.affiliationId), collectionId: '' };
    // A primary activity with no affiliation (a writer, a theorist) or with a
    // movement rather than a state (Guevara's 26th of July Movement) does not
    // settle the position; a documented communist activity then decides it.
    // Service to a non-socialist state does not yield to it.
    const earlier = EARLIER_POSITIONS.find(([id]) => inCollection.has(id));
    const member = rows.some(a => isCommunist(a.affiliationId));
    // Service in a socialist window without any communist membership does not
    // make a curated social democrat red: the social democrats who
    // served the 1919 Hungarian Soviet Republic stay socialists.
    if (earlier?.[0] === 'social-democrat' && !member) return { position: earlier[1], collectionId: earlier[0] };
    const communist = rows.find(a => isCommunist(a.affiliationId)
        || (SOCIALIST_WINDOWS[a.affiliationId] && mostlySocialist(a, SOCIALIST_WINDOWS[a.affiliationId])));
    if (primary && communist && affiliations.get(primary.affiliationId)?.kind !== 'state') return { position: isCommunist(communist.affiliationId) ? redTone(communist.affiliationId) : 'red', collectionId: '' };
    const windows = primary && SOCIALIST_WINDOWS[primary.affiliationId];
    if (windows && (member || mostlySocialist(primary, windows))) return { position: 'red', collectionId: '' };
    return earlier ? { position: earlier[1], collectionId: earlier[0] } : { position: '', collectionId: '' };
}

const personPosition = (activities, collectionIds) => resolvePosition(activities, collectionIds).position;

// The colour a collection carries on its own (the detail head's secondary
// position chips); '' for a collection with no position colour.
const COLLECTION_COLOURS = new Map([...COLLECTION_POSITIONS, ...EARLIER_POSITIONS]);
const collectionPosition = id => COLLECTION_COLOURS.get(id) || '';

// The communist-current collections a red chip names, in preference order.
const RED_COLLECTIONS = ['maoism', 'titoism', 'juche', 'marxism-leninism', 'marxism'];

module.exports = { personPosition, resolvePosition, collectionPosition, RED_LABELS, RED_COLLECTIONS, COLLECTION_POSITIONS, EARLIER_POSITIONS, RED_TONES };
