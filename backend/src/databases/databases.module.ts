import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from "./database.entity";
import { DatabasesController } from "./databases.controller";
import { DatabasesService } from "./databases.service";
import {ClientDatabaseDao} from "../dao/clientDatabase.dao";
import {DatabaseClientDao} from "../dao/databaseClient.dao";
import { UserOwnsDatabaseService } from "../user-owns-database/user-owns-database.service";
import { UserOwnsDatabase } from "../user-owns-database/user-owns-database.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Database]),
        TypeOrmModule.forFeature([UserOwnsDatabase]),
    ],
    controllers: [DatabasesController],
    providers: [DatabasesService, ClientDatabaseDao, DatabaseClientDao, UserOwnsDatabaseService],
})
export class DatabasesModule {

}
