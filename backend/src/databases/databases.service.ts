import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Database } from './database.entity';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { v4 as generateUUID } from 'uuid';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { DatabaseManagementService } from '../meta-database-management/database-management.service';
import { ReturnDatabase } from './dto/database-create-return.dto';
import { User as UserMakingRequest } from 'hemiron-auth/dist/models/user';

@Injectable()
export class DatabasesService {
  constructor(
    @InjectRepository(Database)
    private databasesRepository: Repository<Database>,
    private databaseManagementDao: DatabaseManagementService,
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

  public async insert(
    databaseDto: CreateDatabaseDto,
    userMakingRequest: UserMakingRequest,
  ): Promise<ReturnDatabase> {
    const databaseId = generateUUID();

    const dto: ReturnDatabase = await this.createDatabaseWithUser(
      databaseDto.name,
      userMakingRequest,
      databaseId,
    );

    const database: Database = {
      ...databaseDto,
      ...{ id: databaseId, created_at: new Date(), pgd_id: dto.pg_id },
    };

    await this.databasesRepository.insert(database);
    return dto;
  }

  public update(database: UpdateDatabaseDto): Promise<UpdateResult> {
    return this.databasesRepository.update({ id: database.id }, database);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return this.databasesRepository.delete(id);
  }

  /**
   * creates a new database and a user that can use it
   * @param databaseName the name of the database
   * @param userMakingRequest the user making the request
   * @param databaseId the uuid of the database
   */
  public async createDatabaseWithUser(
    databaseName: string,
    userMakingRequest: UserMakingRequest,
    databaseId: string,
  ): Promise<ReturnDatabase> {
    const password = Math.random().toString(36).slice(-8);
    const username = databaseId + '.' + databaseName;
    databaseName = userMakingRequest.id + '.' + databaseName;

    await this.databaseManagementDao.createDatabase(databaseName);

    await this.databaseManagementDao.createUser(username, password);

    await this.databaseManagementDao.grantUserAccessToDatabase(
      username,
      databaseName,
    );

    await this.databaseManagementDao.revokeAccessFromPublic(databaseName);
    const returnDatabase: ReturnDatabase = {
      user_id: userMakingRequest.id,
      username: username,
      password: password,
      databaseName: databaseName,
      database_id: databaseId,
      pg_id: await this.databaseManagementDao.getDatabasePGIDByName(
        databaseName,
      ),
    };
    return returnDatabase;
  }
}
