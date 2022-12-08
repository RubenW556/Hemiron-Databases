import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";

@Injectable()
export class DatabaseClientDao {
    constructor(@InjectDataSource() private dataSource:DataSource) {
    }

    async createUser(userName: string, password:string){
        await this.dataSource.query(`CREATE USER ${userName} WITH PASSWORD '${password}'`)
        await this.dataSource.query(`GRANT ${userName} TO admin`);
    }

    grantUserAccessToDatabase(userName:string, databaseName:string ){
        return this.dataSource.query(`ALTER DATABASE ${databaseName} OWNER TO ${userName}`)
    }

    lookUpUser(userName:string ){
        return this.dataSource.query(`SELECT 1 FROM pg_user WHERE usename='${userName}'`)
    }
}
