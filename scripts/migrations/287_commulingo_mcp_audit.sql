-- CommuLingo admin MCP write audit (dev_docs/commulingo-admin-mcp.md).
-- One row per edit-scope tool call: which client token, which tool, the actor
-- it wrote as, the target and the outcome. Arguments are stored only as a
-- hash; the editorial tables keep the content history.
CREATE TABLE IF NOT EXISTS commulingo_mcp_audit (
    id          BIGSERIAL PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    client      TEXT NOT NULL,
    tool        TEXT NOT NULL,
    command     TEXT,
    target_type TEXT,
    target_id   TEXT,
    actor       TEXT,
    outcome     TEXT NOT NULL CHECK (outcome IN ('ok', 'rejected', 'error')),
    args_hash   TEXT NOT NULL,
    result      JSONB,
    error       TEXT,
    duration_ms INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS commulingo_mcp_audit_created_idx ON commulingo_mcp_audit (created_at DESC);
CREATE INDEX IF NOT EXISTS commulingo_mcp_audit_target_idx ON commulingo_mcp_audit (target_type, target_id);
GRANT SELECT, INSERT ON commulingo_mcp_audit TO frontend;
GRANT USAGE ON SEQUENCE commulingo_mcp_audit_id_seq TO frontend;
