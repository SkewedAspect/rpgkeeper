#-----------------------------------------------------------------------------------------------------------------------
# Bundle Stage - Do all our bundling of assets
#-----------------------------------------------------------------------------------------------------------------------

FROM node:dubnium as bundle-builder

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN yarn \
	&& yarn run build \
	&& rm -rf ./node_modules

#-----------------------------------------------------------------------------------------------------------------------
# Yarn Stage - Install production packages and clean cache
#-----------------------------------------------------------------------------------------------------------------------

FROM node:dubnium-alpine as yarn-builder

COPY --from=bundle-builder /app /app

WORKDIR /app

RUN yarn install --production

#-----------------------------------------------------------------------------------------------------------------------
# Final Docker
#-----------------------------------------------------------------------------------------------------------------------

FROM node:dubnium-alpine
EXPOSE 5678

MAINTAINER Christopher S. Case <chris.case@g33xnexus.com>

# Only copy the files we actually need
#COPY --from=yarn-builder /app/db /app/db
COPY --from=yarn-builder /app/dist /app/dist
COPY --from=yarn-builder /app/server /app/server
COPY --from=yarn-builder /app/systems /app/systems
COPY --from=yarn-builder /app/node_modules /app/node_modules
COPY --from=yarn-builder /app/server.js /app/
COPY --from=yarn-builder /app/config.js /app/
COPY --from=yarn-builder /app/package.json /app/

WORKDIR /app

VOLUME /app/db

CMD [ "node", "server.js" ]

#-----------------------------------------------------------------------------------------------------------------------

