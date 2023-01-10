import { Test } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { ModuleMocker } from 'jest-mock';
import { DataSource } from 'typeorm';

describe('MetricsService', () => {
  const userUUIDMock = 'b45fc742-be1c-4c22-957c-3dd352743074';
  const databaseOIDMock = 16463;
  const sizeMock = '3333';
  const queryMock = [
    {
      db_name: 'test',
      db_size: '3333',
    },
    {
      db_name: 'test2',
      db_size: '3333',
    },
  ];
  const queryMockEmpty = [];

  let metricsService: MetricsService;
  let dataSource: DataSource;

  new ModuleMocker(global);
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: DataSource,
          useValue: {
            query: jest
              .fn()
              .mockResolvedValue(queryMock)
              .mockResolvedValueOnce(queryMock)
              .mockResolvedValueOnce(queryMockEmpty)
              .mockResolvedValueOnce(queryMock)
              .mockResolvedValueOnce(queryMockEmpty)
              .mockResolvedValueOnce(queryMock)
              .mockResolvedValueOnce(queryMock)
              .mockResolvedValueOnce(queryMockEmpty)
              .mockResolvedValueOnce(queryMockEmpty)
              .mockResolvedValueOnce(queryMockEmpty),
          },
        },
      ],
    }).compile();
    metricsService = moduleRef.get<MetricsService>(MetricsService);
    dataSource = moduleRef.get(DataSource);
  });

  it('metricsService should be defined', () => {
    expect(metricsService).toBeDefined();
  });
  it('dataSource should be defined', () => {
    expect(dataSource).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(metricsService.getHello()).toBe('Hello world');
    });
  });
  describe('getDatabaseSize', () => {
    it('should return db size string on existing db"', async () => {
      expect(await metricsService.getDatabaseSize(databaseOIDMock)).toEqual(
        sizeMock,
      );
    });
    it('should return 0 string on non-existing db"', async () => {
      expect(await metricsService.getDatabaseSize(databaseOIDMock)).toEqual(
        '0',
      );
    });
  });
  describe('getAllPostgresDatabaseSizesOfSingleUser', () => {
    it('should return db size string on existing db and user"', async () => {
      expect(
        await metricsService.getAllPostgresDatabaseSizesOfSingleUser(
          userUUIDMock,
        ),
      ).toEqual(queryMock);
    });
    it('should return null on non-existing db of user"', async () => {
      expect(
        await metricsService.getAllPostgresDatabaseSizesOfSingleUser(
          userUUIDMock,
        ),
      ).toEqual([]);
    });
  });
  describe('getCombinedPostgresMetricsOfUser', () => {
    it('should return db size number on existing db and user"', async () => {
      expect(
        await metricsService.getCombinedPostgresSizeMetricsOfUser(userUUIDMock),
      ).toEqual(6666);
    });
    it('should return db size as number on existing db and user"', async () => {
      expect(
        typeof (await metricsService.getCombinedPostgresSizeMetricsOfUser(
          userUUIDMock,
        )),
      ).toBe('number');
    });
    it('should throw error when no data is found', async () => {
      try {
        await metricsService.getCombinedPostgresSizeMetricsOfUser(userUUIDMock);
      } catch (e) {
        expect(e.message).toBe('No data found');
      }
    });
  });
});
