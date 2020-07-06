#!/bin/bash
docker stop tooli-mysql
docker rm tooli-mysql
docker run \
  -p 3306:3306 \
  --name tooli-mysql \
  -e MYSQL_ROOT_PASSWORD="admin" \
  -d mysql:latest