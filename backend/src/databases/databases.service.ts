import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Database } from './database.entity';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { v4 as generateUUID } from 'uuid';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { DatabaseManagementDao } from '../dao/databaseManagement.dao';

@Injectable()
export class DatabasesService {
  constructor(
    @InjectRepository(Database)
    private databasesRepository: Repository<Database>,
    private databaseManagementDao: DatabaseManagementDao,
  ) {}

  public findOne(database_id: string): Promise<Database> {
    return this.databasesRepository.findOneByOrFail({ id: database_id });
  }

  public findAllForUser(userId: string): Promise<Database[]> {
    return this.databasesRepository.query(
      `
        SELECT database.* FROM docker.database
        INNER JOIN docker.user_owns_database
        ON database.id = user_owns_database.database_id AND user_owns_database.user_id = $1
    `,
      [userId],
    );
  }

  public async insert(databaseDto: CreateDatabaseDto): Promise<InsertResult> {
    const database: Database = {
      ...databaseDto,
      ...{ id: generateUUID(), creation_date_time: new Date() },
    };
    const result = this.databasesRepository.insert(database);
    await this.createDatabaseWithUser(databaseDto.name);
    return result;
  }

  public update(database: UpdateDatabaseDto): Promise<UpdateResult> {
    return this.databasesRepository.update({ id: database.id }, database);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return this.databasesRepository.delete(id);
  }

  //database management context
  public async createDatabaseWithUser(databaseName: string) {
    //todo create databasename based on username
    if (
      (await this.databaseManagementDao.lookUpDatabase(databaseName))[0] ==
      undefined
    ) {
      await this.databaseManagementDao.createDatabase(databaseName);
    }
    //todo get user from tokens
    //todo use password from request or generate password and return it to the requester
    // todo move this to the user creation endpoint
    if (
      (await this.databaseManagementDao.lookUpUser('test1')) == undefined
    ) {
      await this.databaseManagementDao.createUser('test1', 'test1');
    }
    await this.databaseManagementDao.grantUserAccessToDatabase(
      'test1',
      databaseName,
    );
  }
}
