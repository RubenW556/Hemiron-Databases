import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Res} from '@nestjs/common';
import {CreateRedisService} from "./createRedis.service";


@Controller('redis')
@Controller()
export class RedisController {
    constructor(
        private redisService: CreateRedisService,
    ) {}

    @Get('test1/:key')
    async setAndGetValue(@Param('key') key: string): Promise<string> {
        const value = 'hell-o-worl';
        return this.redisService.test1(key, value);
    }

    @Get('test2')
    async getInfo(): Promise<string> {
        return this.redisService.test2();
    }

    @Get('test3')
    async getInfo2(): Promise<string> {
        return this.redisService.test3();
    }

    @Get('test4')
    async getInfo3(): Promise<string> {
        return this.redisService.test4();
    }

    //@Get(':username')
    //@HttpCode(HttpStatus.OK)
    //public async delete(
    //    @Res({ passthrough: true }) res: Response,
    //    @Param('username') username: string,
    //): Promise<string> {
    //try {
    //    // select the database corresponding to the user
    //    await this.redisService.select(hash(username));
//
    //    // get the value of the 'data' key from the selected database
    //    const data = await this.redisService.get('data');
    //    return data;
    //}
    //catch (e) {
    //    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    //    }
    //}
//
//
    //@Post()
    //@HttpCode(HttpStatus.CREATED)
    //async create(): Promise<void> {
    //    const dbs = await this.redis.config('GET', 'databases');
    //    const newDb = parseInt(dbs.databases, 10) + 1;
    //    await this.redis.config('SET', 'databases', newDb.toString());
    //}
//
    //@Post()
    //@HttpCode(HttpStatus.CREATED) //todo validatioon
    //public async create(
    //    @Res({ passthrough: true }) res: Response,
    //    @Body() createDatabaseDto: CreateDatabaseDto,
    //): Promise<Database> {
    //    try {
    //        const userMakingRequest = res.locals.userMakingRequest;
//
    //        await this.usersService.findOne(userMakingRequest.id);
//
    //        const insertResult = await this.databasesService.insert(
    //            createDatabaseDto,
    //        );
    //        const newDatabaseId = insertResult.identifiers[0].id;
//
    //        await this.userOwnsDatabaseService.insert(
    //            newDatabaseId,
    //            userMakingRequest.id,
    //        );
    //        return await this.databasesService.findOne(newDatabaseId);
    //    } catch (e) {
    //        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    //    }
    //}
}
