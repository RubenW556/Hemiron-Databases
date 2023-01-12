import { Test, TestingModule } from '@nestjs/testing';
import { CreateRedisService } from './create-redis.service';
import Redis from 'ioredis';
import { QueryLoggingService } from './query-logging.service';
import { RedisService } from '@liaoliaots/nestjs-redis';

describe('CreateRedisService', () => {
  let service: CreateRedisService;
  let mockKeyValueDB = {};

  const mockRedis = {
    acl: jest.fn(function (subcommand): string {
      switch (subcommand) {
        case 'WHOAMI':
          return mockCurrentUser.database_id;
        case 'USERS':
          return '';
      }
    }),
    set: jest.fn(function (fullKey, value): string {
      mockKeyValueDB[fullKey] = value;
      return 'OK';
    }),
    get: jest.fn(function (fullKey): string {
      if (mockKeyValueDB.hasOwnProperty(fullKey)) {
        return mockKeyValueDB[fullKey];
      }
      return '';
    }),
    del: jest.fn(function (): string {
      return 'OK';
    }),
    keys: jest.fn(function (startsWith): { key: string; value: string }[] {
      const filteredKeys = Object.keys(mockKeyValueDB).filter((key) =>
        key.startsWith(startsWith),
      );
      return filteredKeys.map((key) => ({
        key,
        value: mockKeyValueDB[key],
      }));
    }),
    scan: jest.fn(function (cursor, patternToken, startsWith): string[] {
      if (patternToken === 'MATCH') {
        const filteredKeys = Object.keys(mockKeyValueDB).filter((key) =>
          key.startsWith(startsWith),
        );
        return [cursor, filteredKeys];
      } else throw new Error();
    }),
    auth: jest.fn(function (dbname): string {
      mockCurrentUser.database_id = dbname;
      return 'OK';
    }),
    info: jest.fn(function (): void {
      return;
    }),
    client: jest.fn(function (): void {
      return;
    }),
  };
  const mockQueryLoggerService = {
    logQuery: jest.fn(function (): Promise<void> {
      return;
    }),
  };
  const mockRedisService = {
    getClient: jest.fn(function () {
      return mockRedis;
    }),
  };

  const mockUser = {
    database_id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
    user_id: '448098df-b9dd-4ec2-af9f-b23459b203a1',
  };

  const mockUser2 = {
    database_id: '0080799-2c3a-44e0-94a9-409805ce0a3e',
    user_id: '555098df-b9dd-4ec2-af9f-b23459b204b2',
  };

  const mockCurrentUser = mockUser;

  const mockSingleKeyValue = { key: 'key1', value: 'value1' };

  const testpassword = 'testpassword';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRedisService,
        {
          provide: Redis,
          useValue: mockRedis,
        },
        {
          provide: QueryLoggingService,
          useValue: mockQueryLoggerService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<CreateRedisService>(CreateRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set', () => {
    it('should call queryLoggingService.logQuery(currentDb)', async () => {
      const spy = jest.spyOn(mockQueryLoggerService, 'logQuery');
      await service.set(mockSingleKeyValue.key, mockSingleKeyValue.value);

      expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
    });

    it('should call Redis.set(fullkey, value)', async () => {
      const spy = jest.spyOn(mockRedis, 'set');
      const fullkey = mockUser.database_id + ':' + mockSingleKeyValue.key;
      await service.set(mockSingleKeyValue.key, mockSingleKeyValue.value);

      expect(spy).toHaveBeenCalledWith(fullkey, mockSingleKeyValue.value);
    });

    it('should return OK if succes', async () => {
      const result = await service.set(
        mockSingleKeyValue.key,
        mockSingleKeyValue.value,
      );

      expect(result).toEqual('OK');
    });
  });

  describe('get', () => {
    it('should call queryLoggingService.logQuery(currentDb)', async () => {
      const spy = jest.spyOn(mockQueryLoggerService, 'logQuery');
      await service.get(mockSingleKeyValue.key);

      expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
    });

    it('should call Redis.get(fullkey)', async () => {
      const spy = jest.spyOn(mockRedis, 'get');
      const fullkey = mockUser.database_id + ':' + mockSingleKeyValue.key;
      await service.get(mockSingleKeyValue.key);

      expect(spy).toHaveBeenCalledWith(fullkey);
    });

    it('should return key if succes', async () => {
      const result = await service.get(mockSingleKeyValue.key);
      expect(result).toEqual(mockSingleKeyValue.value);
    });
    it('should return nothing if fail', async () => {
      const result = await service.get('nonexistantkey');
      expect(result).toEqual('');
    });
  });

  describe('delete', () => {
    it('should call queryLoggingService.logQuery(currentDb)', async () => {
      const spy = jest.spyOn(mockQueryLoggerService, 'logQuery');
      await service.delete(mockSingleKeyValue.key);

      expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
    });

    it('should call Redis.delete(fullkey)', async () => {
      const spy = jest.spyOn(mockRedis, 'del');
      const fullkey = mockUser.database_id + ':' + mockSingleKeyValue.key;
      await service.delete(mockSingleKeyValue.key);

      expect(spy).toHaveBeenCalledWith(fullkey);
    });

    it('should return OK if succes', async () => {
      const result = await service.delete(mockSingleKeyValue.key);
      expect(result).toEqual('OK');
    });
  });

  describe('getAllKeys', () => {
    it('should call queryLoggingService.logQuery(currentDb, keys.length)', async () => {
      mockKeyValueDB = {};

      const amountOfKeys = 4;
      for (let i = 1; i <= amountOfKeys; i++) {
        const dbname = await service.getValidSearchTerm(
          mockCurrentUser.database_id,
        );
        const fullKey = `${dbname}:key${i}`;
        mockKeyValueDB[fullKey] = `value${i}`;
      }

      const spy = jest.spyOn(mockQueryLoggerService, 'logQuery');

      await service.getAllKeys(mockCurrentUser.database_id);

      expect(spy).toBeCalledWith(mockCurrentUser.database_id, amountOfKeys);
    });

    it('should call CreateRedisService.getValidSearchterm(dbname)', async () => {
      const spy = jest.spyOn(service, 'getValidSearchTerm');
      await service.getAllKeys(mockCurrentUser.database_id);

      expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
    });

    it('should call Redis.keys(getValidSearchTerm(dbname)', async () => {
      const spy = jest.spyOn(mockRedis, 'keys');
      const validSearchTerm = await service.getValidSearchTerm(
        mockCurrentUser.database_id,
      );

      await service.getAllKeys(mockCurrentUser.database_id);

      expect(spy).toHaveBeenCalledWith(validSearchTerm);
    });

    it('should return the keys of logged-in database', async () => {
      const result = await service.getAllKeys(mockCurrentUser.database_id);
      const searchTerm = await service.getValidSearchTerm(
        mockCurrentUser.database_id,
      );
      const filteredKeys = Object.keys(mockKeyValueDB).filter((key) =>
        key.startsWith(searchTerm),
      );
      const filteredObjects = filteredKeys.map((key) => ({
        key,
        value: mockKeyValueDB[key],
      }));

      expect(result).toEqual(filteredObjects);
    });
  });

  describe('deleteAllKeys', () => {
    it('should call queryLoggingService.logQuery(currentDb, keys.length)', async () => {
      mockKeyValueDB = {};
      const amountOfKeys = 4;
      for (let i = 1; i <= amountOfKeys; i++) {
        const dbname = await service.getValidSearchTerm(
          mockCurrentUser.database_id,
        );
        const fullKey = `${dbname}:key${i}`;
        mockKeyValueDB[fullKey] = `value${i}`;
      }

      const spy = jest.spyOn(mockQueryLoggerService, 'logQuery');

      await service.deleteAllKeys(mockCurrentUser.database_id);

      expect(spy).toBeCalledWith(mockCurrentUser.database_id, amountOfKeys);
    });

    it('should call CreateRedisService.getValidSearchterm(dbname)', async () => {
      mockKeyValueDB = {};
      const amountOfKeys = 4;
      for (let i = 1; i <= amountOfKeys; i++) {
        const dbname = await service.getValidSearchTerm(
          mockCurrentUser.database_id,
        );
        const fullKey = `${dbname}:key${i}`;
        mockKeyValueDB[fullKey] = `value${i}`;
      }

      const spy = jest.spyOn(service, 'getValidSearchTerm');
      await service.deleteAllKeys(mockCurrentUser.database_id);

      expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
    });

    it('should call Redis.del(keys)', async () => {
      const spy = jest.spyOn(mockRedis, 'del');
      const validSearchTerm = await service.getValidSearchTerm(
        mockCurrentUser.database_id,
      );
      const filteredKeys = Object.keys(mockKeyValueDB).filter((key) =>
        key.startsWith(validSearchTerm),
      );

      await service.deleteAllKeys(mockCurrentUser.database_id);

      expect(spy).toHaveBeenCalledWith(...filteredKeys);
    });

    it('should return OK if succes', async () => {
      const result = await service.deleteAllKeys(mockCurrentUser.database_id);
      expect(result).toEqual('OK');
    });
  });

  describe('login', () => {
    it('should call Redis.auth(dbname, password)', async () => {
      const spy = jest.spyOn(mockRedis, 'auth');
      await service.login(mockUser2.database_id, testpassword);

      expect(spy).toHaveBeenCalledWith(mockUser2.database_id, testpassword);
    });

    it('should change user', async () => {
      await service.login(mockUser2.database_id, testpassword);
      let currentDB = mockCurrentUser.database_id;
      expect(currentDB).toEqual(mockUser2.database_id);

      await service.login(mockUser.database_id, testpassword);
      currentDB = mockCurrentUser.database_id;
      expect(currentDB).toEqual(mockUser.database_id);
    });

    it('should return OK if succes', async () => {
      const result = await service.login(mockUser2.database_id, testpassword);
      expect(result).toEqual('OK');
    });
  });

  describe('getClientinfo', () => {
    it("should call Redis.client('INFO')", async () => {
      const spy = jest.spyOn(mockRedis, 'client');
      await service.getClientInfo();

      expect(spy).toHaveBeenCalledWith('INFO');
    });
  });

  describe('getRedisinfo', () => {
    it('should call Redis.info()', async () => {
      const spy = jest.spyOn(mockRedis, 'info');
      await service.getRedisInfo();

      expect(spy).toHaveBeenCalled();
    });
  });
});
