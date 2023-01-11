import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Database } from '../src/databases/database.entity';
import { UserOwnsDatabase } from '../src/user-owns-database/user-owns-database.entity';
import { TasksModule } from '../src/tasks/tasks.module';
import { MetricsService } from '../src/metrics/metrics.service';
import { MetricsController } from '../src/metrics/metrics.controller';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
          }),
        }),
        TasksModule,
      ],
      providers: [MetricsService],
      controllers: [MetricsController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});
