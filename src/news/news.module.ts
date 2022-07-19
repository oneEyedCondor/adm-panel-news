import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News } from '../database/entities/news.entity';
import { Сategory } from '../database/entities/сategory.entity';
import { NewsСategory } from '../database/entities/news_category.entity';

@Module({
  imports: [SequelizeModule.forFeature([News, Сategory, NewsСategory])],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
