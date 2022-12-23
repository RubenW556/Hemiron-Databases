import { Controller, Get, Param } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('test')
  getHello(): string {
    return this.metricsService.getHello();
  }

  @Get('databases/postgres/users')
  getAllDatabaseMetrics(): any {
    return this.metricsService.getAllDatabaseSizesOfAllUsers();
  }

  @Get('databases/postgres/users/:id')
  getAllDatabaseMetricsOfUser(@Param('id') id: string): any {
    return this.metricsService.getAllPostgresDatabaseSizesOfSingleUser(id);
  }
}
