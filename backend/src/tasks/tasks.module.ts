import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsService } from '../metrics/metrics.service';
import { BillingService } from '../metrics/billing.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [TasksService, MetricsService, BillingService],
})
export class TasksModule {}
