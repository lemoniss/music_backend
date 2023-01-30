import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {

    const headerAuthToken = req.header('auth_token');

    if (typeof headerAuthToken == 'undefined') {
      throw new UnauthorizedException();
    } else {
      next();
    }
  }
}
