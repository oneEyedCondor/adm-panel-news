import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import * as redis from 'redis';

import { User } from '../database/entities/user.entity';
import { handleNotFoundException } from '../shared/utils/handle-not-found-exception';

export type accessAndRefreshTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  private async createSession(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const redisClient = redis.createClient({
      url: `redis://${this.configService.get(
        'REDIS_HOST',
      )}:${this.configService.get('REDIS_PORT')}`,
    });
    await redisClient.connect();
    await redisClient.hSet(`sessions:session_${userId}`, 'userId', userId);
    await redisClient.hSet(
      `sessions:session_${userId}`,
      'refreshToken',
      refreshToken,
    );
    await redisClient.quit();
  }

  private async generateTokens(
    user: Partial<User>,
  ): Promise<accessAndRefreshTokens> {
    const payload = { id: user.id };
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
    const refreshToken = jwt.sign(
      payload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );

    await this.createSession(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(userData: Partial<User>): Promise<accessAndRefreshTokens> {
    const user = await this.userModel.findOne({
      where: { email: userData.email },
    });
    handleNotFoundException(user, 'User');

    const isValid = await compare(userData.password, user.password);

    if (!isValid) {
      throw new HttpException(
        {
          isError: true,
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.generateTokens(user);
  }

  // async register(): Promise<void> {} // Admin panel

  async refreshTokens(
    userData: Partial<User>,
  ): Promise<accessAndRefreshTokens> {
    return this.generateTokens(userData);
  }
}
