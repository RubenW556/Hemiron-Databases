import {Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { CreateRedisService } from './createRedis.service';
import {ApiQuery} from '@nestjs/swagger'
@Controller('redis')
@Controller()
export class RedisController {
  constructor(private redisService: CreateRedisService) {}

  @Put('key/:key/:value')
  async setKey(
    @Param('key') key: string,
    @Param('value') value: string,
  ): Promise<string> {
    return this.redisService.set(key, value);
  }

  @Get('key/:key')
  async getValue(@Param('key') key: string): Promise<string> {
    return this.redisService.get(key);
  }

  @Delete('key/:key')
  async deleteKey(@Param('key') key: string): Promise<string> {
    const result = await this.redisService.delete(key);
    if (result === 1) {
      return 'OK';
    } else if (result === 0) {
      return "Key doesn't exist";
    } else return result.toString();
  }

  @Get('allkeys')
  async getAllKeys(): Promise<string[]> {
    return this.redisService.getAllKeys();
  }

  @Get('allkeys/:dbname')
  async getAllKeysFromDb(@Param('dbname') dbname?: string): Promise<string[]> {
    return this.redisService.getAllKeys(dbname);
  }

  @Delete('allkeys')
  async deleteAllKeys(): Promise<string> {
    return this.redisService.deleteAllKeys();
  }

  @Delete('allkeys/:dbname')
  async deleteAllKeysFromDb(@Param('dbname') dbname?: string): Promise<string> {
    return this.redisService.deleteAllKeys(dbname);
  }

  @Post('login/:dbname/:password')
  async login(
    @Param('dbname') dbname: string,
    @Param('password') password: string,
  ): Promise<string> {
    return this.redisService.login(dbname, password);
  }

  @Put('password/:dbname/:password')
  async addPassword(
    @Param('dbname') dbname: string,
    @Param('password') password: string,
  ): Promise<string> {
    return this.redisService.addPassword(dbname, password);
  }

  @Delete('password/:dbname/:password')
  async deletePassword(
    @Param('dbname') dbname: string,
    @Param('password') password: string,
  ): Promise<string> {
    return await this.redisService.deletePassword(dbname, password);
  }

  @Post('db/:dbname/:password')
  async createDb(
      @Param('dbname') dbname: string,
      @Param('password') password: string,
  ): Promise<string> {
    const response = await this.redisService.getAllDatabases();
    if (response.includes(dbname)) {
      return 'Databasename already in use, please pick another Databasename';
    }
    return this.redisService.addPassword(dbname, password);
  }

  @Get('db/:dbname')
  async getDb(@Param('dbname') dbname: string): Promise<string[]> {
    const response = await this.redisService.getDb(dbname);
    if (response == null) {
      return ["Database doesn't exist"];
    }
    return this.redisService.getDb(dbname);
  }

  @Delete('db/:dbname')
  async deleteDb(@Param('dbname') dbname: string): Promise<string> {

    const result = await this.redisService.deleteDb(dbname);
    if (result === 1) {
      return 'OK';
    } else if (result === 0) {
      return "User doesn't exist";
    }
    return result.toString();
  }

  @Get('alldatabases')
  async getAllDatabases(): Promise<string[]> {
    return this.redisService.getAllDatabases();
  }

  @Get('currentdatabase')
  async getCurrentDatabase(): Promise<string> {
    return this.redisService.getCurrentDb();
  }

  @Get('client')
  async getInfo(): Promise<string> {
    return this.redisService.getClientInfo();
  }

  @Get('info')
  async getRedisInfo(): Promise<string> {
    return this.redisService.getRedisInfo();
  }
}
