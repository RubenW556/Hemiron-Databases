import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, DeleteResult, InsertResult } from 'typeorm';
import { MetricsService } from '../metrics/metrics.service';
import { DatabaseManagementService } from '../metaDatabaseManagement/databaseManagement.service';

describe('user service', () => {
  let service: UsersService;
  const validUuid1 = '7e43dcec-a5b9-4598-9712-b898ba352195';
  const validUuid2 = 'vb5b66927-f1f1-47ac-9207-d4e842d9a022';

  const mockDataCollectionDao = {};

  const mockDataSource = {};

  const mockUserRepository = {
    find: jest.fn(function () {
      const user: User[] = [{ id: validUuid1 }, { id: validUuid2 }];
      return user;
    }),
    findOneBy: jest.fn(function (id) {
      return { id: id.id };
    }),
    insert: jest.fn(function () {
      return new InsertResult();
    }),
    delete: jest.fn(function () {
      return new DeleteResult();
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        DatabaseManagementService,
        { provide: DataSource, useValue: mockDataSource },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: MetricsService, useValue: mockDataCollectionDao },
      ],
    }).compile();

    service = moduleFixture.get<UsersService>(UsersService);
  });

  it('should return an array of all users', async () => {
    const users: User[] = await service.findAll();
    const user: User = users[0];

    expect(users).toBeInstanceOf(Array);
    expect(typeof user).toBe(typeof new User());
  });

  it('should ask repository with id', async () => {
    const spy = jest.spyOn(mockUserRepository, 'findOneBy');

    await service.findOne(validUuid1);

    expect(spy).toHaveBeenCalledWith({ id: validUuid1 });
  });

  it('should put user into database', async () => {
    const spy = jest.spyOn(mockUserRepository, 'insert');

    await service.putOne(validUuid1);

    expect(spy).toHaveBeenCalledWith({ id: validUuid1 });
  });

  it('should delete user by uuid', async () => {
    const spy = jest.spyOn(mockUserRepository, 'delete');

    await service.remove(validUuid1);

    expect(spy).toHaveBeenCalledWith(validUuid1);
  });
});
