import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Res} from '@nestjs/common';
import {CreateRedisService} from "./createRedis.service";


@Controller('redis')
@Controller()
export class RedisController {
    constructor(
        private redisService: CreateRedisService,
    ) {}

    @Get('setkey/:key/:value')
    async setKey(@Param('key') key: string, @Param('value') value: string): Promise<string> {
        return this.redisService.set(key, value);
    }

    @Get('getkey/:key')
    async getValue(@Param('key') key: string): Promise<string> {
        return this.redisService.get(key);
    }

    @Get('deletekey/:key')
    async deleteKey(@Param('key') key: string): Promise<string> {
        let result = await this.redisService.delete(key);
        if (result === 1) {
            return "OK";
        } else if (result === 0) {
            return "Key doesn't exist";
        }
        else return result.toString();
    }

    @Get('client')
    async getInfo(): Promise<string> {
        return this.redisService.getClientInfo();
    }

    @Get('info')
    async getRedisInfo(): Promise<string> {
        return this.redisService.getRedisInfo();
    }

    @Get('currentuser')
    async getCurrentUser(): Promise<string> {
        return this.redisService.getCurrentUser();
    }

    @Get('getallkeys')
    async getAllKeys(): Promise<string[]> {
        return this.redisService.getAllKeys();
    }

    @Get('login/:username/:password')
    async login(@Param('username') username: string, @Param('password') password: string): Promise<string> {
        return this.redisService.login(username, password);
    }

    @Get('addpassword/:username/:password')
    async addPassword(@Param('username') username: string, @Param('password') password: string): Promise<string> {
        return this.redisService.addPassword(username, password);
    }

    @Get('deletepassword/:username/:password')
    async delPassword(@Param('username') username: string, @Param('password') password: string): Promise<string> {
        return await this.redisService.deletePassword(username, password);
    }

    @Get('deleteuser/:username')
    async createUserName(@Param('username') username: string): Promise<string> {
        let result = await this.redisService.deleteUser(username);
        if (result === 1) {
            return "OK";
        } else if (result === 0) {
            return "User doesn't exist";
        }
        return result.toString();
    }

    @Get('createuser/:username/:password')
    async createUser(@Param('username') username: string, @Param('password') password: string): Promise<string> {
        let response = await this.redisService.getAllUsers();
        if (response.includes(username)){
            return "Username already in use, please pick another username"
        }
        return this.redisService.addPassword(username, password);
    }

    @Get('allusers')
    async getAllUsers(): Promise<string[]> {
        return this.redisService.getAllUsers();
    }

    @Get('user/:username')
    async getUser(@Param('username') username: string): Promise<string[]> {
        let response = await this.redisService.getUser(username);
        if (response == null){
            return ["User doesn't exist"];
        }
        return this.redisService.getUser(username);
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
