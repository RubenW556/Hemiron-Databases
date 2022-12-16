import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from "./users.controller";
import {dataCollectionDao} from "../dao/dataCollection.dao";
import {DatabaseManagementDao} from "../dao/databaseManagement.dao";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, dataCollectionDao, DatabaseManagementDao],
})
export class UsersModule {
}
