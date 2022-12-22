import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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


    /**
     * gets query count of user from database
     * @param user_id user id whose query count is gotten
     */
    async getQueryCountByUser_Id(user_id:string){
        try {
            return await this.dataSource.query(`SELECT SUM(calls), DBID FROM docker.pg_stat_statements
            WHERE DBID in
                (SELECT oid FROM PG_DATABASE WHERE datname
                    in ( SELECT DB.name
                        FROM docker.user_owns_database as UOD JOIN docker.database as DB ON database_id = id
                        WHERE UOD.user_id = '${user_id}')
                )
            AND  userID NOT IN ( SELECT oid FROM pg_roles WHERE rolname = 'postgres' or rolname = 'admin') GROUP BY DBID;
            `)
        }
        catch (e){
            throw new BadRequestException("SQL execution failed")
        }
    }

}
