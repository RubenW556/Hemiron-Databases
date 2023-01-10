import {
  DynamicModule,
  FactoryProvider, Logger,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';
import { RedisController } from './redis.controller';
import { CreateRedisService } from './createRedis.service';
export const IORedisKey = 'IORedis';

type RedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

type RedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

@Module({
  controllers: [RedisController],
  providers: [CreateRedisService],
})

export class RedisAppModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: IORedisKey,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);
        const client = await new IORedis(connectionOptions);
        onClientReady(client);
        return client;
      },
      inject,
    };

    return {
      module: RedisAppModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider, CreateRedisService],
    };
  }
}
