import { Test } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { ModuleMocker } from 'jest-mock';

describe('MetricsController', () => {
  let metricsController: MetricsController;
  let metricsService: MetricsService;
  new ModuleMocker(global);
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
    })
      .useMocker(() => {
        const results = 333333;
        return { findAll: jest.fn().mockResolvedValue(results) };
      })
      .compile();

    metricsService = moduleRef.get<MetricsService>(MetricsService);
    metricsController = moduleRef.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(metricsController).toBeDefined();
  });
});
