import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Database } from './database.entity';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { v4 as generateUUID } from 'uuid';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { DatabaseManagementService } from '../metaDatabaseManagement/databaseManagement.Service';
import {UsersService} from "../user/users.service";
import {ReturnDatabase} from "./dto/database-create-return.dto";

@Injectable()
export class DatabasesService {
  constructor(
    @InjectRepository(Database)
    private databasesRepository: Repository<Database>,
    private databaseManagementDao: DatabaseManagementService,
    private UsersService: UsersService
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

  public async insert(databaseDto: CreateDatabaseDto, userMakingRequest: string): Promise<ReturnDatabase> {
    const database: Database = {
      ...databaseDto,
      ...{ id: generateUUID(), creation_date_time: new Date() },
    };
    const result = await this.databasesRepository.insert(database);
    return await this.createDatabaseWithUser(databaseDto.name, userMakingRequest);

  }

  public update(database: UpdateDatabaseDto): Promise<UpdateResult> {
    return this.databasesRepository.update({ id: database.id }, database);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return this.databasesRepository.delete(id);
  }

  //database management context
  public async createDatabaseWithUser(databaseName: string, userMakingRequest: string): Promise<ReturnDatabase>  {
    if (
      (await this.databaseManagementDao.lookUpDatabase(databaseName)) ==
      undefined
    ) {
      databaseName = userMakingRequest+"."+databaseName
      await this.databaseManagementDao.createDatabase(databaseName)
    }

    const password = Math.random().toString(36).slice(-8);
    const username = userMakingRequest+"."+databaseName

    await this.databaseManagementDao.createUser(username, password);



    await this.databaseManagementDao.grantUserAccessToDatabase(
        username,
        databaseName,
    );


    await this.databaseManagementDao.grantUserAccessToDatabase(
        username,
      databaseName,
    );

    return {id:userMakingRequest,username:username,password:password,databaseName:databaseName}
  }
}
