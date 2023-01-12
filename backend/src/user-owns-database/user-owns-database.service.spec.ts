import { Test, TestingModule } from '@nestjs/testing';
import { UserOwnsDatabaseService } from './user-owns-database.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserOwnsDatabase } from './user-owns-database.entity';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.entity';
import { UserOwnsDatabaseDto } from './dto/user-owns-database.dto';

describe('UserOwnsDatabaseService', () => {
  let service: UserOwnsDatabaseService;
  const mockUserOwnsDatabaseDto = {
    database_id: '77807154-2c3a-44e0-94a9-409805cf9a2f',
    user_id: '448098df-b9dd-4ec2-af9f-b23459b203a1',
  } as UserOwnsDatabaseDto;
  const mockUsersService = {};
  const UserDatabase = {};

  const mockUserOwnsDatabaseRepository = {
    findOneByOrFail: jest.fn(async function (): Promise<void> {
      return;
    }),
    insert: jest.fn(async function (): Promise<void> {
      return;
    }),
    delete: jest.fn(async function (): Promise<void> {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOwnsDatabaseService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(UserOwnsDatabase),
          useValue: mockUserOwnsDatabaseRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: UserDatabase,
        },
      ],
    }).compile();

    service = module.get<UserOwnsDatabaseService>(UserOwnsDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should call UserOwnsDatabaseRepository.findOneByOrFail', async () => {
      const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'findOneByOrFail');
      await service.findOne(
        mockUserOwnsDatabaseDto.database_id,
        mockUserOwnsDatabaseDto.user_id,
      );

      expect(spy).toHaveBeenCalledWith(mockUserOwnsDatabaseDto);
    });
  });


  describe('insert', () => {
    it('should call UserOwnsDatabaseRepository and insert database object', async () => {
      const database: UserOwnsDatabase = {
        database_id: mockUserOwnsDatabaseDto.database_id,
        user_id: mockUserOwnsDatabaseDto.user_id,
      };
      const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'insert');

      await service.insert(
        mockUserOwnsDatabaseDto.database_id,
        mockUserOwnsDatabaseDto.user_id,
      );

      expect(spy).toHaveBeenCalledWith(database);
    });
  });

  describe('delete', () => {
    it('should call UserOwnsDatabaseRepository.delete() with database_id and user_id', async () => {
      const spy = jest.spyOn(mockUserOwnsDatabaseRepository, 'delete');

      await service.delete(
        mockUserOwnsDatabaseDto.database_id,
        mockUserOwnsDatabaseDto.user_id,
      );

      expect(spy).toHaveBeenCalledWith({
        database_id: mockUserOwnsDatabaseDto.database_id,
        user_id: mockUserOwnsDatabaseDto.user_id,
      });
    });
  });
});
