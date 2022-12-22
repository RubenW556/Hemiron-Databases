import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private metricsService: MetricsService) {
    this.fetchAllDatabaseSizes().then((sizes) => {
      this.logger.debug(sizes);
    });
    this.fetchQueries().then((sizes) => {
      this.logger.debug(sizes);
    });
  }

  fetchAllDatabaseSizes() {
    return this.metricsService.getAllDatabaseSizes();
  }

  fetchQueries(){
    return this.metricsService.getQueryCountByUser_Id("f0daf321-ff96-4ff7-9822-7f848473ac45");
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }
}
