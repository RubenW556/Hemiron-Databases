# Databases Backend Api
This is an application that supports
- Local development with Docker Compose
- Local production with Docker Swarm
- GitLab CI/CD Testing, Building and Deployment

This project provides a microservice that provides a NestJS API.

This project uses [Docker](https://docs.docker.com/) and [Nest](https://github.com/nestjs/nest).

### Features

- Feature 1

# Setup

> **NOTE**:
>
> Make sure you're in the [`frontend`/`backend`] child project folder of the main databases repo.

## Building for development

Run to build the dev image.
- `docker compose build backend`

> **NOTE**:
>
> You can skip build if you plan on using `docker compose up --build` to run it.


### Debug images

Debugging for dev
- `docker image build -o docker_build/dev --target development .`

Debugging for prod
- `docker image build -o docker_build/prod --target production .`

## Building for production

CLI:

- `docker build -t registry.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/backend:1.0.0-node18-alpine --target production .`
>  **NOTE**:
>
> If you plan on deploying your image to another machine, make sure to push your image to a repo.
> Check out the Docker docs [here](https://docs.docker.com/docker-hub/repos/#pushing-a-docker-container-image-to-docker-hub)
> if you want to use Docker Hub. (recommended)

>  **NOTE**:
>
> **Composer is _not_ meant to run in production.**
> It is only meant for development or building images.
> Make sure to read [Getting started with swarm mode](https://docs.docker.com/engine/swarm/swarm-tutorial/) and check [this](https://github.com/BretFisher/ama/issues/8)
> if you want to use run your build image on a proper environment. (recommended)

# Deploy

## Development

### Environment variables

Create file `.env` from template `.env.example` and fill in the required environment variable(s).

- `PORT`
- `PINO_LOG_LEVEL`

### Deploy

Deploy the dev image using Docker Compose. This will automatically sync changes you make to the container in real time.

- `docker compose up -d backend`

Monitor the logs

- `docker container logs -f $(docker ps -qf name=api)`

## Production

Running the app with Docker Swarm.

### Network

create swarm network

- `docker network create -d overlay --attachable databases-backend`

### Creating secrets

Create all secrets on the machine you're planning to run your Swarm stack on.

The following environment variables are already assigned in the stack file.

- `TEST_FILE=/run/secrets/TEST_FILE`

Make sure to create a secret on the host machine for each one.

- `echo -n 'admin' |  docker secret create TEST_FILE -`

Make sure to change the variable `admin` to your personal secret value for each secret.

>  **NOTE**:
>
> Creating secrets can be done in multiple ways and may differ depending on your OS.
> Make sure to read the [Docker Documentation](https://docs.docker.com/engine/swarm/secrets/)
> to find the best way on creating a secret in your situation.

### Environment variables

Create file `.env` from template `.env.example` and fill in the required environment variable(s).

#### Required

The following Environment variables are required:

- `PORT` Specify port to expose - default 3000

#### Optional

The following Environment variables can be set, additionally:

- `PINO_LOG_LEVEL`
  Specify logging level. - default log

### Deploy stack

Quickly run your stack file for testing.

- `docker stack deploy --compose-file docker-compose.yaml -c docker-compose.prod.yaml backend --with-registry-auth --prune`

### Create Swarm stack file

Run `docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml config` to combine base and production compose file.

Suffix with ` > backend-stack.yml` to output it in a file.

- `docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml config > backend-stack.yml`

Copy this `backend-stack.yml` file to the machine where you plan on running the stack.

### Run Swarm stack file

Run  to run the stack.

- `docker stack up -c backend-stack.yml backend --with-registry-auth --prune`


# Sources

Few resources used:

- https://docs.npmjs.com/cli/v8/commands/npm-install
- https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file
- https://docs.docker.com/compose/compose-file/compose-file-v3/#deploy
- https://docs.docker.com/compose/environment-variables/
- https://docs.docker.com/compose/production/
- https://docs.docker.com/compose/extends/#multiple-compose-files
- https://docs.docker.com/engine/reference/commandline/build/
- https://docs.docker.com/engine/reference/commandline/secret_create/
- https://docs.docker.com/engine/reference/builder/#dockerignore-file
- https://docs.docker.com/compose/compose-file/compose-file-v3/#resources
- https://docs.docker.com/engine/swarm/secrets/
- https://docs.docker.com/docker-hub/repos/
- https://redis.io/docs/data-types/tutorial/#hashes
- https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/#log-levels-in-pino
- https://www.digitalocean.com/community/tutorials/how-to-build-a-rate-limiter-with-node-js-on-app-platform
- https://docs.docker.com/language/nodejs/run-tests/


# GitLab CI/CD

## Stages
- build
- test
- deploy
- verify

## Triggers:

Only triggers with changes on `main` branch in folder `backend`

## Jobs

- `CI_BUILD_BACKEND`
- `CI_TEST_BACKEND`
- `CI_DEPLOY_BACKEND`
- `CI_VERIFY_BACKEND`

# Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# License

Nest is [MIT licensed](LICENSE).
