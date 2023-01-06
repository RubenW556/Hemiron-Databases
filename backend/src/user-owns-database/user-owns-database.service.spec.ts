import { Test, TestingModule } from '@nestjs/testing';
import { UserOwnsDatabaseService } from './user-owns-database.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserOwnsDatabase } from './user-owns-database.entity';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.entity';
import {HttpStatus} from "@nestjs/common";
import {Response} from "express";
import {Database} from "../databases/database.entity";
import {UserOwnsDatabaseDto} from "./dto/user-owns-database.dto";
import {UserOwnsDatabaseController} from "./user-owns-database.controller";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

describe('UserOwnsDatabaseService', () => {
    let service: UserOwnsDatabaseService;
    const mockUserOwnsDatabaseDto = {database_id: '77807154-2c3a-44e0-94a9-409805cf9a2f', user_id: '448098df-b9dd-4ec2-af9f-b23459b203a1'} as UserOwnsDatabaseDto;
    const mockUsersService = {};
    const UserDatabase = {};
    const validDatabaseUuid = '28fe3613-b0f2-4d88-9934-d53586384f96';

    const mockUserOwnsDatabaseRepository = {
        findOneByOrFail: jest.fn(async function (databaseId, UserId): Promise<void>{
            console.log("userid2:" + mockUserOwnsDatabaseDto.user_id);
            if(UserId !== mockUserOwnsDatabaseDto.user_id) throw new Error();
            return;
        }),
        insert: jest.fn(async function (databaseId, UserId): Promise<void>{
            console.log("userid2:");
            console.log(UserId);
            if(UserId !== mockUserOwnsDatabaseDto.user_id) throw new Error();
            return;
        }),
        delete: jest.fn(async function (databaseId, UserId): Promise<void>{
            console.log("userid2:");
            console.log(UserId);
            if(UserId !== mockUserOwnsDatabaseDto.user_id) throw new Error();
            return;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserOwnsDatabaseService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide:  getRepositoryToken(UserOwnsDatabase),
                    useValue: mockUserOwnsDatabaseRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: UserDatabase,
                },
            ],
        }).compile();

        service = module.get<UserOwnsDatabaseService>(
            UserOwnsDatabaseService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {

        it('should call UserOwnsDatabaseRepository.findOneByOrFail', async () => {
            const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'findOneByOrFail');
            console.log("userid:")
            console.log(mockUserOwnsDatabaseDto.user_id)
            await service.findOne(mockUserOwnsDatabaseDto.database_id, mockUserOwnsDatabaseDto.user_id);

            expect(spy).toHaveBeenCalledWith(mockUserOwnsDatabaseDto.database_id, mockUserOwnsDatabaseDto.user_id);
        });

    });

    describe('insert', () => {

        it('should call UserOwnsDatabaseRepository and insert database object', async () => {
            const database: UserOwnsDatabase = {
                database_id: mockUserOwnsDatabaseDto.database_id,
                user_id: mockUserOwnsDatabaseDto.user_id,
            };
            const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'insert');

            await service.insert(mockUserOwnsDatabaseDto.database_id, mockUserOwnsDatabaseDto.user_id);

            expect(spy).toHaveBeenCalledWith(database);
        });

    });

    describe('delete', () => {

        it('should call UserOwnsDatabaseRepository with database_id and user_id', async () => {
            const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'delete');

            await service.insert(mockUserOwnsDatabaseDto.database_id, mockUserOwnsDatabaseDto.user_id);

            expect(spy).toHaveBeenCalledWith({database_id: mockUserOwnsDatabaseDto.database_id, user_id: mockUserOwnsDatabaseDto.user_id});
        });

    });

});
