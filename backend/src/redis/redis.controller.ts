import {Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { CreateRedisService } from './createRedis.service';

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

  @Post('login/:username/:password')
  async login(
    @Param('username') username: string,
    @Param('password') password: string,
  ): Promise<string> {
    return this.redisService.login(username, password);
  }

  @Put('password/:username/:password')
  async addPassword(
    @Param('username') username: string,
    @Param('password') password: string,
  ): Promise<string> {
    return this.redisService.addPassword(username, password);
  }

  @Delete('password/:username/:password')
  async deletePassword(
    @Param('username') username: string,
    @Param('password') password: string,
  ): Promise<string> {
    return await this.redisService.deletePassword(username, password);
  }

  @Post('user/:username/:password')
  async createUser(
      @Param('username') username: string,
      @Param('password') password: string,
  ): Promise<string> {
    const response = await this.redisService.getAllUsers();
    if (response.includes(username)) {
      return 'Username already in use, please pick another username';
    }
    return this.redisService.addPassword(username, password);
  }

  @Get('user/:username')
  async getUser(@Param('username') username: string): Promise<string[]> {
    const response = await this.redisService.getUser(username);
    if (response == null) {
      return ["User doesn't exist"];
    }
    return this.redisService.getUser(username);
  }

  @Delete('user/:username')
  async createUserName(@Param('username') username: string): Promise<string> {
    const result = await this.redisService.deleteUser(username);
    if (result === 1) {
      return 'OK';
    } else if (result === 0) {
      return "User doesn't exist";
    }
    return result.toString();
  }

  @Get('allusers')
  async getAllUsers(): Promise<string[]> {
    return this.redisService.getAllUsers();
  }

  @Get('currentuser')
  async getCurrentUser(): Promise<string> {
    return this.redisService.getCurrentUser();
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
