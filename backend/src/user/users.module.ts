import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { MetricsService } from '../metrics/metrics.service';
import {DatabaseManagementService} from "../metaDatabaseManagement/databaseManagement.Service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, MetricsService, DatabaseManagementService],
})
export class UsersModule {}
