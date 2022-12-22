import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { Response } from 'express';
import { Database } from './database.entity';
import { DatabasesService } from './databases.service';
import { UserOwnsDatabaseService } from '../user-owns-database/user-owns-database.service';

@Controller('databases')
export class DatabasesController {
  constructor(
    private databasesService: DatabasesService,
    private userOwnsDatabaseService: UserOwnsDatabaseService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<Database> {
    try {
      return await this.databasesService.findOne(id);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(
    @Res({ passthrough: true }) res: Response,
  ): Promise<Database[]> {
    try {
      const userMakingRequest = res.locals.userMakingRequest;

      return await this.databasesService.findAllForUser(userMakingRequest.id);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) //todo validatioon
  public async create(
    @Res({ passthrough: true }) res: Response,
    @Body() createDatabaseDto: CreateDatabaseDto,
  ): Promise<Database> {
    try {
      const userMakingRequest = res.locals.userMakingRequest;

      const insertResult = await this.databasesService.insert(
        createDatabaseDto,
      );
      const newDatabaseId = insertResult.identifiers[0].id;

      await this.userOwnsDatabaseService.insert(
        newDatabaseId,
        userMakingRequest.id,
      );
      return await this.databasesService.findOne(newDatabaseId);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  public async update(
    @Res({ passthrough: true }) res: Response,
    @Body() database: UpdateDatabaseDto,
  ): Promise<Database> {
    try {
      await this.databasesService.update(database);
      return await this.databasesService.findOne(database.id);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      await this.databasesService.delete(id);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
