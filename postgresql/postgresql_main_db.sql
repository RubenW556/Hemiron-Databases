CREATE TABLE "Database" (
	"database_id" serial NOT NULL,
	"database_name" character varying(50) NOT NULL,
	"database_type" character varying(15) NOT NULL,
	"creation_date" DATE(15) NOT NULL,
	CONSTRAINT "Database_pk" PRIMARY KEY ("database_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "User" (
	"username" character varying(50) NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "User_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "Query" (
	"resource_used" int NOT NULL,
	"datetime" TIMESTAMP NOT NULL,
	"storage_after_query" int NOT NULL,
	"database_id" uuid NOT NULL,
	CONSTRAINT "Query_pk" PRIMARY KEY ("datetime","database_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "User_Owns_Database" (
	"user_id" bigint NOT NULL,
	"database_id" bigint NOT NULL,
	CONSTRAINT "User_Owns_Database_pk" PRIMARY KEY ("user_id","database_id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "Query" ADD CONSTRAINT "Query_fk0" FOREIGN KEY ("database_id") REFERENCES "Database"("database_id");

ALTER TABLE "User_Owns_Database" ADD CONSTRAINT "User_Owns_Database_fk0" FOREIGN KEY ("user_id") REFERENCES "User"("user_id");
ALTER TABLE "User_Owns_Database" ADD CONSTRAINT "User_Owns_Database_fk1" FOREIGN KEY ("database_id") REFERENCES "Database"("database_id");





