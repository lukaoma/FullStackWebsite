#!/bin/sh
set -e

host=$DB_HOST
# shift

until PGPASSWORD=$DB_PASS psql -h "$host" -U "postgres" -c '\q'; do
  echo >&2 "Postgres is unavailable - sleeping"
  sleep 1
done
echo >&2 "Postgres is up"
