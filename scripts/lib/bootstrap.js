// Common bootstrap for scripts that talk to the database. Loads .env from the
// repo root (a no-op inside the container, where the env is already set), so
// a script behaves the same from the host and from `docker exec`. Returns the
// shared pool; call `db.end()` when done so the process exits.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const db = require('../../config/database');
module.exports = { db };
