import {Injectable, Logger} from '@nestjs/common';
import {readFile, readFileSync, truncate, writeFile} from 'fs';

@Injectable()
export class QueryLoggingService {

    // Map object to store database_uuid times the db has been accessed
    private queryCount: Map<string, number>;
    private pathToLog = "./src/redis/queries.txt";
    private logger = new Logger(QueryLoggingService.name);
    constructor() {
        this.queryCount = new Map();
    }

    public logQuery(database_uuid: string, queries = 1): void {
        //if the key doesn't exist we insert it with a value 1
        if (!this.queryCount.has(database_uuid)) {
            this.queryCount.set(database_uuid, 1);
        } else {
            //else we increment the value of the key by 1
            this.queryCount.set(database_uuid, this.queryCount.get(database_uuid) + queries);
        }
        //after each query we write the map object to 'queries.txt'
        writeFile(this.pathToLog, JSON.stringify(Array.from(this.queryCount.entries())), (err) => {
            if (err)
                this.logger.debug(err);
            else {
                this.logger.debug("File written successfully: \n" + readFileSync(this.pathToLog, "utf8"));
            }
        });
    }

    public getQueryByDbUUID(database_id:string): number {
        let totalQueries = 0;
        try{
            const fileData = readFileSync(this.pathToLog, "utf8");
            const data = JSON.parse(fileData);
            const query = data.find(entry => entry[0] === database_id)
            if (query) {
                totalQueries = query[1];
            }
        }catch(error){
            this.logger.debug(`Error reading file: ${error}`)
        }
        return totalQueries;
    }

    public reset(): void{
        try {
            truncate(this.pathToLog, 0);
            this.queryCount = new Map();
            this.logger.debug("Logger Reset on: " +  new Date().toISOString() )
        } catch (error) {
            this.logger.debug(`Error resetting file: ${error}`);
        }
    }

}
