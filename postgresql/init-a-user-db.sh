set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DATABASE" <<-EOSQL
	CREATE USER $PG_ADMIN_USERNAME WITH PASSWORD '$PG_ADMIN_PASSWORD' CREATEDB CREATEROLE;
	CREATE DATABASE $PG_ADMIN_DATABASE;
  GRANT ALL PRIVILEGES ON DATABASE $PG_ADMIN_DATABASE TO $PG_ADMIN_USERNAME;

EOSQL
