import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserOwnsDatabaseService } from './user-owns-database.service';
import { UserOwnsDatabaseDto } from './dto/user-owns-database.dto';

@Controller('user-owns-database')
export class UserOwnsDatabaseController {
  constructor(private userOwnsDatabaseService: UserOwnsDatabaseService) {}

  @Get(':databaseId')
  @HttpCode(HttpStatus.OK)
  public async getOne(
    @Res({ passthrough: true }) res: Response,
    @Param('databaseId') databaseId: string,
  ): Promise<void> {
    try {
      const userMakingRequest = res.locals.userMakingRequest;
      await this.userOwnsDatabaseService.findOne(
        databaseId,
        userMakingRequest.id,
      );
      return;
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Res({ passthrough: true }) res: Response,
    @Body() userOwnsDatabaseDto: UserOwnsDatabaseDto,
  ): Promise<void> {
    try {
      const userMakingRequest = res.locals.userMakingRequest;

      await this.userOwnsDatabaseService.findOne(
        userOwnsDatabaseDto.database_id,
        userMakingRequest.id,
      );
      await this.userOwnsDatabaseService.insert(
        userOwnsDatabaseDto.database_id,
        userOwnsDatabaseDto.user_id,
      );
      return;
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Res({ passthrough: true }) res: Response,
    @Body() userOwnsDatabaseDto: UserOwnsDatabaseDto,
  ): Promise<void> {
    try {
      const userMakingRequest = res.locals.userMakingRequest;

      await this.userOwnsDatabaseService.findOne(
        userOwnsDatabaseDto.database_id,
        userMakingRequest.id,
      );
      await this.userOwnsDatabaseService.delete(
        userOwnsDatabaseDto.database_id,
        userOwnsDatabaseDto.user_id,
      );
      return;
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
