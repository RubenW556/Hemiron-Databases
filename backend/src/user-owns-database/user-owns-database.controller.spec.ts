import { Test, TestingModule } from '@nestjs/testing';
import { UserOwnsDatabaseController } from './user-owns-database.controller';
import { UserOwnsDatabaseService } from './user-owns-database.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserOwnsDatabase } from './user-owns-database.entity';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.entity';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserOwnsDatabaseDto } from './dto/user-owns-database.dto';

describe('UserOwnsDatabaseController', () => {
  let controller: UserOwnsDatabaseController;
  const mockUserOwnsDatabaseDto = {
    database_id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
    user_id: '448098df-b9dd-4ec2-af9f-b23459b203a1',
  } as UserOwnsDatabaseDto;
  const mockUsersService = {};
  const UserDatabase = {};
  const databaseRecord = {
    id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
    name: 'Database name',
    type: 'postgres',
    creation_date_time: new Date(),
    pgd_id: 16463,
  };
  const validDatabaseUuid = '28fe3613-b0f2-4d88-9934-d53586384f96';
  const mockUnauthorizedResponse = {
    status: jest.fn((x) => x),
  } as unknown as Response;
  const existingUser = '448098df-b9dd-4ec2-af9f-b23459b203a1'
  const mockAuthorizedResponse = {
    status: jest.fn((x) => x),
    locals: {
      userMakingRequest: { id: existingUser },
    },
  } as unknown as Response;
  const mockUserOwnsDatabaseService = {
    findOne: jest.fn(async function (databaseId, UserId): Promise<void> {
      if (UserId != existingUser) throw new Error();
      return;
    }),
    insert: jest.fn(async function (databaseId, UserId): Promise<void> {
      if (UserId != existingUser) throw new Error();
      return;
    }),
    delete: jest.fn(async function (databaseId, UserId): Promise<void> {
      if (UserId != existingUser) throw new Error();
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOwnsDatabaseController],
      providers: [
        {
          provide: UserOwnsDatabaseService,
          useValue: mockUserOwnsDatabaseService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(UserOwnsDatabase),
          useValue: mockUserOwnsDatabaseDto,
        },
        {
          provide: getRepositoryToken(User),
          useValue: UserDatabase,
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

  describe('getOne', () => {
    it('should return a status of 500 if unauthorized response ', async () => {
      await controller.getOne(mockUnauthorizedResponse, validDatabaseUuid);
      expect(mockUnauthorizedResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should call userOwnsDatabaseService.findOne', async () => {
      const spy = jest.spyOn(mockUserOwnsDatabaseService, 'findOne');

      await controller.getOne(mockAuthorizedResponse, databaseRecord.id);

      expect(spy).toHaveBeenCalledWith(
        databaseRecord.id,
        mockAuthorizedResponse.locals.userMakingRequest.id,
      );
    });

    it('should return an object with user_id and database_id', async () => {
      const result = await controller.getOne(mockAuthorizedResponse, mockUserOwnsDatabaseDto.database_id);

      expect(result.user_id).toBeDefined();
      expect(result.database_id).toBeDefined();
    });
  });

  describe('create', () => {
    it('should return a status of 500 if unauthorized response ', async () => {
      await controller.create(
        mockUnauthorizedResponse,
        mockUserOwnsDatabaseDto,
      );

      expect(mockUnauthorizedResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should call userOwnsDatabaseService with findOne', async () => {
      const spy = jest.spyOn(mockUserOwnsDatabaseService, 'findOne');

      await controller.create(mockAuthorizedResponse, mockUserOwnsDatabaseDto);

      expect(spy).toHaveBeenCalledWith(
        mockUserOwnsDatabaseDto.database_id,
        mockAuthorizedResponse.locals.userMakingRequest.id,
      );

    });

  it('should call userOwnsDatabaseService with insert', async () => {
    const spy = jest.spyOn(mockUserOwnsDatabaseService, 'insert');

    await controller.create(mockAuthorizedResponse, mockUserOwnsDatabaseDto);

    expect(spy).toHaveBeenCalledWith(
        mockUserOwnsDatabaseDto.database_id,
        mockAuthorizedResponse.locals.userMakingRequest.id,
    );

  });
});

  describe('delete', () => {
    it('should return a status of 500 if unauthorized response ', async () => {
      await controller.delete(
        mockUnauthorizedResponse,
        mockUserOwnsDatabaseDto,
      );
      expect(mockUnauthorizedResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should call userOwnsDatabaseService with findOne', async () => {
      const spy = jest.spyOn(mockUserOwnsDatabaseService, 'findOne');

      await controller.delete(mockAuthorizedResponse, mockUserOwnsDatabaseDto);

      expect(spy).toHaveBeenCalledWith(
          mockUserOwnsDatabaseDto.database_id,
          mockAuthorizedResponse.locals.userMakingRequest.id,
      );
    });

    it('should call userOwnsDatabaseService with delete', async () => {
      const spy = jest.spyOn(mockUserOwnsDatabaseService, 'delete');

      await controller.delete(mockAuthorizedResponse, mockUserOwnsDatabaseDto);

      expect(spy).toHaveBeenCalledWith(
          mockUserOwnsDatabaseDto.database_id,
          mockAuthorizedResponse.locals.userMakingRequest.id,
      );
    });
  });
});
