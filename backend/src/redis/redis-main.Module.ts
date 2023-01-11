import { Module } from '@nestjs/common';
import IORedis from 'ioredis';
import { RedisController } from './redis.controller';
import { CreateRedisService } from './create-redis.service';
import {QueryLoggingService} from "./query-logging.service";
export const IORedisKey = 'IORedis';

@Module({
  controllers: [RedisController],
  providers: [CreateRedisService, QueryLoggingService],
})

export class RedisMainModule {
}
