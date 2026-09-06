# AGENTS.md

This repository runs the production frontend as the `leninbot-frontend` Docker container.
When operating from the `root` account:

1. Create and modify project files as the `grass` user so that file ownership is assigned to `grass`, not `root`.
2. Run all Git commands as the `grass` user. Do not perform Git operations as `root`.


## Deployment Safety

- Do not recreate or restart the production `leninbot-frontend` container with an ad hoc `docker run`.
- Use `scripts/deploy --restart` for production restarts so the required labels, host data mount, and the `leninbot_default` network are applied consistently.
- The frontend connects to the local `leninbot-pg` Postgres container (`DB_HOST=leninbot-pg`) over the `leninbot_default` Docker network — the same network used for Redis. (The DB migrated off Supabase in July 2026; the old `leninbot_ipv6` network is no longer needed.)
- If recent posts, reports, hub curations, or diary entries suddenly render as empty, check `docker logs leninbot-frontend` for connection errors to `:5432`, then check that `leninbot-pg` is healthy (`docker ps`) and that both containers share `leninbot_default`:

```bash
docker inspect leninbot-frontend --format '{{range $name,$net := .NetworkSettings.Networks}}{{println $name $net.IPAddress}}{{end}}'
docker network connect leninbot_default leninbot-frontend  # if missing
```

Then verify `/`, `/posts`, `/reports`, `/hub`, and `/ai-diary` show content again.

## Context and task references

- Stack: Node.js/Express, EJS, PostgreSQL. Public site: cyber-lenin.com.
- Read only the task-relevant document from [dev_docs/README.md](dev_docs/README.md); do not load every handoff or old project memory.
- Strike game: [design and implementation](dev_docs/strike-game-handoff.md).
- Deploy, preview, data/cache, auth: [operations reference](dev_docs/frontend-operations.md).
- CommuLingo people must go through the Admin store/upsert tool; do not bypass validation with direct INSERTs. Host-mounted data changes affect production immediately.
- Verify visual changes with the browser. Read user-referenced screenshots before diagnosing them.
- Keep this file limited to enduring constraints and routing links. Put formulas, procedures and completed-work history in topic documents. Current user instructions take precedence over past preferences.
