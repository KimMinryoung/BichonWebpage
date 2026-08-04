// One place for the LeninBot upstream base URLs and the admin-key header.
// Runtime values come from .env; the defaults only matter when an env var is
// missing. (routes/admin.js used to fall back to https://leninbot.duckdns.org
// while everything else fell back to the Docker-host URLs — CHAT_API_URL is
// always set in production, so no runtime behavior hinged on the difference.)
const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const WRITER_API_URL = process.env.WRITER_API_URL || 'http://172.17.0.1:8001';
const EMAIL_API_URL = process.env.EMAIL_API_URL || 'http://172.17.0.1:8002';
const A2A_API_URL = process.env.A2A_API_URL || 'http://172.17.0.1:8003';
const LENINBOT_ADMIN_KEY = process.env.LENINBOT_ADMIN_KEY || '';

function leninbotAdminHeaders(extra = {}) {
    return { 'X-Admin-Key': LENINBOT_ADMIN_KEY, ...extra };
}

module.exports = {
    CHAT_API_URL,
    WRITER_API_URL,
    EMAIL_API_URL,
    A2A_API_URL,
    LENINBOT_ADMIN_KEY,
    leninbotAdminHeaders,
};
