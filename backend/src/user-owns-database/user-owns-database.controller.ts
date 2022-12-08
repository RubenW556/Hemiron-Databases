import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { CreateUserOwnsDatabaseDto } from "./dto/create-user-owns-database.dto";
import { Response } from 'express';
import { UserOwnsDatabaseService } from "./user-owns-database.service";

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
    public async create(@Res({ passthrough: true }) res: Response, @Body() createDatabaseDto: CreateUserOwnsDatabaseDto): Promise<void> {
        try {
            const userId = 'f0daf321-ff96-4ff7-9822-7f848473ac45'; // @TODO get user_id from login token
            await this.userOwnsDatabaseService.insert(createDatabaseDto, userId);
            return;
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':databaseId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Res({ passthrough: true }) res: Response, @Param('databaseId') databaseId: string): Promise<void> {
        try {
            const userId = 'f0daf321-ff96-4ff7-9822-7f848473ac45'; // @TODO get user_id from login token
            await this.userOwnsDatabaseService.delete(databaseId, userId);
            return;
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
