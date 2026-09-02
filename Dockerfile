# Pinned so a rebuild is reproducible; bump deliberately with the engines field.
FROM node:20.20.2-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
# Asset cache-busting version (server.js ASSET_VERSION). Passed by
# scripts/deploy; without it the server falls back to boot-time Date.now(),
# which invalidates the whole Cloudflare CSS/JS cache on every restart.
ARG GIT_SHA=""
ENV GIT_SHA=$GIT_SHA
EXPOSE 3000
# Docker restarts a container whose process exits, but not one that is wedged;
# the health check lets `docker ps` and the restart policy see a hung server.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/health > /dev/null || exit 1
CMD ["node", "server.js"]
