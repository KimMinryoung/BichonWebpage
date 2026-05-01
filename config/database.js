const { Pool } = require('pg');

function intFromEnv(name, fallback) {
    const value = Number.parseInt(process.env[name], 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bichon_website',
    application_name: process.env.DB_APPLICATION_NAME || 'leninbot-frontend',
    max: intFromEnv('DB_POOL_MAX', 15),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// DB 연결 실패 이벤트 리스너
pool.on('error', (err) => {
    console.error('[DB Connection Error] Unexpected error on idle client:', err.message);
    console.error('[DB Connection Error] Error code:', err.code);
});

pool.on('connect', (client) => {
    client.query(
        'SELECT set_config($1, $2, false)',
        ['application_name', process.env.DB_APPLICATION_NAME || 'leninbot-frontend']
    ).catch((err) => {
        console.error('[DB Connection Error] Failed to set application_name:', err.message);
    });
    console.debug('[DB Connection] Successfully connected to database');
});

// DB 연결 실패 여부를 확인하는 헬퍼 함수
function isConnectionError(error) {
    const connectionErrorCodes = [
        'ECONNREFUSED',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ECONNRESET',
        'EAI_AGAIN',
        'PROTOCOL_CONNECTION_LOST'
    ];
    return connectionErrorCodes.includes(error.code) ||
           error.message?.includes('connection') ||
           error.message?.includes('connect');
}

// Pre-warm the connection pool at startup
pool.query('SELECT 1').catch(() => {});

module.exports = pool;
module.exports.isConnectionError = isConnectionError;
