const { Pool } = require('pg');
const { intFromEnv } = require('./env');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bichon_website',
    application_name: process.env.DB_APPLICATION_NAME || 'leninbot-frontend',
    max: intFromEnv('DB_POOL_MAX', 15),
    // Keep a couple of connections warm between the snapshot stores' refresh
    // bursts — the pg default 10s idle reap emptied the pool every cycle and
    // each refresh paid ~20 fresh TCP+auth handshakes.
    min: intFromEnv('DB_POOL_MIN', 2),
    idleTimeoutMillis: intFromEnv('DB_IDLE_TIMEOUT_MS', 300000),
    // The DB is the local leninbot-pg container on the same Docker network;
    // fail fast instead of letting requests hang when it is down.
    connectionTimeoutMillis: intFromEnv('DB_CONNECT_TIMEOUT_MS', 3000),
    // A runaway query must not pin a pool connection for the whole nginx
    // 600 s read timeout; nothing the site runs legitimately takes a minute.
    statement_timeout: intFromEnv('DB_STATEMENT_TIMEOUT_MS', 60000),
    keepAlive: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// DB 연결 실패 이벤트 리스너
pool.on('error', (err) => {
    console.error('[DB Connection Error] Unexpected error on idle client:', err.message);
    console.error('[DB Connection Error] Error code:', err.code);
});

// application_name is sent as a startup parameter from the Pool config above,
// so no per-connection set_config round-trip is needed.
pool.on('connect', () => {
    if (process.env.DB_LOG_CONNECTIONS === 'true') {
        console.debug('[DB Connection] Opened a new pool connection');
    }
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
pool.query('SELECT 1')
    .then(() => console.info('[DB] Connection pool ready'))
    .catch((err) => {
        console.error('[DB Connection Error] Initial connection failed:', err.message);
    });

module.exports = pool;
module.exports.isConnectionError = isConnectionError;
