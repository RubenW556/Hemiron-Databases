import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Database } from './database.entity';
import { CreateDatabaseDto } from "./dto/create-database.dto";
import { v4 as generateUUID } from 'uuid';
import { UpdateDatabaseDto } from "./dto/update-database.dto";
import {ClientDatabaseDao} from "../dao/clientDatabase.dao";
import {DatabaseClientDao} from "../dao/databaseClient.dao";

@Injectable()
export class DatabasesService {
    constructor(
        @InjectRepository(Database)
        private databasesRepository: Repository<Database>,
        private clientDatabaseDao: ClientDatabaseDao,
        private databaseClientDao: DatabaseClientDao

    ) {
    }

    public findOne(database_id: string): Promise<Database> {
        return this.databasesRepository.findOneByOrFail({ id: database_id });
    }

    public findAllForUser(userId: string): Promise<Database[]> {
        // @TODO Add user filter
        return this.databasesRepository.find();
    }

    public insert(databaseDto: CreateDatabaseDto): Promise<InsertResult> {
        const database: Database = { ...databaseDto, ...{ id: generateUUID(), creation_date_time: new Date() } }
        let result = this.databasesRepository.insert(database)
        this.createDatabaseWithUser(databaseDto.name);
        return result;
    }

    public update(database: UpdateDatabaseDto): Promise<UpdateResult> {
        return this.databasesRepository.update({ id: database.id }, database);
    }

    public async delete(id: string): Promise<DeleteResult> {
        return this.databasesRepository.delete(id);
    }

    //database management context
    public async createDatabaseWithUser(databaseName:string){
        if((await this.clientDatabaseDao.lookUpDatabase(databaseName))[0]==undefined){
            await this.clientDatabaseDao.createDatabase(databaseName);
        }
        if((await this.databaseClientDao.lookUpUser("test1"))[0]==undefined){
            await this.databaseClientDao.createUser("test1","test1");
        }
        if((await this.clientDatabaseDao.lookUpDatabase(databaseName))[0]!=undefined){
        await this.databaseClientDao.grantUserAccessToDatabase("test1", databaseName)
        }
    }
}
