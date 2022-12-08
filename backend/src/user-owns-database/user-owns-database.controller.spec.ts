import { Test, TestingModule } from '@nestjs/testing';
import { UserOwnsDatabaseController } from './user-owns-database.controller';

describe('UserOwnsDatabaseController', () => {
  let controller: UserOwnsDatabaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOwnsDatabaseController],
    }).compile();

    controller = module.get<UserOwnsDatabaseController>(UserOwnsDatabaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
