import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
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
     * @param {string} user_id UUID of requisted user as string
     */

    findOne(user_id: string): Promise<User> {
        return this.usersRepository.findOneBy({ user_id });
    }

    /**
     * creates user
     * @param {string} user_id UUID of requisted user as string
     */

    putOne(user: User): Promise<InsertResult>{
        return this.usersRepository.insert(user);
    }

    /**
     * deletes user
     * @param {string} user_id UUID of to be deleted user as string
     */
    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}