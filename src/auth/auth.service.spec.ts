import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { createTestingDB } from '../shared/utils/testing-helpers/create-testing-db';
import { User } from '../database/entities/user.entity';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let db: Sequelize;
  let authService: AuthService;
  let service: AuthService;
  let config;

  beforeAll(async () => {
    db = await createTestingDB([User]);
  });

  afterAll(async () => await db.close());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            destroy: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_ACCESS_TOKEN_SECRET':
                  return process.env.JWT_ACCESS_TOKEN_SECRET;
                case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
                  return process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
                case 'JWT_REFRESH_TOKEN_SECRET':
                  return process.env.JWT_REFRESH_TOKEN_SECRET;
                case 'JWT_REFRESH_TOKEN_EXPIRATION_TIME':
                  return process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;
                case 'REDIS_HOST':
                  return process.env.REDIS_HOST;
                case 'REDIS_PORT':
                  return process.env.REDIS_PORT;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    config = module.get<ConfigService>(ConfigService);
    authService = new AuthService(config, User);
  });

  afterEach(async () => {
    await db.truncate();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login()', () => {
    it('should return tokens', async () => {
      const createdUser = await User.create({
        name: 'user',
        email: 'user_email@wxample.com',
        password: await hash('p4ssw0rd', 10),
      });

      const tokens = await authService.login({
        email: 'user_email@wxample.com',
        password: 'p4ssw0rd',
      });
      expect(tokens).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
      expect(jwt.decode(tokens.accessToken, { json: true }).id).toEqual(
        createdUser.id,
      );
      expect(jwt.decode(tokens.refreshToken, { json: true }).id).toEqual(
        createdUser.id,
      );
    });
  });

  describe('refreshTokens()', () => {
    it('should return new tokens', async () => {
      const userId = 1;
      const tokens = await authService.refreshTokens({
        id: userId,
      });
      expect(tokens).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
      expect(jwt.decode(tokens.accessToken, { json: true }).id).toEqual(userId);
      expect(jwt.decode(tokens.refreshToken, { json: true }).id).toEqual(
        userId,
      );
    });
  });
});
