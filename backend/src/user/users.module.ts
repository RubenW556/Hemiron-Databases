import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from "./users.controller";
import {DatabaseManagementDao} from "../dao/databaseManagement.dao";
import {MetricsService} from "../metrics/metrics.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, MetricsService, DatabaseManagementDao],
})
export class UsersModule {}