import { Test, TestingModule } from '@nestjs/testing';
import { DatabasesController } from './databases.controller';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Database} from "./database.entity";
import {DatabasesService} from "./databases.service";
import {UserOwnsDatabaseService} from "../user-owns-database/user-owns-database.service";
import {UserOwnsDatabase} from "../user-owns-database/user-owns-database.entity";
import {DatabaseManagementDao} from "../dao/databaseManagement.dao";

describe('DatabasesController', () => {
  let controller: DatabasesController;

  const mockDatabaseRepository= {};
  const mockUserOwnsDatabase= {};
  const mockDatabaseManagementDao= {};



  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserOwnsDatabaseService,
        DatabasesController,
        DatabasesService,
        {provide: DatabaseManagementDao,
          useValue: mockDatabaseManagementDao,
        },
        {provide: getRepositoryToken(Database),
          useValue: mockDatabaseRepository,
        },
        {provide: getRepositoryToken(UserOwnsDatabase),
          useValue: mockUserOwnsDatabase,
        }
      ]
    }).compile();

    controller = moduleFixture.get<DatabasesController>(DatabasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
