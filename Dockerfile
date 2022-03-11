#-----------------------------------------------------------------------------------------------------------------------
# Bundle Stage - Do all our bundling of assets
#-----------------------------------------------------------------------------------------------------------------------

FROM node:16 as bundle-builder

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN npm ci --no-fund
RUN npm run build

#-----------------------------------------------------------------------------------------------------------------------
# NPM Stage - Install production packages and clean cache
#-----------------------------------------------------------------------------------------------------------------------

FROM node:16-alpine as npm-builder

COPY --from=bundle-builder /app /app

WORKDIR /app

RUN npm ci --no-fund --production

#-----------------------------------------------------------------------------------------------------------------------
# Final Docker
#-----------------------------------------------------------------------------------------------------------------------

FROM node:16-alpine
EXPOSE 5678

MAINTAINER Christopher S. Case <chris.case@g33xnexus.com>

# Only copy the files we actually need
COPY --from=bundle-builder /app/dist /app/dist
COPY --from=npm-builder /app/node_modules /app/node_modules
COPY --from=bundle-builder /app/package.json /app/

RUN mkdir /app/db

WORKDIR /app

VOLUME /app/db

CMD [ "node", "dist/src/server/server.js",  "# rpgkeeper" ]

#-----------------------------------------------------------------------------------------------------------------------

