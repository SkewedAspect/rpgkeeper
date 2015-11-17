FROM node:5
EXPOSE 5678

MAINTAINER Christopher S. Case <chris.case@g33xnexus.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD . /usr/src/app/

RUN npm install \
	&& npm install grunt-cli \
	&& npm install bower \
	&& ./node_modules/.bin/bower install --allow-root \
	&& ./node_modules/.bin/grunt build \
	&& rm -rf node_modules \
	&& npm install --production

CMD [ "node", "server.js" ]
