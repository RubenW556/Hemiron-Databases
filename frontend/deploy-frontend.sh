#!/bin/bash

# navigate to folder
cd /home/student/databases

ls -l
# create network if not exists
docker network create -d overlay --attachable databases-frontend
# deploy stack
docker stack deploy -c frontend-stack.yml databases-frontend --with-registry-auth --prune
docker service ls
