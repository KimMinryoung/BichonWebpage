#!/usr/bin/env node

const { buildCommuLingoShards } = require('../data/commulingo/shards');

try {
    const result = buildCommuLingoShards();
    console.log(JSON.stringify({ ok: true, ...result }));
} catch (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
}
