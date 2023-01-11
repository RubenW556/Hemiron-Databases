import { Injectable, NestMiddleware, Request, Res } from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class MockAuthMiddleware implements NestMiddleware {
  // noinspection JSUnusedGlobalSymbols
  public async use(
    @Request() req: Request,
    @Res({ passthrough: true }) res: Response,
    next: NextFunction,
  ) {
    res.locals.userMakingRequest = {
      id: 'c30a6cdd-02db-472f-8e69-80d57b67b3da',
    };
    next();
  }
}
