import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user/user.entity";
import { UsersModule } from "./user/users.module";
import { Database } from "./databases/database.entity";
import { DatabasesModule } from "./databases/databases.module";
import { UserOwnsDatabaseModule } from "./user-owns-database/user-owns-database.module";
import { UserOwnsDatabase } from "./user-owns-database/user-owns-database.entity";
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                schema: process.env.POSTGRES_USER_SCHEMA,
                port: parseInt(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER_USERNAME,
                password: process.env.POSTGRES_USER_PASSWORD,
                database: process.env.POSTGRES_DATABASE,
                entities: [User, Database, UserOwnsDatabase],
                logging: true,
            })
        }),
        UsersModule,
        DatabasesModule,
        UserOwnsDatabaseModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService]
    }
)
export class AppModule {
    constructor() {
    }
}




