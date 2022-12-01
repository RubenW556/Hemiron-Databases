import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Database } from './database.entity';
import { CreateDatabaseDto } from "./dto/create-database.dto";
import { v4 as generateUUID } from 'uuid';
import { UpdateDatabaseDto } from "./dto/update-database.dto";

@Injectable()
export class DatabasesService {
    constructor(
        @InjectRepository(Database)
        private databasesRepository: Repository<Database>,
    ) {
    }

    public findOne(database_id: string): Promise<Database> {
        return this.databasesRepository.findOneBy({ id: database_id });
    }

    public findAllForUser(userId: string): Promise<Database[]> {
        // @TODO Add user filter
        return this.databasesRepository.find();
    }

    public insert(databaseDto: CreateDatabaseDto): Promise<InsertResult> {
        const database: Database = { ...databaseDto, ...{ id: generateUUID(), creation_date_time: new Date() } }
        return this.databasesRepository.insert(database);
    }

    public update(database: UpdateDatabaseDto): Promise<UpdateResult> {
        return this.databasesRepository.update({ id: database.id }, database);
    }

    public async delete(id: string): Promise<DeleteResult> {
        return this.databasesRepository.delete(id);
    }
}
