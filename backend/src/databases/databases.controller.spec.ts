import { Test, TestingModule } from '@nestjs/testing';
import { DatabasesController } from './databases.controller';
import { Database } from './database.entity';
import { DatabasesService } from './databases.service';
import { UserOwnsDatabaseService } from '../user-owns-database/user-owns-database.service';
import { UsersService } from '../user/users.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('DatabasesController', () => {
  let controller: DatabasesController;

  const validDatabaseRecord = {
    id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
    name: 'Database name',
    type: 'postgres',
    creation_date_time: new Date(),
    pgd_id: 16463,
  };
  const invalidDatabaseUuid = '28fe3613-b0f2-4d88-9934-d53586384f96';

  const mockResponse = {
    status: jest.fn((x) => x),
    locals: {
      userMakingRequest: { id: '448098df-b9dd-4ec2-af9f-b23459b203a1' },
    },
  } as unknown as Response;
  const mockUnauthorizedResponse = {
    status: jest.fn((x) => x),
  } as unknown as Response;

  const mockDatabasesService = {
    findOne: jest.fn(async function (databaseId): Promise<Database> {
      if (databaseId !== validDatabaseRecord.id) throw new Error();
      return validDatabaseRecord;
    }),
    findAllForUser: jest.fn(async function (): Promise<Database[]> {
      return [validDatabaseRecord];
    }),
  };

  const mockUserOwnsDatabaseService = {};
  const mockUsersService = {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [DatabasesController],
      providers: [
        { provide: DatabasesService, useValue: mockDatabasesService },
        {
          provide: UserOwnsDatabaseService,
          useValue: mockUserOwnsDatabaseService,
        },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = moduleFixture.get<DatabasesController>(DatabasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should return a status of 500', async () => {
      await controller.getOne(mockResponse, invalidDatabaseUuid);
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should return a database', async () => {
      const result = await controller.getOne(
        mockResponse,
        validDatabaseRecord.id,
      );
      expect(result).toBe(validDatabaseRecord);
    });

    it('should call findOne on databaseService', async () => {
      const spy = jest.spyOn(mockDatabasesService, 'findOne');

      await controller.getOne(mockResponse, validDatabaseRecord.id);

      expect(spy).toHaveBeenCalledWith(validDatabaseRecord.id);
    });
  });

  describe('getAll', () => {
    it('should return a status of 500', async () => {
      await controller.getAll(mockUnauthorizedResponse);
      expect(mockUnauthorizedResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should return databases', async () => {
      const result = await controller.getAll(mockResponse);
      expect(result[0]).toBe(validDatabaseRecord);
    });

    it('should call findOne on databaseService', async () => {
      const spy = jest.spyOn(mockDatabasesService, 'findAllForUser');

      await controller.getAll(mockResponse);

      expect(spy).toHaveBeenCalledWith(
        mockResponse.locals.userMakingRequest.id,
      );
    });
  });

  describe('create', () => {
    it('should create a database', async () => {
      const result = await controller.create(mockResponse, {
        name: 'database-to-create',
        type: 'postgres',
      });
      expect(result[0]).toBe(validDatabaseRecord);
    });

    // it('should call findOne on databaseService', async () => {
    //   const spy = jest.spyOn(mockDatabasesService, 'findAllForUser');
    //
    //   await controller.getAll(mockResponse);
    //
    //   expect(spy).toHaveBeenCalledWith(mockResponse.locals.userMakingRequest.id);
    // });
  });
});
