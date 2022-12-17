import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class TasksService {
  constructor(private metricsService: MetricsService) {
    this.fetchAllDatabaseSizes().then((sizes) => {
      this.logger.debug(sizes);
    });
  }

  fetchAllDatabaseSizes() {
    return this.metricsService.getAllDatabaseSizes();
  }

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.debug('Called every 30 seconds');

  }
}
