import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { DatabaseManagementService } from '../metaDatabaseManagement/databaseManagement.Service';
import {MetricsModule} from "../metrics/metrics.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), MetricsModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, DatabaseManagementService],
})
export class UsersModule {}
