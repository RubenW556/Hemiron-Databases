import { Module } from '@nestjs/common';
import { BillingIntegrationService } from './billing-integration.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [BillingIntegrationService],
  exports: [BillingIntegrationService],
})
export class BillingIntegrationModule {}
