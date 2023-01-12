set -e
psql -v ON_ERROR_STOP=1 --username "$PG_ADMIN_USERNAME" --dbname "$PG_ADMIN_DATABASE" <<-EOSQL


INSERT INTO $PG_DB_SCHEMA.database (id, name, type, created_at, pgd_id) VALUES ('ee85aca8-f829-468e-bca9-7db0a63688c2'::uuid, 'First test database'::varchar(50), 'postgres'::$PG_DB_SCHEMA.type_enum, '2023-01-11 11:42:37.127000'::timestamp, 5::integer);
INSERT INTO $PG_DB_SCHEMA.database (id, name, type, created_at, pgd_id) VALUES ('579d2753-4d0a-42b4-b998-9364466ee06d'::uuid, 'Second test database'::varchar(50), 'redis'::$PG_DB_SCHEMA.type_enum, '2023-01-11 12:19:38.238000'::timestamp, 12486::integer);

INSERT INTO $PG_DB_SCHEMA."user" (id) VALUES ('c30a6cdd-02db-472f-8e69-80d57b67b3da'::uuid);

INSERT INTO $PG_DB_SCHEMA.user_owns_database (user_id, database_id) VALUES ('c30a6cdd-02db-472f-8e69-80d57b67b3da'::uuid, 'ee85aca8-f829-468e-bca9-7db0a63688c2'::uuid);
INSERT INTO $PG_DB_SCHEMA.user_owns_database (user_id, database_id) VALUES ('c30a6cdd-02db-472f-8e69-80d57b67b3da'::uuid, '579d2753-4d0a-42b4-b998-9364466ee06d'::uuid);
