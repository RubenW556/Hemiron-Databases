# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.

# Setup

> **NOTE**:
>
> Make sure you're in the [`frontend`/`backend`] child project folder of the main databases repo.

## Building for development

Run to build the dev image.
- `docker compose build frontend`

> **NOTE**:
>
> You can skip build if you plan on using `docker compose up --build` to run it.


### Debug images

Debugging for dev
- `docker image build -o docker_build/dev --target development .`

Debugging for prod
- `docker image build -o docker_build/prod --target production .`

## Building for production

Run to build the docker image for production using docker compose.
- `docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml frontend`

Or CLI

- `docker build -t $IMAGE_NAME_FINAL --target production .`
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

- `docker compose up -d frontend`

Monitor the logs

- `docker container logs -f $(docker ps -qf name=dashboard)`

## Production

Running the app with Docker Swarm.

### Network

create swarm network

- `docker network create -d overlay --attachable databases-frontend`

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

- `docker stack deploy --compose-file docker-compose.yaml -c docker-compose.prod.yaml frontend --with-registry-auth --prune`

### Create Swarm stack file

Run `docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml config` to combine base and production compose file.

Suffix with ` > frontend-stack.yml` to output it in a file.

- `docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml config > frontend-stack.yml`

Copy this `frontend-stack.yml` file to the machine where you plan on running the stack.

### Run Swarm stack file

Run  to run the stack.

- `docker stack up -c frontend-stack.yml frontend --with-registry-auth --prune`



## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Further Reading
- https://stackoverflow.com/questions/39868369/run-docker-compose-build-in-gitlab-ci-yml#comment130667415_42697808
- https://docs.gitlab.com/ee/ci/docker/using_docker_build.html
- https://docs.gitlab.com/ee/ci/docker/using_docker_images.html#define-image-in-the-gitlab-ciyml-file
- https://blog.callr.tech/static-blog-hugo-docker-gitlab/
- https://blog.callr.tech/building-docker-images-with-gitlab-ci-best-practices/
- https://michalwojcik.com.pl/2021/01/21/using-cache-in-multi-stage-builds-in-gitlab-ci-docker/
