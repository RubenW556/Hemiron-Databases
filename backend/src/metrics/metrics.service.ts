import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /**
   * Gets size of single database
   * @param {number} databaseId Oid of Database to get size of
   */
  async getDatabaseSize(databaseId: number) {
    const postWithquery = await this.dataSource.query(
      `
        SELECT t1.datname AS db_name,
        (pg_database_size(t1.datname)) AS db_size
        FROM pg_database AS t1 WHERE t1.datname=$1
        ORDER BY pg_database_size(t1.datname) 
        DESC 
        LIMIT 1;
      `,
      [databaseId],
    );

    return postWithquery[0].db_size;
  }

  /**
   * Gets sizes of all databases
   */
  getAllDatabaseSizesOfAllUsers() {
    try {
      return this.dataSource.query(
        `
          SELECT t1.datname AS db_name,
          pg_database_size(t1.datname) AS db_size
          FROM pg_database AS t1
          ORDER BY pg_database_size(t1.datname)
          LIMIT $1 
          OFFSET $2;
        `,
        [100, 0],
      );
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  /**
   * Gets sizes of all Postgres databases of user combined
   * @param {string} uuid UUID of requested user as string
   * @param pageNumber
   * @param pageSize
   */
  async getAllPostgresDatabaseSizesOfSingleUser(
    uuid: string,
    pageNumber = 1,
    pageSize = 10,
  ) {
    try {
      const limit = pageSize;
      const offset = (pageNumber - 1) * pageSize;
      return await this.dataSource.query(
        `
        SELECT t1.datname AS db_name,
        (pg_database_size(t1.datname)) AS db_size
        FROM docker.database AS database
        INNER JOIN docker.user_owns_database AS user_owns_database
        ON database.id = user_owns_database.database_id 
        AND user_owns_database.user_id = $1
        INNER JOIN pg_database AS t1
        ON database.pgd_id = t1.oid
        LIMIT $2
        OFFSET $3;
      `,
        [uuid, limit, offset],
      );
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getCombinedPostgresMetricsOfUser(uuid: string): Promise<number> {
    let size = 0;
    const payload = await this.getAllPostgresDatabaseSizesOfSingleUser(uuid);
    this.logger.debug(payload);
    if (payload.length < 1) throw new Error('No data found');
    for (const database of payload) {
      // convert string to number and add up
      size = size + +database.db_size;
    }
    return size;
  }

  getHello() {
    return 'Helo world';
  }

  /**
   * gets query count of user from database
   * @param user_id user id whose query count is gotten
   */
  async getQueryCountByUser_Id(user_id: string) {
    try {
      return await this.dataSource.query(
        `SELECT SUM(stat.calls), DB.datname FROM docker.pg_stat_statements AS stat 
            JOIN PG_DATABASE AS DB
            ON DBID = oid
            WHERE DBID in
                (
                    SELECT pgd_id FROM docker.database
                    INNER JOIN docker.user_owns_database uod on docker.database.id = uod.database_id
                    WHERE uod.user_id = $1
                )
            AND  userID NOT IN ( SELECT oid FROM pg_roles WHERE rolname = 'postgres' or rolname = 'admin') GROUP BY DB.datname;
            `,
        [user_id],
      );
    } catch (e) {
      throw new BadRequestException('SQL execution failed');
    }
  }
}
