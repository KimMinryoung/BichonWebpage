const db = require('../../config/database');
const { transaction } = require('../../utils/db-transaction');

// All queries forming one dictionary use one MVCC snapshot and connection
// (their Promise.all runs one query at a time: utils/db-transaction.js).
function readSnapshot(callback) {
    return transaction(callback, { snapshot: true, pool: db });
}

module.exports = { readSnapshot };
