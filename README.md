## Runner setup

Create config volume 
- `docker volume create gitlab-runner-config`

Start the GitLab Runner container using the volume we just created:
```shell
docker run -d --name gitlab-runner-1 --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v gitlab-runner-config:/etc/gitlab-runner \
  gitlab/gitlab-runner:latest
  ```
Run the register command
1. `docker run --rm -it -v gitlab-runner-config:/etc/gitlab-runner gitlab/gitlab-runner:latest register`
2. Enter your GitLab [instance URL](https://gitlab.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/-/settings/ci_cd).
3. Enter the [token](https://gitlab.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/-/settings/ci_cd) you obtained to register the runner.
4. Enter a description for the runner. You can change this value later in the GitLab user interface.
5. Enter the tags associated with the runner, separated by commas. You can change this value later in the GitLab user interface.
6. Enter any optional maintenance note for the runner.
7. Provide the runner executor. Enter `docker`.
8. Enter the default image to be used for projects that do not define one in `.gitlab-ci.yml`: `ubuntu:latest`
9. Verify the runner got added under [Available specific runners](https://gitlab.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/-/settings/ci_cd)

## Pipeline setup

Basic pipeline template that check if docker is installed. Uses runners with swarm tag.

```yaml
stages:
  - pre-check
  - build
  - test
  - deploy
  - verify
image: docker:latest
```

Specify few reused configs in a template

```yaml
.job_docker_template: &template
  retry: 2
  tags:
    - swarm
  only:
    refs:
      - branch
    changes:
      - folder/**/*
```

Few checks before running other jobs

```yaml
CI_PRE_CHECK:
  stage: pre-check
  <<: *template
  allow_failure: true #On failure All jobs after this one, will not halt.
  script:
    - echo "pre checking"
    - ls -l
    - docker version
#    - userdump #test failure. All jobs after this one, not ran (with allow_failure false).
```
Generic build template
```yaml
CI_BUILD_BACKEND:
  stage: build
  variables:
    BASE_IMAGE: node18-alpine
    PROJECT_ID: backend
    IMAGE_NAME_FINAL: $IMAGE_NAME_BASE/$PROJECT_ID:1.0.$CI_PIPELINE_IID-$BASE_IMAGE
  <<: *template
  needs: [CI_PRE_CHECK] # dependent on CI_PRE_CHECK.
  #    when: manual # only execute when approved manually
  before_script:
    - echo "building for production"
    - docker login -u pipeline -p $BUILD_TOKEN $CI_REGISTRY
  script:
    - docker build -t $IMAGE_NAME_FINAL --target production $PROJECT_ID/.
  after_script:
    - docker image push $IMAGE_NAME_FINAL # push with versioning
    - docker image tag $IMAGE_NAME_FINAL $IMAGE_NAME_BASE/$PROJECT_ID:production # retag same image and push with production tag
    - docker image push $IMAGE_NAME_BASE/$PROJECT_ID:production
    - docker images ls
  artifacts: # create artifact when job fails
    name: $IMAGE_NAME_FINAL
    when: on_failure
    paths:
      - ./
    expire_in: 2 days
    exclude:
      - .gitlab-ci.yml

CI_TEST:
  stage: test
  tags:
    - swarm
  script:
    - echo "Testing"
```

Add a cleanup for all runners

```yaml

CI_Cleanup:
  stage: test
  parallel: 5 # we have 5 runners
  <<: *template
  script:
    - docker image prune -a -f # cleanup unused images after each time to reduce disk space waste
```

## Remote trigger

1. Go to [pipeline triggers](https://gitlab.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/-/settings/ci_cd#js-pipeline-triggers)
2. Add trigger
3. Run Curl command and replace `TOKEN` with your token and `REF_NAME` with your branch
```
curl -X POST \
--fail \
-F token=TOKEN \
-F ref=REF_NAME \
https://gitlab.inf-hsleiden.nl/api/v4/projects/537/trigger/pipeline
```

[link to sonarqube readme](sonarqube/README.md) \
[link to backend readme](backend/README.md) \
[link to postgresql readme](postgresql/README.md)
## Sources

- https://gitlab.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/-/settings/ci_cd
- https://docs.gitlab.com/runner/install/docker.html
- https://docs.gitlab.com/runner/register/index.html#docker
- https://docs.gitlab.com/ee/ci/jobs/job_control.html#onlychanges--exceptchanges-examples