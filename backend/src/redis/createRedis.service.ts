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
    const currentUser = await this.getCurrentUser();
    const fullKey = currentUser + ':' + key;
    const response = await this.redis.set(fullKey, value);
    return response;
  }

  public async get(key): Promise<string> {
    const currentUser = await this.getCurrentUser();
    const fullKey = currentUser + ':' + key;
    const response = await this.redis.get(fullKey);
    return response;
  }

  public async delete(key): Promise<number> {
    const currentUser = await this.getCurrentUser();
    const fullKey = currentUser + ':' + key;
    const response = await this.redis.del(fullKey);
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
    const currentUser = await this.getCurrentUser();

    let searchTerm = '';
    if (currentUser !== 'default') {
      searchTerm = currentUser + ':';
    }
    searchTerm += '*';
    const response = await this.redis.keys(searchTerm);
    return response;
  }

  public async deleteUser(username): Promise<number> {
    const response = await this.redis.acl('DELUSER', username);
    return response;
  }

  public async login(username, password): Promise<string> {
    const response = this.redis.auth(username, password);
    return response;
  }

  public async addPassword(username, password): Promise<string> {
    /*
     * This Functionality automatically creates a new user in case the user didn't exist yet.
     * Thus it functions both as AddPassword and as CreateUser to keep code DRY.
     */
    //let response1 = await this.redis.call('M.CUSTOMCMD', [])
    const rules = [
      'on',
      '>' + password,
      '+GET',
      '~' + username + '*',
      '+SET',
      '~' + username + '*',
      '+AUTH',
      '+ACL|WHOAMI',
      '+INFO',
      '+CLIENT|INFO',
      '+KEYS',
      '~' + username + '*',
      '+DEL',
      '~' + username + '*',
    ];
    const response = this.redis.acl('SETUSER', username, ...rules);
    return response;
  }

  public async deletePassword(username, password): Promise<string> {
    const rules = [
      'on',
      '<' + password,
      '+GET',
      '~' + username + '*',
      '+SET',
      '~' + username + '*',
      '+AUTH',
      '+ACL|WHOAMI',
      '+INFO',
      '+CLIENT|INFO',
      '+KEYS',
      '~' + username + '*',
      '+DEL',
      '~' + username + '*',
    ];
    const response = this.redis.acl('SETUSER', username, ...rules);
    return response;
  }

  public async getAllUsers(): Promise<string[]> {
    const response = await this.redis.acl('USERS');
    return response;
  }

  public async getUser(username): Promise<string[]> {
    const response = await this.redis.acl('GETUSER', username);
    return response;
  }
}
