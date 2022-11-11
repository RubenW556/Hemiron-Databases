import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('databases')
export class DatabasesController {

    @Get(':id')
    public getOne() {
        return {};
    }

    @Get()
    public getAll() {
        return [{}];
    }

    @Post()
    public create() {
        return {};
    }

    @Patch()
    public update() {
        return {};
    }

    @Delete()
    public delete() {
        return;
    }

}
