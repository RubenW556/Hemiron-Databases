import { Injectable } from '@nestjs/common';
import { RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CreateRedisService {
    private readonly redis: Redis;

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient();
        // or
        // this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
    }

    async set() {
        return await this.redis.set('key', 'value', 'EX', 10);
    }

    public async test1(key, value): Promise<string> { //TODO: This code can be removed before deployment
        await this.redis.set(key, value)
        return this.redis.get(key);
    }

    public async test2(): Promise<string> { //TODO: This code can be removed before deployment
        return this.redis.client('INFO');
    }

    public async test3(): Promise<string> { //TODO: This code can be removed before deployment
        return this.redis.info();
    }

    public async test4(): Promise<string> { //TODO: This code can be removed before deployment
        return this.redis.client.toString();
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
