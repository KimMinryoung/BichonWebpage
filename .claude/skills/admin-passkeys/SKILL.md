---
name: admin-passkeys
description: Admin login and owner-only writer access for this site — the tailnet HTTPS admin origin, WebAuthn RP config, registering additional passkeys, and recovery when all passkeys are lost. Use when working on /admin/*, /writer, passkey/WebAuthn flows, or when tailscale serve config needs recreating.
---

# Admin auth (Passkey / WebAuthn)

- Admin login is passkey-only. No password. IP whitelist (ADMIN_ALLOWED_IPS) is still enforced on `/admin/*`.
- **Admin URL**: `https://leninbot.tail6ecbbc.ts.net:8443/admin/login` — served by `tailscale serve --https=8443` (nginx already owns 443 for the public site). HTTP over Tailscale IP still works for the non-admin public site, but WebAuthn ceremonies need this HTTPS origin. RP_ID = `leninbot.tail6ecbbc.ts.net`, RP_ORIGIN = `https://leninbot.tail6ecbbc.ts.net:8443` (in `.env`).
- Owner-only writer lives on the same tailnet admin origin: `https://leninbot.tail6ecbbc.ts.net:8443/writer`. Public-host `/writer` and `/api/proxy/writer` are intentionally hidden with 404 responses.
- If `tailscale serve` config is ever wiped, recreate: `tailscale serve --bg --https=8443 http://127.0.0.1:3000` (run after `sudo tailscale set --operator=$USER` so sudo isn't needed).
- Bootstrap: when `user_passkeys` is empty, `/admin/login` shows a register form that any allowlisted tailnet device can use to register the first passkey.
- Add more passkeys after login at `/admin/passkeys` (one per device: Galaxy fingerprint, Windows Hello, USB key, …).
- Recovery (lost all passkeys): SSH in and run `docker exec leninbot-frontend node /app/scripts/reset-passkeys.js [username]`. Next `/admin/login` from an allowlisted IP re-enters bootstrap mode.
