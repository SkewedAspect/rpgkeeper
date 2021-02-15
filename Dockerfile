#-----------------------------------------------------------------------------------------------------------------------
# Bundle Stage - Do all our bundling of assets
#-----------------------------------------------------------------------------------------------------------------------

FROM node:14 as bundle-builder

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN yarn
RUN yarn build:release

#-----------------------------------------------------------------------------------------------------------------------
# Yarn Stage - Install production packages and clean cache
#-----------------------------------------------------------------------------------------------------------------------

FROM node:14-alpine as yarn-builder

COPY --from=bundle-builder /app /app

WORKDIR /app

RUN yarn install --production

#-----------------------------------------------------------------------------------------------------------------------
# Final Docker
#-----------------------------------------------------------------------------------------------------------------------

FROM node:14-alpine
EXPOSE 5678

MAINTAINER Christopher S. Case <chris.case@g33xnexus.com>

# Only copy the files we actually need
COPY --from=yarn-builder /app/dist /app/dist
COPY --from=yarn-builder /app/node_modules /app/node_modules
COPY --from=yarn-builder /app/package.json /app/

RUN mkdir /app/db

WORKDIR /app

VOLUME /app/db

CMD [ "node", "dist/server.js" ]

#-----------------------------------------------------------------------------------------------------------------------

