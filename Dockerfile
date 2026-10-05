# Runtime image: Node and production dependencies only. The app code is not
# baked in; scripts/deploy mounts a read-only release of the deployed commit at
# /app, so a code change needs no image build. Node resolves packages from
# /node_modules by walking up from /app. The image is rebuilt only when this
# file, package.json or package-lock.json changes (scripts/deploy tags it by
# their hash). Pinned so a rebuild is reproducible; bump with the engines field.
FROM node:24.21.0-alpine
WORKDIR /deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && mv node_modules /node_modules && rm -rf /deps /root/.npm
WORKDIR /app
EXPOSE 3000
# Docker restarts a container whose process exits, but not one that is wedged;
# the health check lets `docker ps` and the restart policy see a hung server.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/health > /dev/null || exit 1
CMD ["node", "server.js"]
