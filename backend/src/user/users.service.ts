import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, InsertResult, Repository} from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    /**
     * Gets all users and returns them as a array
     */
    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    /**
     * Gets user by id
     * @param {string} user_id UUID of requested user as string
     */
    async findOne(user_id: string): Promise<User> {
        let user:User = await this.usersRepository.findOneBy({ user_id });
        if((user== null)){
            throw new BadRequestException("can't find user by uuid")
        }

        return user;
    }

    /**
     * creates user
     * @param {string} user_id UUID of requested user as string
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
}