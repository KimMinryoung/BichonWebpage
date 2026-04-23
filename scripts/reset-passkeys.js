#!/usr/bin/env node
// Emergency recovery: wipe all passkeys (or a specific user's) so the next visit
// to /admin/login enters bootstrap mode and lets an allowlisted IP register a new one.
//
// Usage (inside frontend container):
//   node scripts/reset-passkeys.js                # wipe ALL passkeys
//   node scripts/reset-passkeys.js <username>     # wipe only this user's

require('dotenv').config();
const { Pool } = require('pg');

async function main() {
    const username = process.argv[2];
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    try {
        if (username) {
            const result = await pool.query(
                `DELETE FROM user_passkeys
                  WHERE user_id = (SELECT id FROM users WHERE username = $1)`,
                [username]
            );
            console.log(`Deleted ${result.rowCount} passkey(s) for user "${username}".`);
        } else {
            const result = await pool.query('DELETE FROM user_passkeys');
            console.log(`Deleted ${result.rowCount} passkey(s) (all users).`);
        }
        console.log('Next /admin/login visit from an allowlisted IP will enter bootstrap mode.');
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error('Reset failed:', err.message);
    process.exit(1);
});
