#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$PG_ADMIN_USERNAME" --dbname "$PG_ADMIN_DATABASE" <<-EOSQL

	CREATE SCHEMA $PG_DB_SCHEMA;

CREATE TABLE $PG_DB_SCHEMA.Database (
	"database_id" uuid NOT NULL,
	"database_name" character varying(50) NOT NULL,
	"database_type" character varying(15) NOT NULL,
	"creation_date" DATE NOT NULL,
	CONSTRAINT "Database_pk" PRIMARY KEY ("database_id")
) WITH (
  OIDS=FALSE
);

  CREATE TABLE $PG_DB_SCHEMA.User (
    "username" character varying(50) NOT NULL,
    "user_id" uuid NOT NULL,
    CONSTRAINT "User_pk" PRIMARY KEY ("user_id")
  ) WITH (
    OIDS=FALSE
  );

  CREATE TABLE $PG_DB_SCHEMA.Query (
    "resource_used" int NOT NULL,
    "datetime" TIMESTAMP NOT NULL,
    "storage_after_query" int NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "Query_pk" PRIMARY KEY ("datetime","database_id")
  ) WITH (
    OIDS=FALSE
  );

  CREATE TABLE $PG_DB_SCHEMA.User_Owns_Database (
    "user_id" uuid NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "User_Owns_Database_pk" PRIMARY KEY ("user_id","database_id")
  ) WITH (
    OIDS=FALSE
  );


  ALTER TABLE $PG_DB_SCHEMA.Query ADD CONSTRAINT "Query_fk0" FOREIGN KEY ("database_id") REFERENCES $PG_DB_SCHEMA.Database("database_id");

  ALTER TABLE $PG_DB_SCHEMA.User_Owns_Database ADD CONSTRAINT "User_Owns_Database_fk0" FOREIGN KEY ("user_id") REFERENCES $PG_DB_SCHEMA.User("user_id");
  ALTER TABLE $PG_DB_SCHEMA.User_Owns_Database ADD CONSTRAINT "User_Owns_Database_fk1" FOREIGN KEY ("database_id") REFERENCES $PG_DB_SCHEMA.Database("database_id");

EOSQL
