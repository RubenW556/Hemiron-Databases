import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  Request,
  Res,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
// import { AuthenticationService } from 'hemiron-auth/dist/services/authentication.service';//todo enable auth when fixed

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  // constructor(private authenticationService: AuthenticationService) {}//todo enable auth when fixed

  // noinspection JSUnusedGlobalSymbols
  public async use(
    @Request() req: Request,
    @Res({ passthrough: true }) res: Response,
    next: NextFunction,
  ) {
    // try {//todo enable auth when fixed
    //   res.locals.userMakingRequest =
    //     await this.authenticationService.getUserFromRequest(req);
    // } catch (e) {
    //   res.status(HttpStatus.UNAUTHORIZED);
    // }
    next();
  }
}
