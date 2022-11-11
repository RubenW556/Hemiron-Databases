#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$PG_ADMIN_USERNAME" --dbname "$PG_ADMIN_DATABASE" <<-EOSQL

	CREATE SCHEMA "$PG_DB_SCHEMA";

  CREATE TABLE $PG_DB_SCHEMA.Test (
    "database_id" serial NOT NULL,
    "database_name" character varying(50) NOT NULL
  ) WITH (
    OIDS=FALSE
  );

EOSQL