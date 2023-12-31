import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { UserOwnsDatabase } from './user-owns-database.entity';

@Injectable()
export class UserOwnsDatabaseService {
  constructor(
    @InjectRepository(UserOwnsDatabase)
    private userOwnsDatabaseRepository: Repository<UserOwnsDatabase>,
  ) {}

  public findOne(
    databaseId: string,
    userId: string,
  ): Promise<UserOwnsDatabase> {
    return this.userOwnsDatabaseRepository.findOneByOrFail({
      database_id: databaseId,
      user_id: userId,
    });
  }

  public insert(databaseId: string, userId: string): Promise<InsertResult> {
    const database: UserOwnsDatabase = {
      database_id: databaseId,
      user_id: userId,
    };
    return this.userOwnsDatabaseRepository.insert(database);
  }

  public async delete(
    databaseId: string,
    userId: string,
  ): Promise<DeleteResult> {
    return this.userOwnsDatabaseRepository.delete({
      database_id: databaseId,
      user_id: userId,
    });
  }
}
