cd databases

docker pull registry.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/backend:latest
docker pull registry.inf-hsleiden.nl/2223.ipsenh-p1-p2/databases/frontend:latest

docker stack deploy -c docker-stack.yml databases
