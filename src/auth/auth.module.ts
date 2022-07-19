import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
