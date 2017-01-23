FROM node:7
EXPOSE 5678

MAINTAINER Christopher S. Case <chris.case@g33xnexus.com>

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN npm install \
	&& npm install grunt-cli \
	&& ./node_modules/.bin/grunt build

CMD [ "node", "server.js" ]
