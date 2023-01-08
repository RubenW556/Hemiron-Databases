import { Test } from '@nestjs/testing';
import { ModuleMocker } from 'jest-mock';
import { BillingIntegrationService } from './billing-integration.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { PatchUserDatabaseMetricsDto } from './patch-user-database-metrics.dto';
import { of } from 'rxjs';

describe('BillingIntegrationService', () => {
  const endpointMock = '3333';
  const payloadMock: PatchUserDatabaseMetricsDto = {
    userId: 'string',
    size: 7777,
  };
  let billingIntegrationService: BillingIntegrationService;

  new ModuleMocker(global);
  beforeAll(async () => {
    const data = ['test'];

    const response: AxiosResponse<any> = {
      data,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };

    const responseError500: AxiosResponse<any> = {
      data,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 500,
      statusText: 'NOT-OK',
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        BillingIntegrationService,
        HttpService,
        {
          provide: HttpService,
          useValue: {
            patch: jest
              .fn()
              .mockImplementationOnce(() => of(response))
              .mockImplementationOnce(() => of(responseError500))
              .mockImplementationOnce(() =>
                of(
                  jest.fn(() => {
                    throw new Error('MockError');
                  }),
                ),
              ),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();
    billingIntegrationService = moduleRef.get<BillingIntegrationService>(
      BillingIntegrationService,
    );
  });

  it('billingIntegrationService should be defined', () => {
    expect(billingIntegrationService).toBeDefined();
  });
  describe('patchDataToBillingEndpoint', () => {
    it('should return status 200 and data object on patch request"', async () => {
      const data = ['test'];

      expect(
        await billingIntegrationService.patchDataToBillingEndpoint(
          payloadMock,
          endpointMock,
        ),
      ).toEqual({ data: data, status: 200 });
    });
    it('should return status 500 on patch request failure"', async () => {
      const data = ['test'];

      expect(
        await billingIntegrationService.patchDataToBillingEndpoint(
          payloadMock,
          endpointMock,
        ),
      ).toEqual({ data: data, status: 500 });
    });
    it('should return no data on URL not found without error"', async () => {
      expect(
        await billingIntegrationService.patchDataToBillingEndpoint(
          payloadMock,
          endpointMock,
        ),
      ).toEqual({ data: undefined, status: undefined });
    });
  });
});
