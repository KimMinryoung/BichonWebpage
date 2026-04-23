#!/usr/bin/env node
// Apply a SQL migration file against the configured database.
// Usage (from inside the frontend container):
//   node scripts/apply-migration.js scripts/migrations/001_webauthn.sql

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function main() {
    const file = process.argv[2];
    if (!file) {
        console.error('Usage: node scripts/apply-migration.js <path/to/file.sql>');
        process.exit(2);
    }
    const sql = fs.readFileSync(path.resolve(file), 'utf8');

    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    console.log(`Applying ${file} to ${process.env.DB_HOST}/${process.env.DB_NAME}…`);
    const client = await pool.connect();
    try {
        await client.query(sql);
        console.log('Migration applied.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
});
