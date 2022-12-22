import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsService } from '../metrics/metrics.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService, MetricsService],
})
export class TasksModule {}
