import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MetricsService } from '../metrics/metrics.service';
import { BillingService } from '../metrics/billing.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private metricsService: MetricsService,
    private billingService: BillingService,
  ) {
    this.fetchAllDatabaseSizes().then((sizes) => {
      this.logger.debug(sizes);
    });

    this.billingService.patchUserDataToBilling().then((bill) => {
      this.logger.debug(bill);
    });
  }

  fetchAllDatabaseSizes() {
    return this.metricsService.getAllDatabaseSizesOfUser('123456');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }
}
