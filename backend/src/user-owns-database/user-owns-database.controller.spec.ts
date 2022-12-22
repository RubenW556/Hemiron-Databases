import { Test, TestingModule } from '@nestjs/testing';
import { UserOwnsDatabaseController } from './user-owns-database.controller';
import { UserOwnsDatabaseService } from './user-owns-database.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserOwnsDatabase } from './user-owns-database.entity';

describe('UserOwnsDatabaseController', () => {
  let controller: UserOwnsDatabaseController;

  const mockUserOwnsDatabase = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOwnsDatabaseController],
      providers: [
        UserOwnsDatabaseService,
        {
          provide: getRepositoryToken(UserOwnsDatabase),
          useValue: mockUserOwnsDatabase,
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
