// Hub entries: institutions, parties and doctrines this site's readers meet on
// nearly every page (볼셰비키 1,455 links, 붉은 군대 899, NKVD 610 on
// 2026-10-09 — together 14% of all automatic links). A link there carries
// almost no information, so the dictionary and document prose leave them
// plain; their own pages, related-entry panels and search still reach them.
// Owner decision 2026-10-09 (group A of the hub review); people and events
// (스탈린, 대숙청) were kept linked on purpose.
const LINK_HUBS = new Set([
    'bolshevik', 'red-army', 'nkvd', 'comintern', 'communist-party-of-the-soviet-union',
    'plenum-of-the-central-committee', 'united-nations', 'pravda', 'marxism-leninism', 'sovnarkom',
    'menshevik', 'central-committee-of-the-cpsu', 'planned-economy', 'kgb', 'cheka', 'komsomol',
    'political-commissar', 'social-democracy', 'liberalism', 'general-strike', 'socialist-camp',
    'warsaw-pact', 'north-atlantic-treaty-organization-nato', 'leninism',
].map(id => 'term:' + id));

function isLinkHub(kind, id) {
    return LINK_HUBS.has(kind + ':' + id);
}

module.exports = { LINK_HUBS, isLinkHub };
