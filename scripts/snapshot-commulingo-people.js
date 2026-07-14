#!/usr/bin/env node
// Build the CommuLingo people snapshot from the DB and write it to
// data/commulingo/people-snapshot.json (the file the site serves from).
//
// The running app refreshes this snapshot on a background timer, but this script
// lets you pre-warm it on deploy or force a rebuild by hand:
//   node scripts/snapshot-commulingo-people.js
//
// Must run where the DB is reachable (inside the frontend container).
const { snapshotCommuLingoPeople, SNAPSHOT_PATH } = require('../data/commulingo/people-store');

(async () => {
    try {
        const { people } = await snapshotCommuLingoPeople();
        console.log(`Wrote ${people} people to ${SNAPSHOT_PATH}`);
        process.exit(0);
    } catch (err) {
        console.error('Snapshot failed:', err.message);
        process.exit(1);
    }
})();
