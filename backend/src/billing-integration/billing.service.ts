import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { PatchUserDatabaseMetricsDto } from './patchUserDatabaseMetrics.dto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly httpService: HttpService) {}

  async patchPostgresUserDataToBilling() {
    const payload: PatchUserDatabaseMetricsDto = {
      queries: 0,
      size: 0,
      userId: '',
    };
    return this.patchDataToBillingEndpoint(
      '/billingapi/databasedata/usage', //todo must be adjusted after billing provides us the endpoints
      payload,
    );
  }

  async patchRedisUserDataToBilling() {
    const payload: PatchUserDatabaseMetricsDto = {
      queries: 0,
      size: 0,
      userId: '',
    };
    return this.patchDataToBillingEndpoint(
      '/billingapi/databasedata/usage', //todo must be adjusted after billing provides us the endpoints
      payload,
    );
  }

  async patchDataToBillingEndpoint(payload, endpointURL) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch(endpointURL, payload, {
          timeout: 10000,
        })
        .pipe(
          catchError((error: any) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}
