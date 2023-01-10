import { Test, TestingModule } from '@nestjs/testing';
import { UserOwnsDatabaseController } from './user-owns-database.controller';
import { UserOwnsDatabaseService } from './user-owns-database.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserOwnsDatabase } from './user-owns-database.entity';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.entity';
import { DataSource } from 'typeorm';
import { MetricsService } from '../metrics/metrics.service';
import { DatabaseManagementService } from '../meta-database-management/database-management.service';

describe('UserOwnsDatabaseController', () => {
  let controller: UserOwnsDatabaseController;

  const mockUserOwnsDatabase = {};
  const UserDatabase = {};
  const mockDataSource = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOwnsDatabaseController],
      providers: [
        UserOwnsDatabaseService,
        UsersService,
        DatabaseManagementService,
        MetricsService,
        {
          provide: getRepositoryToken(UserOwnsDatabase),
          useValue: mockUserOwnsDatabase,
        },
        {
          provide: getRepositoryToken(User),
          useValue: UserDatabase,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    controller = module.get<UserOwnsDatabaseController>(
      UserOwnsDatabaseController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
