// Chat history served from the frontend DB's chat_logs table. Logged-in
// users are scoped by the account id stamped into chat_logs; anonymous
// visitors fall back to their browser fingerprints.
const db = require('./database');

// The WHERE condition for whose rows to read, its values appended to params.
// An account owns its stamped rows plus unstamped ones under the request's
// fingerprints (those bound to it at sign-in, and this browser's own): chats
// saved while the session store was down, or before that browser signed in.
// leninbot's chat store uses the same rule (chat_identity_clause), and its
// startup backfill stamps such rows for good.
function identityClause(params, { accountUserId, fingerprints }) {
    const fps = (fingerprints || []).filter(Boolean);
    if (accountUserId) {
        params.push(accountUserId);
        const account = `$${params.length}`;
        if (!fps.length) return `user_id = ${account}`;
        params.push(fps);
        return `(user_id = ${account} OR (user_id IS NULL AND fingerprint = ANY($${params.length})))`;
    }
    params.push(fps);
    return `fingerprint = ANY($${params.length})`;
}

// Sessions (one row per session_id) for an account or a set of fingerprints,
// newest activity first.
async function listChatSessions({ accountUserId, fingerprints, limit, persona }) {
    const params = [limit];
    const identity = identityClause(params, { accountUserId, fingerprints });
    let personaClause = '';
    if (persona) {
        params.push(persona);
        personaClause = `AND COALESCE(persona, $${params.length}) = $${params.length}`;
    }

    const { rows } = await db.query(
        `SELECT session_id,
                (ARRAY_AGG(user_query ORDER BY created_at ASC) FILTER (WHERE user_query_active))[1] AS first_query,
                MIN(created_at) AS first_at,
                MAX(created_at) AS last_at,
                SUM(user_query_active::int + bot_answer_active::int)::int AS message_count
           FROM chat_logs
          WHERE ${identity}
            AND session_id IS NOT NULL
            AND (user_query_active OR bot_answer_active)
            ${personaClause}
          GROUP BY session_id
          ORDER BY last_at DESC
          LIMIT $1`,
        params
    );
    return rows;
}

// The most recent messages of one session or across sessions, returned oldest
// first. The LIMIT keeps the newest rows, so a session longer than the limit
// loses its beginning rather than its latest turns.
async function listChatHistory({ accountUserId, fingerprints, limit, persona, sessionId }) {
    const params = [limit];
    const clauses = [identityClause(params, { accountUserId, fingerprints })];
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
          ORDER BY created_at DESC, id DESC
          LIMIT $1`,
        params
    );
    return rows.reverse();
}

module.exports = { listChatSessions, listChatHistory };
