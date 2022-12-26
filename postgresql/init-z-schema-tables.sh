set -e

psql -v ON_ERROR_STOP=1 --username "$PG_ADMIN_USERNAME" --dbname "$PG_ADMIN_DATABASE" <<-EOSQL

CREATE SCHEMA $PG_DB_SCHEMA;

CREATE TYPE $PG_DB_SCHEMA.type_enum AS ENUM ('redis', 'postgres');

CREATE TABLE $PG_DB_SCHEMA.database (
    "id" uuid NOT NULL,
    "name" character varying(50) NOT NULL,
    "type" $PG_DB_SCHEMA.type_enum NOT NULL,
    "creation_date_time" TIMESTAMP NOT NULL,
    CONSTRAINT "Database_pk" PRIMARY KEY ("id")
);

CREATE TABLE $PG_DB_SCHEMA.user (
    "id" uuid NOT NULL,
    CONSTRAINT "User_pk" PRIMARY KEY ("id")
);

CREATE TABLE $PG_DB_SCHEMA.query (
    "query_count" int NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "storage_after_query" int NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "Query_pk" PRIMARY KEY ("creation_date_time","database_id"),
    CONSTRAINT "Query_fk0" FOREIGN KEY ("database_id") REFERENCES $PG_DB_SCHEMA.database("id")
);

CREATE TABLE $PG_DB_SCHEMA.user_owns_database (
    "user_id" uuid NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "User_Owns_Database_pk" PRIMARY KEY ("user_id","database_id"),
    CONSTRAINT "User_Owns_Database_fk0" FOREIGN KEY ("database_id") REFERENCES $PG_DB_SCHEMA.database("id") ON DELETE CASCADE,
    CONSTRAINT "User_Owns_Database_fk1" FOREIGN KEY ("user_id") REFERENCES $PG_DB_SCHEMA.user("id") ON DELETE CASCADE
);
EOSQL
