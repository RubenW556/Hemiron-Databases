import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { CreateUserOwnsDatabaseDto } from "./dto/create-user-owns-database.dto";
import { Response } from 'express';
import { UserOwnsDatabaseService } from "./user-owns-database.service";
import { DeleteUserOwnsDatabaseDto } from "./dto/delete-user-owns-database.dto";

@Controller('user-owns-database')
export class UserOwnsDatabaseController {

    constructor(private userOwnsDatabaseService: UserOwnsDatabaseService) {
    }

    @Get(':databaseId')
    @HttpCode(HttpStatus.OK)
    public async getOne(@Res({ passthrough: true }) res: Response, @Param('databaseId') databaseId: string): Promise<void> {
        try {
            const userId = 'f0daf321-ff96-4ff7-9822-7f848473ac45'; // @TODO get user_id from login token
            await this.userOwnsDatabaseService.findOne(databaseId, userId);
            return;
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Res({ passthrough: true }) res: Response, @Body() createUserOwnsDatabase: CreateUserOwnsDatabaseDto): Promise<void> {
        try {
            const userId = 'f0daf321-ff96-4ff7-9822-7f848473ac45'; // @TODO get user_id from login token

            await this.userOwnsDatabaseService.findOne(createUserOwnsDatabase.database_id, userId);
            await this.userOwnsDatabaseService.insert(createUserOwnsDatabase.database_id, createUserOwnsDatabase.user_id);
            return;
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Res({ passthrough: true }) res: Response, @Body() deleteUserOwnsDatabaseDto: DeleteUserOwnsDatabaseDto): Promise<void> {
        try {
            const userId = 'f0daf321-ff96-4ff7-9822-7f848473ac45'; // @TODO get user_id from login token

            await this.userOwnsDatabaseService.findOne(deleteUserOwnsDatabaseDto.database_id, userId);
            await this.userOwnsDatabaseService.delete(deleteUserOwnsDatabaseDto.database_id, deleteUserOwnsDatabaseDto.user_id);
            return;
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
