import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as redis from 'redis';

@Injectable()
export class JwtRefreshTokensMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) throw new Error('Refresh token must be provided');

      jwt.verify(
        refreshToken,
        this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      );

      const { id: userId } = jwt.decode(refreshToken, { json: true });

      const redisClient = redis.createClient({
        url: `redis://${this.configService.get(
          'REDIS_HOST',
        )}:${this.configService.get('REDIS_PORT')}`,
      });
      await redisClient.connect();
      const savedRefreshToken = await redisClient.hGet(
        `sessions:session_${userId}`,
        'refreshToken',
      );
      await redisClient.quit();

      if (savedRefreshToken !== refreshToken) throw new Error('Invalid token');

      req.user = { id: userId };

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
