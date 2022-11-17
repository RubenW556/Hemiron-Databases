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

    returnHello(): string{
        return "hello";
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id });
    }

    putOne(user: User): Promise<InsertResult>{
        return this.usersRepository.insert(user);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}