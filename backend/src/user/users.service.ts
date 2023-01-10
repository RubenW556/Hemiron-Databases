import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { MetricsService } from '../metrics/metrics.service';
import { DatabaseManagementService } from '../meta-database-management/database-management.service';

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
   * @param {string} id UUID of requested user as string
   **/
  async putOne(id: string): Promise<User> {
    const newUser: User = { id: id };
    await this.usersRepository.insert(newUser);

    return newUser;
  }

  /**
   * deletes user
   * @param {string} id UUID of to be deleted user as string
   */
  async remove(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  /**
   * Creates a user if the user doesn't exist yet
   * @param {string} userId UUID of requested user as string
   */
  async createUserIfNotExist(userId: string): Promise<void> {
    const user: User = await this.usersRepository.findOneBy({ id: userId });
    if (user == null) {
      await this.usersRepository.insert({ id: userId });
    }
  }

  /**
   * gets query count for user
   * @param {string} id UUID of to be deleted user as string
   */
  async getQueryCount(id: string): Promise<number> {
    if ((await this.databaseManagementService.lookUpUser(id)) == undefined) {
      throw new BadRequestException('user does not exist');
    }
    const result = await this.metricsService.getQueryCountByUser_Id(id);

    if (result === null) {
      throw new BadRequestException('User has no queries');
    }
    return result;
  }
}
