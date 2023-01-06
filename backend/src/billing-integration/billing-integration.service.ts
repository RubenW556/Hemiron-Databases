import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { PatchUserDatabaseMetricsDto } from './patch-user-database-metrics.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BillingIntegrationService {
  private readonly logger = new Logger(BillingIntegrationService.name);
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Send user PostgresSQL metrics to billing api endpoint
   * @param {PatchUserDatabaseMetricsDto} payload
   */
  async patchPostgresUserDataToBilling(payload: PatchUserDatabaseMetricsDto) {
    const endpointURL = this.configService.get('METRICS_ENDPOINT_POSTGRES');

    return this.patchDataToBillingEndpoint(payload, endpointURL);
  }

  /**
   * Send user Redis metrics to billing api endpoint
   * @param {PatchUserDatabaseMetricsDto} payload   */
  async patchRedisUserDataToBilling(payload: PatchUserDatabaseMetricsDto) {
    const endpointURL = this.configService.get('METRICS_ENDPOINT_REDIS');

    return this.patchDataToBillingEndpoint(payload, endpointURL);
  }

  /**
   * Send payload to given URL endpoint
   * @param {PatchUserDatabaseMetricsDto} payload
   * @param endpointURL
   */
  async patchDataToBillingEndpoint(payload, endpointURL) {
    const { status, data } = await firstValueFrom(
      this.httpService.patch(endpointURL, payload).pipe(
        catchError((error: AxiosError) => {
          throw new Error(error.message);
        }),
      ),
    );
    this.logger.log(`Successfully patched data to billing.`);
    return { status, data };
  }
}
