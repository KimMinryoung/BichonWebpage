// Starts the CommuLingo admin MCP listener when COMMULINGO_MCP_CLIENTS is set.
const { parseClients } = require('./auth');
const { createMcpApp } = require('./server');
const { recordAudit } = require('./audit');

const { outPathArg } = require('./spec');

// Reads whose results run long or feed a later edit; each takes outPath
// (spec.js writeExport, applied in server.js callTool).
const EXPORTABLE = new Set(['person_get', 'term_get', 'event_get', 'event_raw', 'doc_get', 'data_document_get', 'sql_read',
    'link_reviews_list', 'dataset_rows', 'person_events']);

const tools = [...require('./tools/read'), ...require('./tools/data'), ...require('./tools/edit'), ...require('./tools/content'),
    ...require('./tools/ops')].map(tool => (EXPORTABLE.has(tool.name)
    ? { ...tool, exportable: true, inputSchema: { ...tool.inputSchema, properties: { ...tool.inputSchema.properties, outPath: outPathArg } } }
    : tool));

function startMcpServer({ ready } = {}) {
    const clients = parseClients(process.env.COMMULINGO_MCP_CLIENTS);
    if (!clients.length) return null;
    const port = Number.parseInt(process.env.MCP_PORT || '3100', 10);
    const server = createMcpApp({ clients, tools, recordAudit, ready }).listen(port, () => {
        console.log(`[mcp] listening on ${port} for ${clients.map(c => c.name).join(', ')}`);
    });
    server.on('error', err => console.error('[mcp] listen failed:', err.code || '', err.message));
    return server;
}

module.exports = { startMcpServer, tools };
