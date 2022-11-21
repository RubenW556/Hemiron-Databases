###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# set ports to open
ARG PORT=3000
ENV PORT $PORT

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./


# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run test
RUN npm run lint
RUN npm run test:e2e
RUN npm run test:cov
RUN npm audit


# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
#removed: RUN apk add --update nodejs nodejs-npm

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# BUILD FOR ANALYSIS
###################

# docker image with specific version to prevent update changes
# dind = docker in docker
# alpine so it is lightweight
#FROM docker:20.10.21-dind-alpine3.16 As analysis

FROM node:18-alpine As analysis

# Create app directory
WORKDIR /usr/src/app

#below more advanced version of adduser that disables password to prevent the error: "New password: passwd: password for node is unchanged"
#RUN adduser -D -g '' node

#below is even more advanced version of adding user, in which we only add user if not already existing
RUN adduser -D -g '' node || echo "User node already exists."

#Copy source files
COPY --chown=node:node . .

# copy the package.lock and package files
COPY package*.json ./

# In order to run `npm ci` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules


#install docker
RUN npm install -g docker

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node sonar-scanner .

#config requirements for Sonarqube
RUN sysctl -w vm.max_map_count=524288
RUN sysctl -w fs.file-max=131072
RUN ulimit -n 131072
RUN ulimit -u 8192


# Download sonarqube
RUN docker pull sonarqube:7.9.4-community

#host sonarqube on localhost:9000
RUN docker run --name sonarqube -h sonarqube -p 9000:9000 -d sonarqube:7.9.4-community

#host sonarcube on localhost (this is the old version that worked locally)
#RUN docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:7.9.4-community

#connect sonar_scanner to scan code and connect to sonarqube and send data to sonarqube
RUN sonar-scanner.bat -D"sonar.projectKey=databases" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=b7ca982736a0bdb72ee2e788898402e41b751d97"


###################
# PRODUCTION
###################

# Use apline package to keep it small
FROM node:18-alpine As production

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# set ports to open
ARG PORT=3000
ENV PORT $PORT

# Install node, which is all we require!
#RUN apk add --update \
#    && apk add --no-cache nodejs-current

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

#Expose port 3000
EXPOSE ${PORT}

# check every 30s to ensure this service returns HTTP 200
#HEALTHCHECK --interval=30s CMD wget --no-verbose --tries=1 --spider http://0.0.0.0:$PORT/v1/healthz #todo

USER node

# Start the server using the production build
CMD [ "node", "--max_old_space_size=450", "dist/main.js" ]
