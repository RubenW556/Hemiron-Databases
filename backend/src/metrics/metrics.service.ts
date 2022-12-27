import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /**
   * Gets size of single database
   * @param {string} databaseName Name of Database to get size of
   */
  async getDatabaseSize(databaseName: string) {
    const postWithquery = await this.dataSource.query(
      `
        SELECT t1.datname AS db_name,
        (pg_database_size(t1.datname)) AS db_size
        FROM pg_database AS t1 WHERE t1.datname=$1
        ORDER BY pg_database_size(t1.datname) 
        DESC 
        LIMIT 1;
      `,
      [databaseName],
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
        FROM pg_database AS t1
        WHERE t1.datname LIKE $1
        ORDER BY pg_database_size(t1.datname)
        LIMIT $2
        OFFSET $3;
      `,
        [`${uuid}.%`, limit, offset],
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
}
