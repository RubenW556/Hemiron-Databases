CREATE TYPE type_enum AS ENUM ('redis', 'postgres');

CREATE TABLE "database" (
    "id" uuid NOT NULL,
    "name" character varying(50) NOT NULL,
    "type" type_enum NOT NULL,
    "creation_date_time" TIMESTAMP NOT NULL,
    "pgd_id" integer NOT NULL,
    CONSTRAINT "Database_pk" PRIMARY KEY ("id")
);

CREATE TABLE "user" (
    "id" uuid NOT NULL,
    CONSTRAINT "User_pk" PRIMARY KEY ("id")
);

CREATE TABLE "query" (
    "resource_used" int NOT NULL,
    "creation_date_time" TIMESTAMP NOT NULL,
    "storage_after_query" int NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "Query_pk" PRIMARY KEY ("creation_date_time","database_id"),
    CONSTRAINT "Query_fk0" FOREIGN KEY ("database_id") REFERENCES "database"("id")
);

CREATE TABLE "user_owns_database" (
    "user_id" uuid NOT NULL,
    "database_id" uuid NOT NULL,
    CONSTRAINT "User_Owns_Database_pk" PRIMARY KEY ("user_id","database_id"),
    CONSTRAINT "User_Owns_Database_fk0" FOREIGN KEY ("database_id") REFERENCES "database"("id") ON DELETE CASCADE,
    CONSTRAINT "User_Owns_Database_fk1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);
