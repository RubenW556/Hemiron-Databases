import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Request, Response } from 'express';

@Controller('metrics')
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);

  constructor(private metricsService: MetricsService) {}

  @Get('databases/postgres/users/:id')
  async getAllPostgresDatabaseMetricsOfUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    if (!id) {
      const responseMessage = `No valid id provided.`;
      this.logger.debug(responseMessage);
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: responseMessage });
    }
    const size =
      await this.metricsService.getAllPostgresDatabaseSizesOfSingleUser(id);
    response.status(HttpStatus.OK).send({ sizeUsage: size });
  }

  @Get('databases/postgres/databases/:id')
  async getSizeOfSinglePostgresDatabase(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number,
  ): Promise<any> {
    if (!id) {
      const responseMessage = `No valid id provided.`;
      this.logger.debug(responseMessage);
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: responseMessage });
    }
    const size = await this.metricsService.getDatabaseSize(id);
    response.status(HttpStatus.OK).send({ size: size });
  }
}
