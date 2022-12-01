#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$PG_ADMIN_USERNAME" --dbname "$PG_ADMIN_DATABASE" <<-EOSQL

CREATE SCHEMA $PG_DB_SCHEMA;

CREATE TYPE $PG_DB_SCHEMA.type_enum AS ENUM ('redis', 'postgres');

CREATE TABLE $PG_DB_SCHEMA.Database (
    "id" uuid NOT NULL,
    "name" character varying(50) NOT NULL,
    "type" type_enum NOT NULL,
    "creation_date_time" TIMESTAMP NOT NULL,
    CONSTRAINT "Database_pk" PRIMARY KEY ("id")
);

CREATE TABLE $PG_DB_SCHEMA.User (
    "username" character varying(50) NOT NULL,
    "id" uuid NOT NULL,
    CONSTRAINT "User_pk" PRIMARY KEY ("id")
);

CREATE TABLE $PG_DB_SCHEMA.Query (
    "resource_used" int NOT NULL,
    "creation_date_time" TIMESTAMP NOT NULL,
    "storage_after_query" int NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "Query_pk" PRIMARY KEY ("creation_date_time","database_id"),
    CONSTRAINT "Query_fk0" FOREIGN KEY ("database_id") REFERENCES "Database"("id")
);

CREATE TABLE $PG_DB_SCHEMA.User_Owns_Database (
    "user_id" uuid NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "User_Owns_Database_pk" PRIMARY KEY ("user_id","database_id"),
    CONSTRAINT "User_Owns_Database_fk0" FOREIGN KEY ("database_id") REFERENCES "Database"("id"),
    CONSTRAINT "User_Owns_Database_fk1" FOREIGN KEY ("user_id") REFERENCES "User"("id")
);
EOSQL