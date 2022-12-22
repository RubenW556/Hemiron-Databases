import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from './database.entity';
import { DatabasesController } from './databases.controller';
import { DatabasesService } from './databases.service';
import { UserOwnsDatabaseService } from '../user-owns-database/user-owns-database.service';
import { UserOwnsDatabase } from '../user-owns-database/user-owns-database.entity';
import { AuthenticationService } from 'hemiron-auth/dist/services/authentication.service';
import { DatabaseManagementDao } from '../dao/databaseManagement.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([Database]),
        TypeOrmModule.forFeature([UserOwnsDatabase]),
    ],
    controllers: [DatabasesController],
    providers: [
        DatabasesService,
        DatabaseManagementDao,
        UserOwnsDatabaseService,
        AuthenticationService,
    ],
})
export class DatabasesModule {
}
