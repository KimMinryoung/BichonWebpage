// Starts the CommuLingo admin MCP listener when COMMULINGO_MCP_CLIENTS is set.
const { parseClients } = require('./auth');
const { createMcpApp } = require('./server');
const { recordAudit } = require('./audit');

const tools = [...require('./tools/read'), ...require('./tools/edit'), ...require('./tools/ops')];

function startMcpServer() {
    const clients = parseClients(process.env.COMMULINGO_MCP_CLIENTS);
    if (!clients.length) return null;
    const port = Number.parseInt(process.env.MCP_PORT || '3100', 10);
    const server = createMcpApp({ clients, tools, recordAudit }).listen(port, () => {
        console.log(`[mcp] listening on ${port} for ${clients.map(c => c.name).join(', ')}`);
    });
    server.on('error', err => console.error('[mcp] listen failed:', err.code || '', err.message));
    return server;
}

module.exports = { startMcpServer, tools };
