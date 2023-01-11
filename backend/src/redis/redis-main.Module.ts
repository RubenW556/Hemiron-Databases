import { Module } from '@nestjs/common';
import { RedisController } from './redis.controller';
import { CreateRedisService } from './create-redis.service';
import { QueryLoggingService } from './query-logging.service';

@Module({
  controllers: [RedisController],
  providers: [CreateRedisService, QueryLoggingService],
})
export class RedisMainModule {}
