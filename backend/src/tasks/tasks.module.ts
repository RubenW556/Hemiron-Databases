import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsModule } from '../metrics/metrics.module';
import { BillingIntegrationModule } from '../billing-integration/billing-integration.module';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MetricsModule,
    BillingIntegrationModule,
    UsersModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
