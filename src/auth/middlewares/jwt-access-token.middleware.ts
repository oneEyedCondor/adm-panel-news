import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      jwt.verify(
        accessToken,
        this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      );
      next();
    } catch (error) {
      throw new HttpException(
        {
          isError: true,
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
