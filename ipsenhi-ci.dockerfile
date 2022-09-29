FROM node:16-alpine

RUN apk add chromium
ENV CHROME_BIN=/usr/bin/chromium-browser

RUN apk add docker docker-compose

RUN apk add openssh
