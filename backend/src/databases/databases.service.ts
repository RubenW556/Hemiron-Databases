import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Database } from './database.entity';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { v4 as generateUUID } from 'uuid';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { DatabaseManagementService } from '../meta-database-management/database-management.service';
import { CreateDatabaseResponseDto } from './dto/create-database-response.dto';
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
  ): Promise<CreateDatabaseResponseDto> {
    const databaseId = generateUUID();

    const createdDatabaseInfo = await this.createDatabaseWithUser(
      databaseId,
      databaseDto.name,
      userMakingRequest,
    );

    await this.databasesRepository.insert({
      id: databaseId,
      name: databaseDto.name,
      type: databaseDto.type,
      created_at: new Date(),
      pgd_id: createdDatabaseInfo.pg_id,
    });

    return {
      database_id: databaseId,
      password: createdDatabaseInfo.password,
    };
  }

  public update(database: UpdateDatabaseDto): Promise<UpdateResult> {
    return this.databasesRepository.update({ id: database.id }, database);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return this.databasesRepository.delete(id);
  }

  /**
   * creates a new database and a user that can use it
   * @param databaseId the uuid of the database
   * @param databaseName the name of the database
   * @param userMakingRequest the user making the request
   */
  private async createDatabaseWithUser(
    databaseId: string,
    databaseName: string,
    userMakingRequest: UserMakingRequest,
  ): Promise<{ pg_id: any; password: string }> {
    const username = databaseId + '.' + databaseName;
    const password = this.generatePassword();
    const postgresDatabaseName = userMakingRequest.id + '.' + databaseName;

    await this.databaseManagementDao.createDatabase(postgresDatabaseName);

    await this.databaseManagementDao.createUser(username, password);

    await this.databaseManagementDao.grantUserAccessToDatabase(
      username,
      postgresDatabaseName,
    );

    await this.databaseManagementDao.revokeAccessFromPublic(
      postgresDatabaseName,
    );

    const postgresDatabaseId =
      await this.databaseManagementDao.getDatabasePGIDByName(
        postgresDatabaseName,
      );

    return {
      pg_id: postgresDatabaseId,
      password: password,
    };
  }

  private generatePassword(): string {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let password = '';
    for (let i = 0; i <= 12; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
  }
}
