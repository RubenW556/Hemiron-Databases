import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly httpService: HttpService) {}

  async patchUserDataToBilling() {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          'https://cdn.growthbook.io/api/features/prod_uwFgG5dMUNykqTBLKOEfVNekbUvX1hFNFkP0WPba0lg',
        )
        .pipe(
          catchError((error: any) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}
