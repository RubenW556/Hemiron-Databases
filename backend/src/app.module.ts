import {Module, Post} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user/user.entity";
import {UsersModule} from "./user/users.module";
import {DataSource} from "typeorm";
import { DatabasesController } from './databases/databases.controller';
import {CustomNamingStrategy} from "./NamingStrategy/NamingStrategy";



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        schema: "docker",
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER_USERNAME,
        password: process.env.POSTGRES_USER_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        entities: [User],
        logging: true,
        // namingStrategy : new  CustomNamingStrategy ( ) niet nodig maar ik behoud het omdat het mischien nodig zal zijn
      })
    }),
    UsersModule
  ],
  controllers: [AppController, DatabasesController],
  providers: [AppService]}
)


export class AppModule {
  constructor() {}

}




