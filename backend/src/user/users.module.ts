import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from "./users.controller";
import {dataCollectionDao} from "../dao/dataCollection.dao";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, dataCollectionDao],
})
export class UsersModule {
}
