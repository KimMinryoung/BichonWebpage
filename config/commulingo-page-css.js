// The feature sheets each view needs on top of commulingo-core.css; the
// classes of each feature are in scripts/commulingo-css-features.json.
const PAGE_FEATURES = {
    'public/commulingo-book': ['play', 'event'], // scene cards draw the event map
    'public/commulingo-drill': ['play'],
    'public/commulingo-drill-index': ['play'],
    'public/commulingo-shorts': ['play'],
    'public/commulingo-event': ['event'],
    'public/commulingo-term': ['event'], // the paired event's panel
    'public/commulingo-map': ['world'],
    'public/commulingo-country': ['world'],
    'public/commulingo-internationalist': ['world'],
    'public/commulingo-genealogy': ['genealogy'],
    'public/commulingo-genealogies': ['genealogy'],
    'public/commulingo-politburo': ['politburo'],
};

module.exports = { PAGE_FEATURES };
