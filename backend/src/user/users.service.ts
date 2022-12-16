import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, InsertResult, Repository} from 'typeorm';
import { User } from './user.entity';
import {dataCollectionDao} from "../dao/dataCollection.dao";
import {DatabaseManagementDao} from "../dao/databaseManagement.dao";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private dataCollectionDao: dataCollectionDao,
        private databaseManagementDao: DatabaseManagementDao
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
        let user:User = await this.usersRepository.findOneBy({ id:id });
        if((user== null)){
            throw new BadRequestException("can't find user by uuid")
        }

        return user;
    }

    /**
     * creates user
     * @param {string} id UUID of requested user as string
     */
    putOne(user: User): Promise<InsertResult>{
        return this.usersRepository.insert(user);
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

        if((await this.databaseManagementDao.lookUpUser(id))[0]==undefined){
            new BadRequestException("user does not exist")
        }
        let result = (await this.dataCollectionDao.getQueryCountByUser_Id(id))[0].sum;

        if(result===null){
            throw new BadRequestException("User has no queries")
        }
        return result;
    }
}