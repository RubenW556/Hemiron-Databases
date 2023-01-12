import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.entity';
import {CreateRedisService} from "./create-redis.service";
import Redis from "ioredis";
import {QueryLoggingService} from "./query-logging.service";

describe('CreateRedisService', () => {
    let service: CreateRedisService;
    const mockUser = {
        database_id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
        user_id: '448098df-b9dd-4ec2-af9f-b23459b203a1',
    };
    let mockSingleKeyValue = {key: 'key1', value: 'value1'};
    let mockKeyValueDB = {};
    const mockAdmin = {
        database_id: 'default',
        user_id: 'default'
    }
    const mockQueryLoggerService = {
        logQuery: jest.fn(async function (database_uuid: string, queries = 1): Promise<void> {
            return;
        }),
    };

    const mockRedis = {
        acl: jest.fn(async function (): Promise<string> {
            return mockUser.database_id;
        }),
        set: jest.fn(async function (fullKey, value): Promise<void> {
            mockKeyValueDB[fullKey] = value;
            return;
        }),
        delete: jest.fn(async function (): Promise<void> {
            return;
        }),
    };

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

            expect(spy).toHaveBeenCalledWith(mockUser.database_id);
        });

        it('should call Redis.set(fullkey, value)', async () => {
            const spy = jest.spyOn(mockRedis, 'set');
            const fullkey =  + mockUser.database_id + ":" + mockSingleKeyValue.key;
            await service.set(
                mockSingleKeyValue.key, mockSingleKeyValue.value
            );

            expect(spy).toHaveBeenCalledWith(fullkey, mockSingleKeyValue.value);
        });

        it('should return an object with user_id and database_id', async () => {
            const result = await service.findOne(mockUserOwnsDatabaseDto.database_id, mockUserOwnsDatabaseDto.user_id);

            expect(result.user_id).toBeDefined();
            expect(result.database_id).toBeDefined();
        });

    });



    describe('insert', () => {
        it('should call UserOwnsDatabaseRepository and insert database object', async () => {
            const database: UserOwnsDatabase = {
                database_id: mockUserOwnsDatabaseDto.database_id,
                user_id: mockUserOwnsDatabaseDto.user_id,
            };
            const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'insert');

            await service.insert(
                mockUserOwnsDatabaseDto.database_id,
                mockUserOwnsDatabaseDto.user_id,
            );

            expect(spy).toHaveBeenCalledWith(database);
        });
    });

    describe('delete', () => {
        it('should call UserOwnsDatabaseRepository.delete() with database_id and user_id', async () => {
            const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'delete');

            await service.delete(
                mockUserOwnsDatabaseDto.database_id,
                mockUserOwnsDatabaseDto.user_id,
            );

            expect(spy).toHaveBeenCalledWith({
                database_id: mockUserOwnsDatabaseDto.database_id,
                user_id: mockUserOwnsDatabaseDto.user_id,
            });
        });
    });
});
