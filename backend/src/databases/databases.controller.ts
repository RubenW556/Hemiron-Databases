import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { CreateDatabaseDto } from "./dto/create-database.dto";
import { UpdateDatabaseDto } from "./dto/update-database.dto";
import { Response } from 'express';
import { Database } from "./database.entity";
import { DatabasesService } from "./databases.service";

@Controller('databases')
export class DatabasesController {

    constructor(private databasesService: DatabasesService) {
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOne(@Res({ passthrough: true }) res: Response, @Param('id') id: string): Promise<Database> {
        try {
            return await this.databasesService.findOne(id);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAll(@Res({ passthrough: true }) res: Response): Promise<Database[]> {
        try {
            const userId = ''; // @TODO get email from login token
            return await this.databasesService.findAllForUser(userId);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Res({ passthrough: true }) res: Response, @Body() createDatabaseDto: CreateDatabaseDto): Promise<Database> {
        try {
            const insertResult = await this.databasesService.insert(createDatabaseDto);
            return await this.databasesService.findOne(insertResult.identifiers[0].id);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    public async update(@Res({ passthrough: true }) res: Response, @Body() database: UpdateDatabaseDto): Promise<Database> {
        try {
            await this.databasesService.update(database);
            return await this.databasesService.findOne(database.id);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Res({ passthrough: true }) res: Response, @Param('id') id: string): Promise<void> {
        try {
            await this.databasesService.delete(id);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
