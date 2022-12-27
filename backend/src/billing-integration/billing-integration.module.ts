import { Module } from '@nestjs/common';
import { BillingIntegrationService } from './billing-integration.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [BillingIntegrationService],
  exports: [BillingIntegrationService],
})
export class BillingIntegrationModule {}
