# Image for the browser tests (scripts/test --browser / --all on a host whose
# node is older than 24): the app's Node with Playwright's Chromium and the
# system libraries it needs. scripts/test builds it on first use, tagged with
# the Playwright version in package-lock, so an upgrade builds a new one.
FROM node:24.22.1-bookworm-slim
ARG PLAYWRIGHT_VERSION
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx -y "playwright@${PLAYWRIGHT_VERSION}" install --with-deps chromium \
    && chmod -R a+rX /ms-playwright \
    && rm -rf /root/.npm /var/lib/apt/lists/*
