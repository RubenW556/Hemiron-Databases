import { Test, TestingModule } from '@nestjs/testing';
import {CreateRedisService} from "./create-redis.service";
import Redis from "ioredis";
import {QueryLoggingService} from "./query-logging.service";
import {RedisService} from "@liaoliaots/nestjs-redis";

describe('CreateRedisService', () => {
    let service: CreateRedisService;

    const mockRedis = {
        acl: jest.fn( function (): string{
            return mockCurrentUser.database_id;
        }),
        set: jest.fn( function (fullKey, value): string{
            mockKeyValueDB[fullKey] = value;
            return "OK";
        }),
        get: jest.fn( function (fullKey): string{
            if(mockKeyValueDB.hasOwnProperty(fullKey)) {
                return mockKeyValueDB[fullKey];
            }
            return '';
        }),
        del: jest.fn( function (): string {
            return "OK";
        }),
    };
    const mockQueryLoggerService = {
        logQuery: jest.fn( function (database_uuid: string, queries = 1): Promise<void> {
            return;
        }),
    };
    const mockRedisService = {
        getClient: jest.fn( function () {
            return mockRedis;
        })
    };

    const mockUser = {
        database_id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
        user_id: '448098df-b9dd-4ec2-af9f-b23459b203a1',
    };
    const mockAdmin = {
        database_id: 'default',
        user_id: 'default'
    }
    let mockCurrentUser = mockUser;

    let mockSingleKeyValue = {key: 'key1', value: 'value1'};
    let mockKeyValueDB = {};
    const RedisCommands = require('redis-commands');


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
            await service.set(
                mockSingleKeyValue.key, mockSingleKeyValue.value
            );

            expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
        });

        it('should call Redis.set(fullkey, value)', async () => {
            const spy = jest.spyOn(mockRedis, 'set');
            let fullkey = mockUser.database_id + ":" + mockSingleKeyValue.key;
            await service.set(
                mockSingleKeyValue.key, mockSingleKeyValue.value
            );

            expect(spy).toHaveBeenCalledWith(fullkey, mockSingleKeyValue.value);
        });

        it('should return OK if succes', async () => {
            const result = await service.set(
                mockSingleKeyValue.key, mockSingleKeyValue.value
            );

            expect(result).toEqual('OK');
        });
    });

    describe('get', () => {
        it('should call queryLoggingService.logQuery(currentDb)', async () => {
            const spy = jest.spyOn(mockQueryLoggerService, 'logQuery');
            await service.get(
                mockSingleKeyValue.key
            );

            expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
        });

        it('should call Redis.get(fullkey)', async () => {
            const spy = jest.spyOn(mockRedis, 'get');
            let fullkey = mockUser.database_id + ":" + mockSingleKeyValue.key;
            await service.get(
                mockSingleKeyValue.key
            );

            expect(spy).toHaveBeenCalledWith(fullkey);
        });

        it('should return key if succes', async () => {
            const result = await service.get(
                mockSingleKeyValue.key
            );
            expect(result).toEqual(mockSingleKeyValue.value);
        });
        it('should return nothing if fail', async () => {
            const result = await service.get(
                'nonexistantkey'
            );
            expect(result).toEqual('');
        });
    });

    describe('delete', () => {
        it('should call queryLoggingService.logQuery(currentDb)', async () => {
            const spy = jest.spyOn(mockQueryLoggerService, 'logQuery');
            await service.delete(
                mockSingleKeyValue.key
            );

            expect(spy).toHaveBeenCalledWith(mockCurrentUser.database_id);
        });

        it('should call Redis.delete(fullkey)', async () => {
            const spy = jest.spyOn(mockRedis, 'del');
            let fullkey = mockUser.database_id + ":" + mockSingleKeyValue.key;
            await service.delete(
                mockSingleKeyValue.key
            );

            expect(spy).toHaveBeenCalledWith(fullkey);
        });

        it('should return OK if succes', async () => {
            const result = await service.delete(
                mockSingleKeyValue.key
            );
            expect(result).toEqual('OK');
        });
    });
});
