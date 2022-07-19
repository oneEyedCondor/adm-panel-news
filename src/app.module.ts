import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { NewsController } from './news/news.controller';
import { User } from './database/entities/user.entity';
import { Сategory } from './database/entities/сategory.entity';
import { News } from './database/entities/news.entity';
import { NewsСategory } from './database/entities/news_category.entity';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import { JwtAccessTokenMiddleware } from './auth/middlewares/jwt-access-token.middleware';
import { JwtRefreshTokensMiddleware } from './auth/middlewares/jwt-refresh-token.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Сategory, News, NewsСategory],
      logging: false,
    }),
    NewsModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(JwtAccessTokenMiddleware).forRoutes(NewsController);
    consumer
      .apply(JwtRefreshTokensMiddleware)
      .forRoutes({ path: 'auth/refresh', method: RequestMethod.POST });
  }
}
