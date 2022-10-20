#!/bin/bash

# navigate to folder
cd /home/student/databases

# see all running services
docker service ls

# see all running stacks
docker stack ls

# see all logs of service
docker service logs databases-backend_backend
