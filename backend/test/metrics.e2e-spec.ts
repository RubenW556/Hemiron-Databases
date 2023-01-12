import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Database } from '../src/databases/database.entity';
import { UserOwnsDatabase } from '../src/user-owns-database/user-owns-database.entity';
import { MetricsService } from '../src/metrics/metrics.service';
import { MetricsController } from '../src/metrics/metrics.controller';
import { MetricsModule } from '../src/metrics/metrics.module';
import { DatabasesService } from '../src/databases/databases.service';
import { UserOwnsDatabaseService } from '../src/user-owns-database/user-owns-database.service';
import { UsersService } from '../src/user/users.service';
import { DatabaseManagementService } from '../src/meta-database-management/database-management.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabasesController } from '../src/databases/databases.controller';
import { MockAuthMiddleware } from './mock-auth.middleware';
import { AuthenticationValidatorModule } from 'hemiron-auth/dist/authentication-validator.module';
import { UsersModule } from '../src/user/users.module';
import { DatabasesModule } from '../src/databases/databases.module';
import { UserOwnsDatabaseModule } from '../src/user-owns-database/user-owns-database.module';
import { TasksModule } from '../src/tasks/tasks.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationValidationGuard } from 'hemiron-auth/dist/guards/authentication-validation.guard';
import * as request from 'supertest';

describe('Metrics Controller (e2e)', () => {
  let app: INestApplication;

  const validDatabaseID = 'ee85aca8-f829-468e-bca9-7db0a63688c2';

  const mockDatabaseManagementService = {
    createDatabase: jest.fn(async () => {
      return;
    }),
    createUser: jest.fn(async () => {
      return;
    }),
    grantUserAccessToDatabase: jest.fn(async () => {
      return;
    }),
    revokeAccessFromPublic: jest.fn(async () => {
      return;
    }),
    getDatabasePGIDByName: jest.fn(async () => {
      return 1624;
    }),
  };
  beforeEach(async () => {
    process.env.POSTGRES_USER_SCHEMA = 'e2e_test';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        DatabasesService,
        UserOwnsDatabaseService,
        UsersService,
        MetricsService,
        {
          provide: DatabaseManagementService,
          useValue: mockDatabaseManagementService,
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        MetricsModule,
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
          }),
        }),
        TypeOrmModule.forFeature([Database]),
        TypeOrmModule.forFeature([UserOwnsDatabase]),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [DatabasesController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(new MockAuthMiddleware().use);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get(`/databases/postgres/users/123`)
      .expect(200)
      .expect('test');
  });
});
