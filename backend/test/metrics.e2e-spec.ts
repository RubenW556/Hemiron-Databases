import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Database } from '../src/databases/database.entity';
import { UserOwnsDatabase } from '../src/user-owns-database/user-owns-database.entity';
import { MetricsService } from '../src/metrics/metrics.service';
import { MetricsModule } from '../src/metrics/metrics.module';
import { DatabasesService } from '../src/databases/databases.service';
import { UserOwnsDatabaseService } from '../src/user-owns-database/user-owns-database.service';
import { UsersService } from '../src/user/users.service';
import { DatabaseManagementService } from '../src/meta-database-management/database-management.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabasesController } from '../src/databases/databases.controller';
import { MockAuthMiddleware } from './mock-auth.middleware';
import * as request from 'supertest';

describe('Metrics Controller (e2e)', () => {
  let app: INestApplication;

  const validUserID = 'c30a6cdd-02db-472f-8e69-80d57b67b3da';

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
      .get(`/metrics/databases/postgres/users/${validUserID}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('sizeUsage');
        expect(res.body).toHaveProperty('queryCount');
      });
  });
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get(`/metrics/databases/postgres/users/123`)
      .expect(500);
  });
});
