import {
  BadRequestException, Body,
  Controller,
  Delete,
  Get, HttpException,
  Param,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
  Response
} from '@nestjs/common';

import { CreateRedisService } from './create-redis.service';
import {HttpErrorByCode} from "@nestjs/common/utils/http-error-by-code.util";
import {UpdateDatabaseDto} from "../databases/dto/update-database.dto";

@UsePipes(new ValidationPipe())
@Controller('redis')
export class RedisController {
  constructor(private redisService: CreateRedisService) {}

  @Put('key/:key')
  async setKey(@Param('key') key: string, @Req() req): Promise<string> {
    const value = req.body.value;
    if (typeof value === 'undefined') {
      throw new HttpException('No value in body', 400);
    }
    return this.redisService.set(key, value);
  }

  @Get('key/:key')
  async getValue(@Param('key') key: string): Promise<string> {
    return this.redisService.get(key);
  }

  @Delete('key/:key')
  async deleteKey(@Param('key') key: string, @Response() res): Promise<string> {
    const result = await this.redisService.delete(key);
    if (result === 1) {
      res.status(200).send({ message: 'OK' });
    } else if (result === 0) {
      throw new HttpException('Key not found', 404);
    } else return result.toString();
  }

  @Get('allkeys/:dbname')
  async getAllKeysFromDb(@Param('dbname') dbname?: string): Promise<string[]> {
    return this.redisService.getAllKeys(dbname);
  }

  @Delete('allkeys/:dbname')
  async deleteAllKeysFromDb(@Param('dbname') dbname?: string): Promise<string> {
    return this.redisService.deleteAllKeys(dbname);
  }

  @Post('login/:dbname/')
  async login(@Param('dbname') dbname: string, @Req() req): Promise<string> {
    const password = req.body.password;
    if (typeof password === 'undefined') {
      throw new HttpException('No database name in body', 400);
    }
    return this.redisService.login(dbname, password);
  }

  @Put('password/:dbname')
  async addPassword(
    @Param('dbname') dbname: string,
    @Req() req,
  ): Promise<string> {
    const password = req.body.password;
    if (typeof password === 'undefined') {
      throw new HttpException('No password in body', 400);
    }
    return this.redisService.addPassword(dbname, password);
  }

  @Delete('password/:dbname')
  async deletePassword(
    @Param('dbname') dbname: string,
    @Req() req,
  ): Promise<string> {
    const password = req.body.password;
    if (typeof password === 'undefined') {
      throw new HttpException('No databasename in body', 400);
    }
    return await this.redisService.deletePassword(dbname, password);
  }

  @Post('db/:dbname')
  async createDb(@Param('dbname') dbname: string, @Req() req): Promise<string> {
    const password = req.body.password;
    if (typeof password === 'undefined') {
      throw new HttpException('No password in body', 400);
    }
    if (dbname.includes(':')) {
      throw new HttpException('A databasename is not allowed to contain a semicolon ":" ', 406);
    }
    const response = await this.redisService.getAllDatabases();
    if (response.includes(dbname)) {
      throw new HttpException('Databasename already in use, please pick another Databasename', 406);
    }
    return this.redisService.addPassword(dbname, password);
  }

  @Get('db/:dbname')
  async getDb(@Param('dbname') dbname: string): Promise<string[]> {
    const response = await this.redisService.getDb(dbname);
    if (response == null) {
      throw new HttpException('Database not found', 404);
    }
    return this.redisService.getDb(dbname);
  }

  @Delete('db/:dbname')
  async deleteDb(@Param('dbname') dbname: string, @Response() res): Promise<string> {
    const result = await this.redisService.deleteDb(dbname);
    if (result === 1) {
      res.status(200).send({ message: 'OK' });
    } else if (result === 0) {
      throw new HttpException('User does not exist', 406);
    }
    else{
      return result.toString();
    }
  }

  @Get('usage/:dbname')
  async getMemoryUsage(@Param('dbname') dbname: string): Promise<string> {
    return this.redisService.getMemoryUsage(dbname).toString() + ' bytes';
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
