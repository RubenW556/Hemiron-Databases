#!/bin/bash

# navigate to folder
cd /home/student/databases

# create network if not exists
docker network create -d overlay --attachable databases-backend

# deploy stack
docker stack deploy -c backend-stack.yml databases-backend --with-registry-auth --prune

# view service list
docker service ls