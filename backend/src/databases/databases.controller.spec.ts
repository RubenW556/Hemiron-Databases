import { Test, TestingModule } from '@nestjs/testing';
import { DatabasesController } from './databases.controller';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Database} from "./database.entity";
import {UsersService} from "../user/users.service";
import {User} from "../user/user.entity";
import {DatabasesService} from "./databases.service";

describe('DatabasesController', () => {
  let controller: DatabasesController;

  const mockDatabaseRepository= {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        DatabasesController,
        DatabasesService,
        {provide: getRepositoryToken(Database),
          useValue: mockDatabaseRepository,
        }
      ]
    }).compile();

    controller = moduleFixture.get<DatabasesController>(DatabasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
