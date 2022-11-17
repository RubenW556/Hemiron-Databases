import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { createDatabaseDto } from "./dto/create-database.dto";
import { DatabaseDto } from "./dto/database.dto";
import { updateDatabaseDto } from "./dto/update-database.dto";

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
    public getOne(@Param() id: string): DatabaseDto {
        return temporaryObject;
    }

    @Get()
    public getAll(): DatabaseDto[] {
        return [temporaryObject, temporaryObject, temporaryObject];
    }

    @Post()
    public create(@Body() database: createDatabaseDto): DatabaseDto {
        return temporaryObject;
    }

    @Patch()
    public update(@Body() database: updateDatabaseDto): DatabaseDto {
        return temporaryObject;
    }

    @Delete(':id')
    public delete(@Param() id: string): void {
        return;
    }

}
