const db = require('../../config/database');
const path = require('path');
const { createRegistrySnapshotStore } = require('./snapshot-store');
const { reviewMap } = require('./link-review-policy');
const store = createRegistrySnapshotStore({
    label: 'commulingo link reviews', refreshMs: 60000,
    snapshotPath: process.env.COMMULINGO_LINK_REVIEWS_SNAPSHOT || path.join(__dirname, 'link-reviews-snapshot.json'),
    fetchRows: async () => (await db.query('SELECT * FROM commulingo_link_reviews ORDER BY kind, entity_id, lang, expression')).rows,
    install: reviewMap,
    validateSnapshot: rows => Array.isArray(rows) && rows.every(row => row.source_signature && row.policy),
});
module.exports = { loadLinkReviews: store.load, refreshLinkReviews: store.refresh };
