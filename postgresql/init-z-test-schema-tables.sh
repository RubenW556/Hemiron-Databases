set -e
psql -v ON_ERROR_STOP=1 --username "$PG_ADMIN_USERNAME" --dbname "$PG_ADMIN_DATABASE" <<-EOSQL


CREATE SCHEMA e2e_test;

CREATE TYPE e2e_test.type_enum AS ENUM ('redis', 'postgres');

CREATE TABLE e2e_test.database (
    "id" uuid NOT NULL,
    "name" character varying(50) NOT NULL,
    "type" e2e_test.type_enum NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "pgd_id" integer NOT NULL,
    CONSTRAINT "Database_pk" PRIMARY KEY ("id")
);

CREATE TABLE e2e_test.user (
    "id" uuid NOT NULL,
    CONSTRAINT "User_pk" PRIMARY KEY ("id")
);

CREATE TABLE e2e_test.query (
    "resource_used" int NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "storage_after_query" int NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "Query_pk" PRIMARY KEY ("created_at","database_id"),
    CONSTRAINT "Query_fk0" FOREIGN KEY ("database_id") REFERENCES e2e_test.database("id")
);

CREATE TABLE e2e_test.user_owns_database (
    "user_id" uuid NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "User_Owns_Database_pk" PRIMARY KEY ("user_id","database_id"),
    CONSTRAINT "User_Owns_Database_fk0" FOREIGN KEY ("database_id") REFERENCES e2e_test.database("id") ON DELETE CASCADE,
    CONSTRAINT "User_Owns_Database_fk1" FOREIGN KEY ("user_id") REFERENCES e2e_test.user("id") ON DELETE CASCADE
);


INSERT INTO e2e_test.database (id, name, type, created_at, pgd_id) VALUES ('ee85aca8-f829-468e-bca9-7db0a63688c2'::uuid, 'First test database'::varchar(50), 'postgres'::e2e_test.type_enum, '2023-01-11 11:42:37.127000'::timestamp, 16477::integer);
INSERT INTO e2e_test.database (id, name, type, created_at, pgd_id) VALUES ('579d2753-4d0a-42b4-b998-9364466ee06d'::uuid, 'Second test database'::varchar(50), 'redis'::e2e_test.type_enum, '2023-01-11 12:19:38.238000'::timestamp, 12486::integer);

INSERT INTO e2e_test."user" (id) VALUES ('c30a6cdd-02db-472f-8e69-80d57b67b3da'::uuid);

INSERT INTO e2e_test.user_owns_database (user_id, database_id) VALUES ('c30a6cdd-02db-472f-8e69-80d57b67b3da'::uuid, 'ee85aca8-f829-468e-bca9-7db0a63688c2'::uuid);
INSERT INTO e2e_test.user_owns_database (user_id, database_id) VALUES ('c30a6cdd-02db-472f-8e69-80d57b67b3da'::uuid, '579d2753-4d0a-42b4-b998-9364466ee06d'::uuid);
