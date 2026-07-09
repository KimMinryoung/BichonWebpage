# AGENTS.md

This repository runs the production frontend as the `leninbot-frontend` Docker container.

## Deployment Safety

- Do not recreate or restart the production `leninbot-frontend` container with an ad hoc `docker run`.
- Use `scripts/deploy --restart` for production restarts so the required labels, host data mount, Redis network, and IPv6 network are applied consistently.
- The frontend connects directly to Supabase Postgres. Supabase resolves to IPv6 for this host, so the production container must be connected to both `leninbot_default` and `leninbot_ipv6`.
- If recent posts, reports, hub curations, or diary entries suddenly render as empty, check `docker logs leninbot-frontend` for `ENETUNREACH ... :5432`.
- Verify container networks with:

```bash
docker inspect leninbot-frontend --format '{{range $name,$net := .NetworkSettings.Networks}}{{println $name $net.IPAddress $net.GlobalIPv6Address}}{{end}}'
```

- If `leninbot_ipv6` is missing, reconnect it:

```bash
docker network connect leninbot_ipv6 leninbot-frontend
```

Then verify `/`, `/posts`, `/reports`, `/hub`, and `/ai-diary` show content again.
