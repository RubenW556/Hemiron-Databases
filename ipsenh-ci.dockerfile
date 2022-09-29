FROM node:16-alpine

RUN npm install -g eslint jest

RUN apk add chromium
ENV CHROME_BIN=/usr/bin/chromium-browser

RUN apk add docker docker-compose

RUN apk add openssh
