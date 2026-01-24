#-----------------------------------------------------------------------------------------------------------------------
# Bundle Stage - Do all our bundling of assets
#-----------------------------------------------------------------------------------------------------------------------

FROM node:22 as bundle-builder

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

# Capture git info during build
RUN git rev-parse --short HEAD 2>/dev/null > /tmp/commit_sha || echo 'unknown' > /tmp/commit_sha
RUN git rev-parse --abbrev-ref HEAD 2>/dev/null > /tmp/commit_ref || echo 'unknown' > /tmp/commit_ref
RUN date -u +%Y-%m-%dT%H:%M:%SZ > /tmp/build_date

RUN npm ci --no-fund
RUN npm run build
RUN npm run db:build-static

#-----------------------------------------------------------------------------------------------------------------------
# NPM Stage - Install production packages and clean cache
#-----------------------------------------------------------------------------------------------------------------------

FROM node:22-alpine as npm-builder

COPY --from=bundle-builder /app /app

WORKDIR /app

RUN npm ci --no-fund --omit=dev

#-----------------------------------------------------------------------------------------------------------------------
# Final Docker
#-----------------------------------------------------------------------------------------------------------------------

FROM node:22-alpine
EXPOSE 5678

MAINTAINER Christopher S. Case <chris.case@g33xnexus.com>

# Copy git info files from build stage
COPY --from=bundle-builder /tmp/commit_sha /tmp/commit_sha
COPY --from=bundle-builder /tmp/commit_ref /tmp/commit_ref
COPY --from=bundle-builder /tmp/build_date /tmp/build_date

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Only copy the files we actually need
COPY --from=bundle-builder /app/dist /app/dist
COPY --from=bundle-builder /app/src/core /app/src/core
COPY --from=bundle-builder /app/src/server /app/src/server
COPY --from=bundle-builder /app/src/systems /app/src/systems
COPY --from=npm-builder /app/node_modules /app/node_modules
COPY --from=bundle-builder /app/package.json /app/
COPY --from=bundle-builder /app/knexfile.ts /app/

# Create db directory and copy static.db
RUN mkdir -p /app/db
COPY --from=bundle-builder /app/db/static.db /app/db/

WORKDIR /app
ADD config/ /app/config/

VOLUME /app/db

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]
CMD [ "npm", "start",  "# rpgkeeper" ]

#-----------------------------------------------------------------------------------------------------------------------

