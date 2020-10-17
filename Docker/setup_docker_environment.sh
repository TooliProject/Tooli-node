#!/usr/bin/env bash

docker network create tooli
docker stop postgres || true && docker rm postgres || true
docker run \
  -e POSTGRES_PASSWORD="${PGPASSWORD}" \
  -e POSTGRES_USER="${PGUSER}" \
  -e POSTGRES_DB="${PGDATABASE}" \
  --publish 5432:5432 \
  --detach \
  --name postgres \
  -d postgres \
  postgres

docker network connect tooli postgres

# Sleep for a second to wait for postgres to get ready
sleep 1

docker cp ./database.sql postgres:/docker-entrypoint-initdb.d/database.sql

docker exec postgres psql tooli "${PGUSER}" -f docker-entrypoint-initdb.d/database.sql