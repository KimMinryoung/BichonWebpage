FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
# Asset cache-busting version (server.js ASSET_VERSION). Passed by
# scripts/deploy; without it the server falls back to boot-time Date.now(),
# which invalidates the whole Cloudflare CSS/JS cache on every restart.
ARG GIT_SHA=""
ENV GIT_SHA=$GIT_SHA
EXPOSE 3000
CMD ["node", "server.js"]
