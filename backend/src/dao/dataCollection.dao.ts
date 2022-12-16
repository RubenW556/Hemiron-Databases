import {BadRequestException, Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";

@Injectable()
export class dataCollectionDao {
    constructor(@InjectDataSource() private dataSource:DataSource) {
    }


    /**
     * gets query count of user from database
     * @param user_id user id whose query count is gotten
     */
    async getQueryCountByUser_Id(user_id:string){
        try {
             return await this.dataSource.query(`SELECT SUM(calls) FROM docker.pg_stat_statements
            WHERE DBID in
                (SELECT oid FROM PG_DATABASE WHERE datname
                    in ( SELECT DB.name
                        FROM docker.user_owns_database as UOD JOIN docker.database as DB ON database_id = id
                        WHERE UOD.user_id = '${user_id}')
                )
            AND  userID NOT IN ( SELECT oid FROM pg_roles WHERE rolname = 'postgres' or rolname = 'admin');
            `)
        }
        catch (e){
            throw new BadRequestException("SQL execution failed")
        }
    }

}
