import { Test, TestingModule } from '@nestjs/testing';
import { DatabasesController } from './databases.controller';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Database} from "./database.entity";
import {DatabasesService} from "./databases.service";
import {UserOwnsDatabaseService} from "../user-owns-database/user-owns-database.service";
import {UserOwnsDatabase} from "../user-owns-database/user-owns-database.entity";

describe('DatabasesController', () => {
  let controller: DatabasesController;

  const mockDatabaseRepository= {};
  const mockUserOwnsDatabase= {};


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserOwnsDatabaseService,
        DatabasesController,
        DatabasesService,
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
