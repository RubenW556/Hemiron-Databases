import { Test, TestingModule } from '@nestjs/testing';
import { DatabasesController } from './databases.controller';
import { Database } from './database.entity';
import { DatabasesService } from './databases.service';
import { UserOwnsDatabaseService } from '../user-owns-database/user-owns-database.service';
import { UsersService } from '../user/users.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { ReturnDatabase } from './dto/database-create-return.dto';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { UserOwnsDatabase } from '../user-owns-database/user-owns-database.entity';
import { User as UserMakingRequest } from 'hemiron-auth/dist/models/user';

describe('DatabasesController', () => {
  let controller: DatabasesController;

  const validDatabaseRecord: Database = {
    id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
    name: 'Database name',
    type: 'postgres',
    created_at: new Date(),
    pgd_id: 16463,
  };

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
    findOne: jest.fn(async (): Promise<Database> => validDatabaseRecord),
    findAllForUser: jest.fn(
      async (): Promise<Database[]> => [validDatabaseRecord],
    ),
    insert: jest.fn(async function (
      databaseDto: CreateDatabaseDto,
      userMakingRequest: UserMakingRequest,
    ): Promise<ReturnDatabase> {
      return {
        database_id: '836b450a-3720-48ab-ade5-97eb692737e2',
        databaseName: databaseDto.name,
        user_id: userMakingRequest.id,
      } as ReturnDatabase;
    }),
    update: jest.fn(async function (
      updateDatabaseDto: UpdateDatabaseDto,
    ): Promise<UpdateResult> {
      validDatabaseRecord.name = updateDatabaseDto.name;
      return {} as UpdateResult;
    }),
    delete: jest.fn(async function (): Promise<DeleteResult> {
      return {} as DeleteResult;
    }),
  };

  const mockUsersService = {
    createUserIfNotExist: jest.fn(async (): Promise<void> => {
      return;
    }),
  };

  const mockUserOwnsDatabaseService = {
    findOne: jest.fn(async function (): Promise<UserOwnsDatabase> {
      return {} as UserOwnsDatabase;
    }),
    insert: jest.fn(async function (): Promise<InsertResult> {
      return {} as InsertResult;
    }),
  };

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

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should return a status of 500 when unauthorized', async () => {
      await controller.getOne(mockUnauthorizedResponse, validDatabaseRecord.id);
      expect(mockUnauthorizedResponse.status).toHaveBeenCalledWith(
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
    it('should return a status of 500 when unauthorized', async () => {
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
    const createDatabaseDto: CreateDatabaseDto = {
      name: 'database-to-create',
      type: 'postgres',
    };

    it('should return database name and user id in an object', async () => {
      const result = await controller.create(mockResponse, createDatabaseDto);
      expect(result.databaseName).toBe(createDatabaseDto.name);
      expect(result.user_id).toBe(mockResponse.locals.userMakingRequest.id);
    });

    it('should call insert on DatabasesService', async () => {
      const spy = jest.spyOn(mockDatabasesService, 'insert');
      await controller.create(mockResponse, createDatabaseDto);
      expect(spy).toHaveBeenCalledWith(
        createDatabaseDto,
        mockResponse.locals.userMakingRequest,
      );
    });

    it('should create user if user does not exist', async () => {
      const spy = jest.spyOn(mockUsersService, 'createUserIfNotExist');
      await controller.create(mockResponse, createDatabaseDto);
      expect(spy).toHaveBeenCalledWith(
        mockResponse.locals.userMakingRequest.id,
      );
    });

    it('should add permissions for created database', async () => {
      const spy = jest.spyOn(mockUserOwnsDatabaseService, 'insert');
      await controller.create(mockResponse, createDatabaseDto);
      expect(spy).toHaveBeenCalledWith(
        expect.any(String),
        mockResponse.locals.userMakingRequest.id,
      );
    });
  });

  describe('update', () => {
    const updateDatabaseDto: UpdateDatabaseDto = {
      id: validDatabaseRecord.id,
      name: 'database-with-updated-name',
    };

    it('should return a status of 500 when unauthorized', async () => {
      await controller.update(mockUnauthorizedResponse, updateDatabaseDto);
      expect(mockUnauthorizedResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should return the updated database name', async () => {
      const result = await controller.update(mockResponse, updateDatabaseDto);
      expect(result.name).toBe(updateDatabaseDto.name);
    });

    it('should call insert on UserOwnsDatabaseService', async () => {
      const spy = jest.spyOn(mockDatabasesService, 'update');
      await controller.update(mockResponse, updateDatabaseDto);
      expect(spy).toHaveBeenCalledWith(updateDatabaseDto);
    });
  });

  describe('delete', () => {
    it('should return a status of 500 when unauthorized', async () => {
      await controller.delete(mockUnauthorizedResponse, validDatabaseRecord.id);
      expect(mockUnauthorizedResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should call delete on DatabasesService', async () => {
      const spy = jest.spyOn(mockDatabasesService, 'delete');
      await controller.delete(mockResponse, validDatabaseRecord.id);
      expect(spy).toHaveBeenCalledWith(validDatabaseRecord.id);
    });
  });
});
