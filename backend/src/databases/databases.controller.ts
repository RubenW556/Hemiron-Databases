import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { createDatabaseDto } from "./dto/create-database.dto";
import { DatabaseDto } from "./dto/database.dto";
import { updateDatabaseDto } from "./dto/update-database.dto";
import { Response } from 'express';

const temporaryObject: DatabaseDto = {
    id: 'eb7a7202-028d-4b6a-b293-f8600a0a2592',
    name: 'mock database',
    type: 'sql',
    size: 7311,
    creation_date: 1668691480,
};

@Controller('databases')
export class DatabasesController {

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public getOne(@Res({ passthrough: true }) res: Response, @Param() id: string): DatabaseDto {
        // @TODO Return internal server error when not found.
        // res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        return temporaryObject;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public getAll(@Res({ passthrough: true }) res: Response,): DatabaseDto[] {
        return [temporaryObject, temporaryObject, temporaryObject];
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public create(@Res({ passthrough: true }) res: Response, @Body() database: createDatabaseDto): DatabaseDto {
        // @TODO Return internal server error when object cant be created
        return temporaryObject;
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    public update(@Res({ passthrough: true }) res: Response, @Body() database: updateDatabaseDto): DatabaseDto {
        // @TODO Return internal server error when object cant be updated
        return temporaryObject;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public delete(@Res({ passthrough: true }) res: Response, @Param() id: string): void {
        // @TODO Return internal server error when object cant be deleted
        return;
    }

}
