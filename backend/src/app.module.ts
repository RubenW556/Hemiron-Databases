import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user/user.entity";
import { UsersModule } from "./user/users.module";
import { Database } from "./databases/database.entity";
import { DatabasesModule } from "./databases/databases.module";
import {ClientDatabaseDao} from "./dao/clientDatabase.dao";
import {DatabaseClientDao} from "./dao/databaseClient.dao";

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
                    entities: [User, Database],
                    logging: true,
                })
            }),
            UsersModule,
            DatabasesModule
        ],
        controllers: [AppController],
        providers: [AppService]
    }
)
export class AppModule {
    constructor() {
    }
}




