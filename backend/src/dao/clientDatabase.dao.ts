import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";

@Injectable()
export class ClientDatabaseDao {
    constructor(@InjectDataSource() private dataSource:DataSource) {
    }

    createDatabase(databaseName: string){
        this.dataSource.query(`CREATE DATABASE ${databaseName}`)
    }

    lookUpDatabase(databaseName:string){
        return this.dataSource.query(`SELECT 1 FROM pg_database WHERE datname='${databaseName}'`)
    }
}
