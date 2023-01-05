import { Test, TestingModule } from '@nestjs/testing';
import { DatabasesController } from './databases.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Database } from './database.entity';
import { DatabasesService } from './databases.service';
import { UserOwnsDatabaseService } from '../user-owns-database/user-owns-database.service';
import { UserOwnsDatabase } from '../user-owns-database/user-owns-database.entity';
import { DatabaseManagementService } from '../meta-database-management/databaseManagement.service';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.entity';

describe('DatabasesController', () => {
  let controller: DatabasesController;

  const mockDatabaseRepository = {};
  const mockUserOwnsDatabase = {};
  const mockDatabaseManagementDao = {};
  const mockUserDatabase = {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserOwnsDatabaseService,
        DatabasesController,
        DatabasesService,
        UsersService,
        {
          provide: DatabaseManagementService,
          useValue: mockDatabaseManagementDao,
        },
        {
          provide: getRepositoryToken(Database),
          useValue: mockDatabaseRepository,
        },
        {
          provide: getRepositoryToken(UserOwnsDatabase),
          useValue: mockUserOwnsDatabase,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserDatabase,
        },
      ],
    }).compile();

    controller = moduleFixture.get<DatabasesController>(DatabasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
