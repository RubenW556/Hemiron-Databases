import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from "./database.entity";
import { DatabasesController } from "./databases.controller";
import { DatabasesService } from "./databases.service";
import {ClientDatabaseDao} from "../dao/clientDatabase.dao";
import {DatabaseClientDao} from "../dao/databaseClient.dao";

@Module({
    imports: [TypeOrmModule.forFeature([Database])],
    controllers: [DatabasesController],
    providers: [DatabasesService, ClientDatabaseDao, DatabaseClientDao],
})
export class DatabasesModule {

}
