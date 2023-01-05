import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { createUserDto } from './dto/create-user.dto';
import { MetricsService } from '../metrics/metrics.service';
import { DatabaseManagementService } from '../meta-database-management/databaseManagement.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private databaseManagementService: DatabaseManagementService,
    private metricsService: MetricsService,
  ) {}

  /**
   * Gets all users and returns them as a array
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Gets user by id
   * @param {string} id UUID of requested user as string
   */
  async findOne(id: string): Promise<User> {
    const user: User = await this.usersRepository.findOneBy({ id: id });
    if (user == null) {
      throw new BadRequestException("can't find user by uuid");
    }
    return user;
  }

  /**
   * creates user
   * @param {createUserDto} id UUID of requested user as string
   */
  async putOne(createUserDto: createUserDto, username: string): Promise<User> {
    const newUser: User = { id: username, username: createUserDto.username };
    await this.usersRepository.insert(newUser);

    return newUser;
  }

  /**
   * deletes user
   * @param {string} user_id UUID of to be deleted user as string
   */
  async remove(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  /**
   * gets query count for user
   * @param {string} user_id UUID of to be deleted user as string
   */
  async getQueryCount(id: string): Promise<number> {
    if ((await this.databaseManagementService.lookUpUser(id)) == undefined) {
      new BadRequestException('user does not exist');
    }
    const result = await this.metricsService.getQueryCountByUser_Id(id);

    if (result === null) {
      throw new BadRequestException('User has no queries');
    }
    return result;
  }
}
