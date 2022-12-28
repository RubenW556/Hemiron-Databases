import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { PatchUserDatabaseMetricsDto } from './patchUserDatabaseMetrics.dto';

@Injectable()
export class BillingIntegrationService {
  private readonly logger = new Logger(BillingIntegrationService.name);
  constructor(private readonly httpService: HttpService) {}

  /**
   * Send user PostgresSQL metrics to billing api endpoint
   * @param {PatchUserDatabaseMetricsDto} payload
   */
  async patchPostgresUserDataToBilling(payload: PatchUserDatabaseMetricsDto) {
    const endpointURL = process.env.METRICS_ENDPOINT_POSTGRES;

    return this.patchDataToBillingEndpoint(payload, endpointURL);
  }

  /**
   * Send user Redis metrics to billing api endpoint
   * @param {PatchUserDatabaseMetricsDto} payload   */
  async patchRedisUserDataToBilling(payload: PatchUserDatabaseMetricsDto) {
    const endpointURL = process.env.METRICS_ENDPOINT_REDIS;

    return this.patchDataToBillingEndpoint(payload, endpointURL);
  }

  async patchDataToBillingEndpoint(payload, endpointURL) {
    const { data } = await firstValueFrom(
      this.httpService.patch(endpointURL, payload).pipe(
        catchError((error: AxiosError) => {
          throw new Error(error.message);
        }),
      ),
    );
    return data;
  }
}
