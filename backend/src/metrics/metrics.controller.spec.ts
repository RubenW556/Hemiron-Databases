import { Test } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('MetricsController', () => {
  let metricsController: MetricsController;

  const userUUIDMock = 'b45fc742-be1c-4c22-957c-3dd352743074';
  const databaseOIDMock = 5;
  const sizeMock = 333333;
  const querycountMock = 0;
  const statusResponseMock = {
    send: jest.fn((x) => x),
  };
  const requestMock = {} as unknown as Request;
  const responseMock = {
    status: jest.fn(() => statusResponseMock),
    send: jest.fn((x) => x),
    resBody: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
    })
      .useMocker((token) => {
        if (token === MetricsService) {
          return {
            getCombinedPostgresSizeMetricsOfUser: jest
              .fn()
              .mockResolvedValue(sizeMock),
            getCombinedPostgresQueryCountOfUser: jest
              .fn()
              .mockResolvedValue(querycountMock),
            getAllPostgresDatabaseSizesOfSingleUser: jest
              .fn()
              .mockResolvedValue(sizeMock),
            getDatabaseSize: jest.fn().mockResolvedValue(sizeMock),
          };
        }
      })
      .compile();

    metricsController = moduleRef.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(metricsController).toBeDefined();
  });

  describe('getAllPostgresSizeMetricsOfUser', () => {
    it('should return 200 with valid uuid', async () => {
      await metricsController.getAllPostgresDatabaseMetricsOfUser(
        requestMock,
        responseMock,
        userUUIDMock,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
    it('should return correct response with valid uuid', async () => {
      await metricsController.getAllPostgresDatabaseMetricsOfUser(
        requestMock,
        responseMock,
        userUUIDMock,
      );
      expect(statusResponseMock.send).toHaveBeenCalledWith({
        sizeUsage: sizeMock,
        queryCount: 0,
      });
    });
    it('should return 400 with invalid user uuid', async () => {
      await metricsController.getAllPostgresDatabaseMetricsOfUser(
        requestMock,
        responseMock,
        null,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });
  describe('getSizeOfSingleDatabase', () => {
    it('should return 200 with valid oid', async () => {
      await metricsController.getSizeOfSinglePostgresDatabase(
        requestMock,
        responseMock,
        databaseOIDMock,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
    it('should return 400 with invalid oid', async () => {
      await metricsController.getSizeOfSinglePostgresDatabase(
        requestMock,
        responseMock,
        null,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
    it('should return correct size with valid oid', async () => {
      await metricsController.getSizeOfSinglePostgresDatabase(
        requestMock,
        responseMock,
        databaseOIDMock,
      );
      expect(statusResponseMock.send).toHaveBeenCalledWith({
        size: sizeMock,
      });
    });
  });
});
