#!/usr/bin/env bash

docker run \
  -e POSTGRES_PASSWORD="${PGPASSWORD}" \
  -e POSTGRES_USER="${PGUSER}" \
  -e POSTGRES_DB="${PGDATABASE}" \
  --publish 5432:5432 \
  --detach \
  --name postgres \
  -d postgres \
  postgres
