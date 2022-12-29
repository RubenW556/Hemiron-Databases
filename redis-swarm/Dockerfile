FROM redis:7-alpine
# redis:7-alpine is the current latest version: 28-12-2022
# not using 'redis:latest' to prevent potential updates that require the code to be refactored

COPY redis.conf /data/etc/redis/redis.conf
CMD [ "redis-server", "/data/etc/redis/redis.conf" ]
# using custom conf file because the standard port bind is 127.0.0.0, our port bind is 0.0.0.0