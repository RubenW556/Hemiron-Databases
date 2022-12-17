import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class MetricsService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /**
   * Gets size of single database
   * @param databaseName
   */
  async getDatabaseSize(databaseName: string) {
    const postWithquery = await this.dataSource.query(
      `
        select t1.datname AS db_name,
        pg_size_pretty(pg_database_size(t1.datname)) as db_size
        from pg_database t1 where t1.datname=$1
        order by pg_database_size(t1.datname) desc limit 1;
      `,
      [databaseName],
    );

    return postWithquery[0].db_size;
  }

  /**
   * Gets sizes of all databases
   */
  async getAllDatabaseSizes() {
    const postWithquery = await this.dataSource.query(
      `
        select t1.datname AS db_name,
        pg_size_pretty(pg_database_size(t1.datname)) as db_size
        from pg_database t1
        order by pg_database_size(t1.datname) desc limit 1;
      `,
      [],
    );
    return postWithquery;
  }
}
