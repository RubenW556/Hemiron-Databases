# Common build stage
FROM node:16-alpine

COPY . /app

WORKDIR /app

RUN npm ci

ENTRYPOINT ["npm", "run", "start"]
