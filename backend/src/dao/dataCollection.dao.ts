import {BadRequestException, Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";

@Injectable()
export class dataCollectionDao {
    constructor(@InjectDataSource() private dataSource:DataSource) {
    }


    //get data
    grantUserAccessToDatabase(userName:string, databaseName:string ){
        try {
            return this.dataSource.query(`SEL`)
        }
        catch (e){
            throw new BadRequestException("SQL execution failed")
        }
    }

}
