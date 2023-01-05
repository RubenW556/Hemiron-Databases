import {CacheModule, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UsersModule } from './user/users.module';
import { Database } from './databases/database.entity';
import { DatabasesModule } from './databases/databases.module';
import { UserOwnsDatabaseModule } from './user-owns-database/user-owns-database.module';
import { UserOwnsDatabase } from './user-owns-database/user-owns-database.entity';
import { APP_GUARD } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';
import { AuthMiddleware } from './auth.middleware';
import { AuthenticationValidationGuard } from 'hemiron-auth/dist/guards/authentication-validation.guard';
import { AuthenticationValidatorModule } from 'hemiron-auth/dist/authentication-validator.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        schema: configService.get('POSTGRES_USER_SCHEMA'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER_USERNAME'),
        password: configService.get('POSTGRES_USER_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [User, Database, UserOwnsDatabase],
        logging: true,
      }),
    }),
    AuthenticationValidatorModule.setup({
      authenticationServerURL: process.env.AUTH_SERVER_URL,
    }),
    UsersModule,
    DatabasesModule,
    UserOwnsDatabaseModule,
    TasksModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationValidationGuard,
    },
      AppService,
  ],
})
export class AppModule implements NestModule {
  // noinspection JSUnusedGlobalSymbols
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
