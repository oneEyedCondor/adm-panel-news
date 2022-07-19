import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../database/entities/user.entity';

const userData: Partial<User> = {
  id: 1,
  email: 'email',
  password: 'password',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              accessToken: 'accessToken',
              refreshToken: 'refreshToken',
            }),
            refreshTokens: jest.fn().mockResolvedValue({
              accessToken: 'accessToken',
              refreshToken: 'refreshToken',
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login()', () => {
    it('should return tokens', () => {
      expect(authController.login(userData)).resolves.toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(authService.login).toHaveBeenCalled();
      expect(authService.login).toHaveBeenCalledWith(userData);
    });
  });

  describe('refreshTokens()', () => {
    it('should return new tokens', () => {
      expect(authController.refreshTokens(userData)).resolves.toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(authService.refreshTokens).toHaveBeenCalled();
    });
  });
});
