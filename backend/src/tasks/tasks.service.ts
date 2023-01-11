import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MetricsService } from '../metrics/metrics.service';
import { BillingIntegrationService } from '../billing-integration/billing-integration.service';
import { PatchUserDatabaseMetricsDto } from '../billing-integration/patch-user-database-metrics.dto';
import { UsersService } from '../user/users.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private metricsService: MetricsService,
    private billingService: BillingIntegrationService,
    private usersService: UsersService,
  ) {}

  /**
   * Initiates process to integrate all postgres metrics to billing.
   */
  async initiateUserPostgresMetricsIntegration() {
    try {
      const users = await this.usersService.findAll();
      for (const user of users) {
        const uuid = user.id;
        let size;
        try {
          size = await this.metricsService.getCombinedPostgresMetricsOfUser(
            uuid,
          );
        } catch (e) {
          this.logger.debug(
            `Failed to get Postgres metrics for uuid ${uuid}... Skipping....`,
          );

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
            this.logger.log(
              `Successfully patched postgres usage for user ${uuid}`,
            );
            this.logger.debug(response);
          })
          .catch((error) => {
            this.logger.error(error);
          });
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
  async initiateUserRedisMetricsIntegration() {
    try {
      const users = await this.usersService.findAll();
      for (const user of users) {
        const uuid = user.id;
        let size;
        let queries;
        try {
          size = await this.metricsService.getCombinedRedisMetricsOfUser(uuid);
          queries = await this.metricsService.getCombinedRedisQueriesOfUser(
            uuid,
          );
        } catch (e) {
          this.logger.debug(
            `Failed to get Postgres metrics for uuid ${uuid}... Skipping....`,
          );
          continue;
        }
        this.logger.debug(size);
        const payload: PatchUserDatabaseMetricsDto = {
          size: size,
          queries: queries,
          userId: uuid,
        };

        this.billingService
          .patchRedisUserDataToBilling(payload)
          .then((response) => {
            this.logger.log(
              `Successfully patched redis usage for user ${uuid}`,
            );
            this.logger.debug(response);
          })
          .catch((error) => {
            this.logger.error(error);
          });
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * Initiates periodic metrics integration every 3 Hours.
   */
  @Cron(CronExpression.EVERY_3_HOURS)
  handleCron() {
    this.logger.log('Initiating periodic metrics integration.');
    this.initiateUserPostgresMetricsIntegration().then(() => {
      this.logger.log('Concluding periodic metrics integration for Postgres');
    });
    this.initiateUserRedisMetricsIntegration().then(() => {
      this.logger.log('Concluding periodic metrics integration for Redis');
    });
  }
}
