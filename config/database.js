const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bichon_website',
    max: 10,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// DB 연결 실패 이벤트 리스너
pool.on('error', (err) => {
    console.error('[DB Connection Error] Unexpected error on idle client:', err.message);
    console.error('[DB Connection Error] Error code:', err.code);
});

pool.on('connect', () => {
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

module.exports = pool;
module.exports.isConnectionError = isConnectionError;
