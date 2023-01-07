import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabasesService } from "./databases.service";
import { Database } from "./database.entity";
import { DatabaseManagementService } from "../meta-database-management/database-management.service";
import { CreateDatabaseDto } from "./dto/create-database.dto";
import { User as UserMakingRequest } from 'hemiron-auth/dist/models/user';
import { UpdateDatabaseDto } from "./dto/update-database.dto";

describe('Databases service', () => {
  let service: DatabasesService;

  const validDatabaseRecord: Database = { id: '77807154-2c3a-44e0-94a9-409805cf9a2f', name: 'Database name', type: 'postgres', created_at: new Date(), pgd_id: 16463 };
  const validUserID = 'c30a6cdd-02db-472f-8e69-80d57b67b3da';

  const mockDatabasesRepository = {
    findOneByOrFail: jest.fn(async (): Promise<Database> => validDatabaseRecord),
    query: jest.fn(async (): Promise<Database[]> => [validDatabaseRecord]),
    insert: jest.fn(async () => {
    }),
    update: jest.fn(async () => {
    }),
    delete: jest.fn(async () => {
    }),
  };

  const mockDatabaseManagementService = {
    createDatabase: jest.fn(async () => {
    }),
    createUser: jest.fn(async () => {
    }),
    grantUserAccessToDatabase: jest.fn(async () => {
    }),
    revokeAccessFromPublic: jest.fn(async () => {
    }),
    getDatabasePGIDByName: jest.fn(async () => {
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        DatabasesService,
        { provide: getRepositoryToken(Database), useValue: mockDatabasesRepository },
        { provide: DatabaseManagementService, useValue: mockDatabaseManagementService },
      ]
    }).compile();

    service = moduleFixture.get<DatabasesService>(DatabasesService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {

    it('should return a database', async () => {
      const result = await service.findOne(validDatabaseRecord.id);
      expect(result).toBe(validDatabaseRecord);
    });

    it('should call findOneByOrFail on databasesRepository', async () => {
      const spy = jest.spyOn(mockDatabasesRepository, 'findOneByOrFail');
      await service.findOne(validDatabaseRecord.id);
      expect(spy).toHaveBeenCalledWith({ id: validDatabaseRecord.id });
    });

  });

  describe('findAllForUser', () => {

    it('should return an array of databases', async () => {
      const result = await service.findAllForUser(validUserID);
      expect(result[0]).toBe(validDatabaseRecord);
    });

    it('should call query on databasesRepository', async () => {
      const spy = jest.spyOn(mockDatabasesRepository, 'query');
      await service.findAllForUser(validDatabaseRecord.id);
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('insert', () => {
    const createDatabaseDto: CreateDatabaseDto = { name: 'database-name', type: 'postgres' };

    it('should return an object with user id', async () => {
      const userMakingRequest = { id: validUserID } as unknown as UserMakingRequest;
      const result = await service.insert(createDatabaseDto, userMakingRequest);
      expect(result.databaseName).toBe(userMakingRequest.id + '.' + createDatabaseDto.name);
      expect(result.username).toBeDefined();
      expect(result.password).toBeDefined();
    });

    it('should call query on databasesRepository', async () => {
      const spy = jest.spyOn(mockDatabasesRepository, 'query');
      await service.findAllForUser(validDatabaseRecord.id);
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('update', () => {
    const updateDatabaseDto: UpdateDatabaseDto = { id: validDatabaseRecord.id, name: 'updated-database-name' };

    it('should call update on databasesRepository', async () => {
      const spy = jest.spyOn(mockDatabasesRepository, 'update');
      await service.update(updateDatabaseDto);
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('delete', () => {

    it('should call delete on databasesRepository', async () => {
      const spy = jest.spyOn(mockDatabasesRepository, 'delete');
      await service.delete(validDatabaseRecord.id);
      expect(spy).toHaveBeenCalled();
    });

  });

});
