import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DatabaseManagementDao {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  //User
  async createUser(userName: string, password: string) {
    try {
      await this.dataSource.query(
        `CREATE USER ${userName} WITH PASSWORD '${password}'`,
      );
      await this.dataSource.query(`GRANT ${userName} TO admin`);
    } catch (e) {
      throw new BadRequestException('SQL execution failed');
    }
  }

  async lookUpUser(userName: string) {
    try {
      return await this.dataSource.query(
        `SELECT 1 FROM pg_user WHERE usename='${userName}'`,
      );
    } catch (e) {
      throw new BadRequestException('SQL execution failed');
    }
  }

  //databases
  async createDatabase(databaseName: string) {
    try {
      await this.dataSource.query(
        `CREATE DATABASE ${databaseName}
          `,
      );
    } catch (e) {
      throw new BadRequestException('SQL execution failed');
    }
  }

  async lookUpDatabase(databaseName: string) {
    try {
      return await this.dataSource.query(
        `SELECT FROM pg_database WHERE datname = '${databaseName}'`,
      );
    } catch (e) {
      throw new BadRequestException('SQL execution failed');
    }
  }

  //privileges
  async grantUserAccessToDatabase(userName: string, databaseName: string) {
    try {
      return await this.dataSource.query(
        `ALTER DATABASE ${databaseName} OWNER TO ${userName}`,
      );
    } catch (e) {
      throw new BadRequestException('SQL execution failed');
    }
  }
}
