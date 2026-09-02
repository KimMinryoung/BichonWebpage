// Chat history served from the frontend DB's chat_logs table. Logged-in
// users are scoped by the account id stamped into chat_logs; anonymous
// visitors fall back to their browser fingerprints.
const db = require('./database');

// Sessions (one row per session_id) for an account or a set of fingerprints,
// newest activity first.
async function listChatSessions({ accountUserId, fingerprints, limit, persona }) {
    const params = [accountUserId || fingerprints, limit];
    const identityClause = accountUserId ? 'user_id = $1' : 'fingerprint = ANY($1)';
    const personaClause = persona ? 'AND COALESCE(persona, $3) = $3' : '';
    if (persona) params.push(persona);

    const { rows } = await db.query(
        `SELECT session_id,
                (ARRAY_AGG(user_query ORDER BY created_at ASC) FILTER (WHERE user_query_active))[1] AS first_query,
                MIN(created_at) AS first_at,
                MAX(created_at) AS last_at,
                SUM(user_query_active::int + bot_answer_active::int)::int AS message_count
           FROM chat_logs
          WHERE ${identityClause}
            AND session_id IS NOT NULL
            AND (user_query_active OR bot_answer_active)
            ${personaClause}
          GROUP BY session_id
          ORDER BY last_at DESC
          LIMIT $2`,
        params
    );
    return rows;
}

// Messages for one session (oldest first) or the most recent ones across
// sessions (returned oldest first as well).
async function listChatHistory({ accountUserId, fingerprints, limit, persona, sessionId }) {
    const params = [accountUserId || fingerprints, limit];
    const clauses = [accountUserId ? 'user_id = $1' : 'fingerprint = ANY($1)'];
    if (sessionId) {
        params.push(sessionId);
        clauses.push(`session_id = $${params.length}`);
    }
    if (persona) {
        params.push(persona);
        clauses.push(`COALESCE(persona, $${params.length}) = $${params.length}`);
    }

    const { rows } = await db.query(
        `SELECT id AS message_id,
                CASE WHEN user_query_active THEN user_query ELSE NULL END AS user_query,
                CASE WHEN bot_answer_active THEN bot_answer ELSE NULL END AS bot_answer,
                user_query_active,
                bot_answer_active,
                route,
                documents_count,
                web_search_used,
                strategy,
                processing_logs,
                fingerprint,
                session_id,
                persona,
                created_at
           FROM chat_logs
          WHERE ${clauses.join(' AND ')}
          ORDER BY created_at ${sessionId ? 'ASC' : 'DESC'}
          LIMIT $2`,
        params
    );
    return sessionId ? rows : rows.reverse();
}

module.exports = { listChatSessions, listChatHistory };
