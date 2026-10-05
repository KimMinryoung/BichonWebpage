// `ops` scope: operator diagnostics. Never deploys, migrates or purges.
const { object } = require('../schema');

module.exports = [
    {
        scope: 'ops',
        name: 'service_status',
        description: 'Running frontend revision, uptime, Postgres/Redis readiness and memory.',
        inputSchema: object({}),
        async handler() {
            const { readiness } = require('../../utils/readiness');
            const memory = process.memoryUsage();
            return {
                revision: process.env.GIT_SHA || null,
                nodeEnv: process.env.NODE_ENV || 'development',
                uptimeSeconds: Math.round(process.uptime()),
                ready: await readiness(),
                memoryMb: { rss: Math.round(memory.rss / 1048576), heapUsed: Math.round(memory.heapUsed / 1048576) },
            };
        },
    },
];
