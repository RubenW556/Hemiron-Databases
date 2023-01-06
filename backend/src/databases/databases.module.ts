import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from './database.entity';
import { DatabasesController } from './databases.controller';
import { DatabasesService } from './databases.service';
import { UserOwnsDatabaseService } from '../user-owns-database/user-owns-database.service';
import { UserOwnsDatabase } from '../user-owns-database/user-owns-database.entity';
import { AuthenticationService } from 'hemiron-auth/dist/services/authentication.service';
import { DatabaseManagementService } from '../meta-database-management/database-management.service';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.entity';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Database]),
    TypeOrmModule.forFeature([UserOwnsDatabase]),
    TypeOrmModule.forFeature([User]),
    MetricsModule,
  ],
  controllers: [DatabasesController],
  providers: [
    DatabasesService,
    DatabaseManagementService,
    UserOwnsDatabaseService,
    UsersService,
    AuthenticationService,
  ],
})
export class DatabasesModule {}
