import { Injectable } from '@nestjs/common';
import {
  RedisService,
  DEFAULT_REDIS_NAMESPACE,
} from '@liaoliaots/nestjs-redis';
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
    const currentDb = await this.getCurrentDb();
    const fullKey = currentDb + ':' + key;
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

  public async getAllKeys(dbname?:string): Promise<string[]> {
    const currentDb = await this.getCurrentDb();

    let searchTerm = '';
    if (currentDb !== 'default') {
      searchTerm = currentDb + ':';
    }
    else if (typeof dbname !== 'undefined'){
      searchTerm = dbname + ':';
    }
    searchTerm += '*';
    console.log("searchterm: " + searchTerm)
    const response = await this.redis.keys(searchTerm);
    return response;
  }

  public async deleteAllKeys(dbname?:string) {
    let searchTerm = '';
    console.log("deleting..");

    const currentDb = await this.getCurrentDb();
    if (currentDb !== 'default') {
      searchTerm = currentDb;
    }
    else if (typeof dbname !== 'undefined'){
      searchTerm = dbname;
    }
    searchTerm+='*';
    let cursor = '0';
    console.log("searchTerm: " + searchTerm);
    do {
      const [newCursor, keys] = await this.redis.scan(cursor, 'MATCH', searchTerm);
      cursor = newCursor;
      if (keys.length > 0) {
        console.log("deleting: " , ...keys)
        await this.redis.del(...keys);
      }
    } while (cursor !== '0');
    return 'OK';
  }

  public async login(dbname, password): Promise<string> {
    const response = this.redis.auth(dbname, password);
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

}
