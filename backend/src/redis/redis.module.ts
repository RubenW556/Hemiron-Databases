import {DynamicModule, FactoryProvider, Module, ModuleMetadata} from '@nestjs/common';
import IORedis, {Redis, RedisOptions} from "ioredis";
import {DatabasesController} from "../databases/databases.controller";
import {DatabasesService} from "../databases/databases.service";
import {DatabaseManagementService} from "../metaDatabaseManagement/databaseManagement.service";
import {UserOwnsDatabaseService} from "../user-owns-database/user-owns-database.service";
import {UsersService} from "../user/users.service";
import {AuthenticationService} from "hemiron-auth/dist/services/authentication.service";
import {RedisController} from "./redis.controller";
import {RedisService} from "./redis.service";
export const IORedisKey = 'IORedis';

type RedisModuleOptions = {
    connectionOptions: RedisOptions;
    onClientReady?: (client: Redis)=> void;
}

type RedisAsyncModuleOptions = {
    useFactory: (
        ...args: any[]
    ) => Promise<RedisModuleOptions> | RedisModuleOptions;
}   & Pick<ModuleMetadata, 'imports'>
    & Pick<FactoryProvider, 'inject'>;

@Module({
    controllers: [RedisController],
    providers: [RedisService],

})
export class RedisModule {
    static async registerAsync(
        {
            useFactory,
            imports,
            inject,
        }:RedisAsyncModuleOptions): Promise<DynamicModule>{
        const redisProvider = {
            provide: IORedisKey,
            useFactory: async (...args) => {
                const {connectionOptions, onClientReady} = await useFactory(...args);
                const client = await new IORedis(connectionOptions);
                onClientReady(client);
                return client;
            },
            inject,
        };

        return{
            module: RedisModule,
            imports,
            providers: [redisProvider],
            exports: [redisProvider],
        };
    }
}
