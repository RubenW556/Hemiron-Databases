import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user/user.entity";
import { UsersModule } from "./user/users.module";
import { Database } from "./databases/database.entity";
import { DatabasesModule } from "./databases/databases.module";
import { UserOwnsDatabaseModule } from "./user-owns-database/user-owns-database.module";
import { UserOwnsDatabase } from "./user-owns-database/user-owns-database.entity";
import { AuthenticationValidatorModule } from "hemiron-auth/dist/authentication-validator.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationValidationGuard } from "hemiron-auth/dist/guards/authentication-validation.guard";
import { TasksModule } from "./tasks/tasks.module";

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
            AuthenticationValidatorModule.setup({
                authenticationServerURL: 'http://manager-3.inf-hsleiden:3000'
            }),
            UsersModule,
            DatabasesModule,
            UserOwnsDatabaseModule,
        TasksModule,
    ],
    providers: [{
            provide: APP_GUARD,
            useClass: AuthenticationValidationGuard,
        }]
    }
)
export class AppModule {
    constructor() {
    }
}




