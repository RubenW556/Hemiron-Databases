import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DatabasesController } from '../src/databases/databases.controller';
import { DatabasesService } from '../src/databases/databases.service';
import { DatabaseManagementService } from '../src/meta-database-management/database-management.service';
import { UserOwnsDatabaseService } from '../src/user-owns-database/user-owns-database.service';
import { UsersService } from '../src/user/users.service';
import { Database } from '../src/databases/database.entity';
import { UserOwnsDatabase } from '../src/user-owns-database/user-owns-database.entity';
import { User } from '../src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsService } from '../src/metrics/metrics.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockAuthMiddleware } from './mock-auth.middleware';
import { CreateDatabaseDto } from '../src/databases/dto/create-database.dto';
import { UpdateDatabaseDto } from '../src/databases/dto/update-database.dto';

describe('DatabasesController (e2e)', () => {
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

  it('/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get('/databases/' + validDatabaseID)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('type');
        expect(res.body).toHaveProperty('created_at');
      });
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/databases')
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('type');
        expect(res.body[0]).toHaveProperty('created_at');
      });
  });

  it('/ (POST)', async () => {
    const data: CreateDatabaseDto = {
      name: 'New database',
      type: 'postgres',
    };

    return request(app.getHttpServer())
      .post('/databases/')
      .send(data)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        expect(res.body).toHaveProperty('database_id');
        expect(res.body).toHaveProperty('password');
      });
  });

  it('/ (PATCH)', async () => {
    const data: UpdateDatabaseDto = {
      id: 'ee85aca8-f829-468e-bca9-7db0a63688c2',
      name: 'Updated database name',
    };

    return request(app.getHttpServer())
      .patch('/databases/')
      .send(data)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toBe('Updated database name');
      });
  });

  it('/ (Delete)', async () => {
    const data: CreateDatabaseDto = {
      name: 'Database to delete database',
      type: 'postgres',
    };

    const result = await request(app.getHttpServer())
      .post('/databases/')
      .send(data);

    return request(app.getHttpServer())
      .delete(`/databases/${result.body['database_id']}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});
