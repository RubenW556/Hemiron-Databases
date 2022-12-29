import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MetricsService } from '../metrics/metrics.service';
import { BillingIntegrationService } from '../billing-integration/billing-integration.service';
import { PatchUserDatabaseMetricsDto } from '../billing-integration/patchUserDatabaseMetrics.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private metricsService: MetricsService,
    private billingService: BillingIntegrationService,
  ) {
    //test //todo move into cron
    this.initiateUserPostgresMetrics();
  }

  async initiateUserPostgresMetrics() {
    // const users = await this.usersService.findAll();
    const users = [{ id: '123456' }]; //todo change back to line above
    for (const user of users) {
      const uuid = user.id;
      let size;
      try {
        size = await this.metricsService.getCombinedPostgresMetricsOfUser(uuid);
      } catch (e) {
        continue;
      }
      this.logger.debug(size);
      const payload: PatchUserDatabaseMetricsDto = {
        size: size,
        userId: uuid,
      };

      this.billingService
        .patchPostgresUserDataToBilling(payload)
        .then((response) => {
          this.logger.debug(response);
        })
        .catch((error) => {
          this.logger.error(error);
        });
    }
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  handleCron() {
    this.logger.log('Initiating periodic metrics integration.');
  }
}
