import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingIntegrationModule {}
