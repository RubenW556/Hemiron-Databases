# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.

## Running with docker

```bash
# development build
docker compose up --build

# production build 
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml build

# production mode
docker stack deploy --compose-file docker-compose.yaml -c docker-compose.prod.yaml frontend --with-registry-auth --prune
 
# create swarm network
docker network create -d overlay --attachable databases-frontend

# debug images
docker image build -o docker_build/dev --target development .
docker image build -o docker_build/prod --target production .
```


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

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
