## Runner setup

[//]: # (todo compose file)
Create config volume 
- `docker volume create gitlab-runner-config`

Start the GitLab Runner container using the volume we just created:
```shell
docker run -d --name gitlab-runner --restart always \
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
image: docker:latest

CI_PRE_CHECK:
  stage: pre-check
  tags:
    - swarm
  script:
    - echo "pre checking"
    - ls -l
    - docker version
    - docker container ls
    - docker images

CI_BUILD:
  stage: build
  tags:
    - swarm
  script:
    - echo "building"

CI_TEST:
  stage: test
  tags:
    - swarm
  script:
    - echo "Testing"
```

## Sources

- https://gitlab.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/-/settings/ci_cd
- https://docs.gitlab.com/runner/install/docker.html
- https://docs.gitlab.com/runner/register/index.html#docker
- https://docs.gitlab.com/ee/ci/jobs/job_control.html#onlychanges--exceptchanges-examples