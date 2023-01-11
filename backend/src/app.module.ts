import {Logger, MiddlewareConsumer, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisMainModule } from './redis/redis-main.Module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      readyLog: true,
      closeClient: true,
      config: {
        host: process.env.REDIS_HOST,
        port: 6379,
        onClientCreated(client) {
          client.on('error', () => {this.logger.log("[Warning] Redisclient NOT created (yet) !")});
          client.on('ready', () => {this.logger.log("Redisclient created!")});
        },
      },
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
    RedisMainModule,
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
  private logger = new Logger(AppModule.name);
  // noinspection JSUnusedGlobalSymbols
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
