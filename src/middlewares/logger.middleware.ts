import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = {
      firstname: 'Mate',
      lastname: 'Knon',
      age: 25,
    };
    req.user = user;

    console.log(req.user);

    console.log('Request... Logged at GET method');
    next();
  }
}
