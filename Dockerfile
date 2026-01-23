#-----------------------------------------------------------------------------------------------------------------------
# Bundle Stage - Do all our bundling of assets
#-----------------------------------------------------------------------------------------------------------------------

FROM node:22 as bundle-builder

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN npm ci --no-fund
RUN npm run build

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

# Only copy the files we actually need
COPY --from=bundle-builder /app/dist /app/dist
COPY --from=bundle-builder /app/src/core /app/src/core
COPY --from=bundle-builder /app/src/server /app/src/server
COPY --from=bundle-builder /app/src/systems /app/src/systems
COPY --from=npm-builder /app/node_modules /app/node_modules
COPY --from=bundle-builder /app/package.json /app/
COPY --from=bundle-builder /app/knexfile.ts /app/

RUN mkdir /app/db

WORKDIR /app
ADD config/ /app/config/

VOLUME /app/db

CMD [ "npm", "start",  "# rpgkeeper" ]

#-----------------------------------------------------------------------------------------------------------------------

