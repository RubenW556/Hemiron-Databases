###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

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

# Expose port for ng serve
EXPOSE 4200

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package files
COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Angular CLI.
# The Angular CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Copy source files
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Use the node user from the image (instead of the root user)
USER node

###################
# PRODUCTION
###################

FROM nginx:1.23.1-alpine AS production

#Copy files from build image to default nginx html folder
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html
