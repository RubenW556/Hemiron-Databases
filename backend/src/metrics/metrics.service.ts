import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {User} from "../user/user.entity";

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
        SELECT t1.datname AS db_name,
        pg_size_pretty(pg_database_size(t1.datname)) AS db_size
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
  async getAllDatabaseSizes() {
    const postWithquery = await this.dataSource.query(
      `
        SELECT t1.datname AS db_name,
        pg_size_pretty(pg_database_size(t1.datname)) AS db_size
        FROM pg_database AS t1
        ORDER BY pg_database_size(t1.datname)
        LIMIT $1 
        OFFSET $2;
      `,
      [3, 0],
    );

    return postWithquery;
  }
}
