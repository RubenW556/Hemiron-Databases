import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import { Redis } from 'ioredis';
import { IORedisKey } from './redis/redis.module';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      @Inject(IORedisKey) private readonly redis: Redis  ) {
  }

  //@Get('test')
  //getHello(): string {
  //  return this.appService.getHello();
  //}

  @Get('test')
  async get(key: string): Promise<string> {
    return this.redis.get(key);
  }
}
