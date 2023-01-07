import { Injectable } from '@nestjs/common';
import { RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CreateRedisService {
    private readonly redis: Redis;


    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
        //this.redis = this.redisService.clients.get(username)
        // this.redis1 = new Redis(6379, "redis");
    }

    public async set(key, value): Promise<string> {
        let currentUser = await this.getCurrentUser()
        let fullKey = currentUser + ":" + key
        let response = await this.redis.set(fullKey, value)
        return response;
    }

    public async get(key): Promise<string> {
        let currentUser = await this.getCurrentUser()
        let fullKey = currentUser + ":" + key
        let response = await this.redis.get(fullKey)
        return response;
    }

    public async delete(key): Promise<number> {
        let currentUser = await this.getCurrentUser()
        let fullKey = currentUser + ":" + key
        let response = await this.redis.del(fullKey)
        return response;
    }

    public async getClientInfo(): Promise<string> {
        return this.redis.client('INFO');
    }

    public async getRedisInfo(): Promise<string> {
        return this.redis.info();
    }

    public async getCurrentUser(): Promise<string> {
        return this.redis.acl('WHOAMI');
    }

    public async getAllKeys(): Promise<string[]> {
        let currentUser = await this.getCurrentUser()

        let searchTerm = '';
        if(currentUser !== 'default'){
            searchTerm = currentUser + ":";
        }
        searchTerm+='*';
        let response = await this.redis.keys(searchTerm);
        return response;
    }

    public async deleteUser(username): Promise<number> {
        let response = await this.redis.acl('DELUSER',username);
        return response;
    }

    public async login(username, password): Promise<string> {
        let response = this.redis.auth(username, password);
        return response;
    }

    public async addPassword(username, password): Promise<string> {
        /*
        * This Functionality automatically creates a new user in case the user didn't exist yet.
        * Thus it functions both as AddPassword and as CreateUser to keep code DRY.
         */
        //let response1 = await this.redis.call('M.CUSTOMCMD', [])
        const rules = ['on', '>' + password, '+GET', '~' + username + '*', '+SET', '~' + username + '*',
            "+AUTH", "+ACL|WHOAMI", "+INFO", "+CLIENT|INFO", "+KEYS", "~" + username + "*", '+DEL', '~' + username + '*'];
        let response = this.redis.acl('SETUSER', username, ...rules);
        return response;
    }

    public async deletePassword(username, password): Promise<string> {
        const rules = ['on', '<' + password, '+GET', '~' + username + '*', '+SET', '~' + username + '*',
            "+AUTH", "+ACL|WHOAMI", "+INFO", "+CLIENT|INFO", "+KEYS", "~" + username + "*", '+DEL', '~' + username + '*'];
        let response = this.redis.acl('SETUSER', username, ...rules);
        return response;
    }

    public async getAllUsers(): Promise<string[]> {
        let response = await this.redis.acl('USERS');
        return response;
    }

    public async getUser(username): Promise<string[]> {
        let response = await this.redis.acl('GETUSER', username);
        return response;
    }



    //public async create(): Promise<void> {
    //    const dbs = await this.redis.config('GET', 'databases');
    //    const newDb = parseInt(dbs.databases, 10) + 1;
    //    await this.redis.config('SET', 'databases', newDb.toString());
    //}
//
    //public findOne(database_id: string): Promise<Database> {
    //    return this.databasesRepository.findOneByOrFail({ id: database_id });
    //}
//
    //public findAllForUser(userId: string): Promise<Database[]> {
    //    return this.databasesRepository.query(
    //        `
    //    SELECT database.* FROM docker.database
    //    INNER JOIN docker.user_owns_database
    //    ON database.id = user_owns_database.database_id AND user_owns_database.user_id = $1
    //        `,
    //        [userId],
    //    );
    //}
//
    //public async insert(databaseDto: CreateDatabaseDto): Promise<InsertResult> {
    //    const database: Database = {
    //        ...databaseDto,
    //        ...{ id: generateUUID(), creation_datetime: new Date() },
    //    };
    //    const result = this.databasesRepository.insert(database);
    //    await this.createDatabaseWithUser(databaseDto.name);
    //    return result;
    //}
//
    //public update(database: UpdateDatabaseDto): Promise<UpdateResult> {
    //    return this.databasesRepository.update({ id: database.id }, database);
    //}
//
    //public async delete(id: string): Promise<DeleteResult> {
    //    return this.databasesRepository.delete(id);
    //}
//
    ////database management context
    //public async createDatabaseWithUser(databaseName: string) {
    //    //todo create databasename based on username
    //    if (
    //        (await this.databaseManagementDao.lookUpDatabase(databaseName))[0] ==
    //        undefined
    //    ) {
    //        await this.databaseManagementDao.createDatabase(databaseName);
    //    }
    //    //todo get user from tokens
    //    //todo use password from request or generate password and return it to the requester
    //    if (
    //        (await this.databaseManagementDao.lookUpUser('test1'))[0] == undefined
    //    ) {
    //        await this.databaseManagementDao.createUser('test1', 'test1');
    //    }
    //    await this.databaseManagementDao.grantUserAccessToDatabase(
    //        'test1',
    //        databaseName,
    //    );
    //}


}
