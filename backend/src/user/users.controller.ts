import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { createUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Api endpoint for getting all users
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  /**
   * Api endpoint for getting user by id
   * @param {string} id user id of requested user
   */
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id,
  ): Promise<User> {
    return await this.usersService.findOne(id);
  }

  /**
   * Api endpoint for creating user returns the id of made user
   * @param {User} user user to be made
   */
  @Patch()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body('user', new ValidationPipe()) user: createUserDto,
  ): Promise<string> {
    await this.usersService.putOne(user);
    return user.id;
  }

  /**
   * Api endpoint for deleting user by id
   * @param {String} id id of user to be deleted
   */
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.usersService.remove(id);
  }
}
