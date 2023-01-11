import { Injectable, Logger } from '@nestjs/common';
import {
  RedisService,
  DEFAULT_REDIS_NAMESPACE,
} from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CreateRedisService {
  private readonly redis: Redis;
  private logger = new Logger(CreateRedisService.name);
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
    //this.redis = this.redisService.clients.get(username)
    // this.redis1 = new Redis(6379, "redis");
  }

  public async set(key, value): Promise<string> {
    const currentDb = await this.getCurrentDb();
    const fullKey = currentDb + ':' + key;
    this.logger.log("inserting in key: " + key + " value: " + value)
    const response = await this.redis.set(fullKey, value);
    return response;
  }

  public async get(key): Promise<string> {
    const currentDb = await this.getCurrentDb();
    const fullKey = currentDb + ':' + key;
    const response = await this.redis.get(fullKey);
    return response;
  }

  public async delete(key): Promise<number> {
    const currentDb = await this.getCurrentDb();
    const fullKey = currentDb + ':' + key;
    const response = await this.redis.del(fullKey);
    return response;
  }

  public async getAllKeys(dbname?: string): Promise<string[]> {
    const searchTerm = await this.getValidSearchTerm(dbname);
    const response = await this.redis.keys(searchTerm);
    return response;
  }

  public async deleteAllKeys(dbname?: string) {
    const searchTerm = await this.getValidSearchTerm(dbname);
    let cursor = '0';
    do {
      const [newCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        searchTerm,
      );
      cursor = newCursor;
      if (keys.length > 0) {
        this.logger.log('deleting: ', ...keys);
        await this.redis.del(...keys);
      }
    } while (cursor !== '0');
    return 'OK';
  }

  public async login(dbname, password): Promise<string> {
    const response = this.redis.auth(dbname, password);
    //TODO: Monitor
    return response;
  }

  public async addPassword(dbname, password): Promise<string> {
    /*
     * This Functionality automatically creates a new db in case the db didn't exist yet.
     * Thus it functions both as AddPassword and as CreateDb to keep code DRY.
     */
    //let response1 = await this.redis.call('M.CUSTOMCMD', [])
    const rules = [
      'on',
      '>' + password,
      '+GET',
      '~' + dbname + '*',
      '+SET',
      '~' + dbname + '*',
      '+AUTH',
      '+ACL|WHOAMI',
      '+INFO',
      '+CLIENT|INFO',
      '+KEYS',
      '~' + dbname + '*',
      '+DEL',
      '~' + dbname + '*',
      '+SCAN',
    ];
    const response = this.redis.acl('SETUSER', dbname, ...rules);
    return response;
  }

  public async deletePassword(dbname, password): Promise<string> {
    const rules = [
      'on',
      '<' + password,
      '+GET',
      '~' + dbname + '*',
      '+SET',
      '~' + dbname + '*',
      '+AUTH',
      '+ACL|WHOAMI',
      '+INFO',
      '+CLIENT|INFO',
      '+KEYS',
      '~' + dbname + '*',
      '+DEL',
      '~' + dbname + '*',
      '+SCAN',
    ];
    const response = this.redis.acl('SETUSER', dbname, ...rules);
    return response;
  }

  public async getDb(dbname): Promise<string[]> {
    const response = await this.redis.acl('GETUSER', dbname);
    return response;
  }

  public async deleteDb(dbname): Promise<number> {
    await this.deleteAllKeys(dbname);
    const response = await this.redis.acl('DELUSER', dbname);
    return response;
  }

  public async getMemoryUsage(dbname?: string): Promise<number> {
    const searchTerm = await this.getValidSearchTerm(dbname);

    let cursor = '0';
    let totalMemoryUsage = 0;
    do {
      const [newCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        searchTerm,
      );
      cursor = newCursor;
      if (keys.length > 0) {
        for (const key of keys) {
          const memoryUsage = await this.redis.memory('USAGE', key);
          totalMemoryUsage += memoryUsage;
          this.logger.log(`'${key}', has a memory usage of: ${memoryUsage}`);
        }
      }
    } while (cursor !== '0');
    return totalMemoryUsage;
  }

  public async getAllDatabases(): Promise<string[]> {
    const response = await this.redis.acl('USERS');
    return response;
  }

  public async getCurrentDb(): Promise<string> {
    return this.redis.acl('WHOAMI');
  }

  public async getClientInfo(): Promise<string> {
    return this.redis.client('INFO');
  }

  public async getRedisInfo(): Promise<string> {
    return this.redis.info();
  }

  private async getValidSearchTerm(dbname?: string) {
    let searchTerm = '';

    const currentDb = await this.getCurrentDb();
    if (currentDb !== 'default') {
      searchTerm = currentDb;
    } else if (typeof dbname !== 'undefined') {
      searchTerm = dbname;
    }
    searchTerm += '*';
    this.logger.log(
      `[SearchTermValidifier]: dbname = ${
        typeof dbname === 'undefined' ? 'undefined' : dbname
      }, searchTerm = ${searchTerm}`,
    );

    return searchTerm;
  }
}
