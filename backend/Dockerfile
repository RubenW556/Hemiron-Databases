###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Install node, which is all we require!
#RUN apk add --update \
#    && apk add --no-cache nodejs-current

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
# TEST FROM DEVELOPMENT
###################

FROM development As test

WORKDIR /usr/src/app

# Run the tests
CMD [ "npm", "run", "test" ]

###################
# TEST:COV FROM DEVELOPMENT
###################

FROM development As test-cov

WORKDIR /usr/src/app

# Run the tests
CMD [ "npm", "run", "test:cov" ]

###################
# TEST:E2E FROM DEVELOPMENT
###################

FROM development As test-e2e

WORKDIR /usr/src/app

# Run the tests
CMD [ "npm", "run", "test:e2e" ]

###################
# LINT FROM DEVELOPMENT
###################

FROM development As lint

WORKDIR /usr/src/app

# Run the lint
CMD [ "npm", "run", "lint" ]

###################
# AUDIT FROM DEVELOPMENT
###################

FROM development As audit

WORKDIR /usr/src/app

# Run the audit
CMD [ "npm", "audit" ]

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
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --only=production && npm cache clean --force

USER node
###################
# PRODUCTION
###################

FROM node:18-alpine As production

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
# set ports to open
ARG PORT=3000
ENV PORT $PORT

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

#Expose port 3000
EXPOSE ${PORT}

# check every 30s to ensure this service returns HTTP 200
#HEALTHCHECK --interval=30s CMD wget --no-verbose --tries=1 --spider http://0.0.0.0:$PORT/v1/healthz #todo aanmaken endpoints

USER node

# Start the server using the production build
CMD [ "node", "--max_old_space_size=450", "dist/main.js" ]