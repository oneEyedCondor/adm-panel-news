import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {
  ResponseOnGetAllNewsDto,
  ResponseOnCreateNewsDto,
  ResponseOnGetNewsDto,
  ResponseOnUpdateNewsDto,
  ResponseOnDeleteNewsDto,
  ResponseOnPublishNewsDto,
  ResponseOnAssignCategoryDto,
} from './dto/response.dto';
import { QueryStringLimitOffsetSortDto } from '../shared/dto/query-string-limit-offset-sort.dto';
import { News } from '../database/entities/news.entity';
import { Сategory } from '../database/entities/сategory.entity';
import { NewsСategory } from '../database/entities/news_category.entity';
import { handleNotFoundException } from '../shared/utils/handle-not-found-exception';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News)
    private readonly newsModel: typeof News,
    @InjectModel(Сategory)
    private readonly categoryModel: typeof Сategory,
    @InjectModel(NewsСategory)
    private readonly newsСategory: typeof NewsСategory,
    private readonly sequelizeInstance: Sequelize,
  ) {}

  async getAllNews(
    query: QueryStringLimitOffsetSortDto,
  ): Promise<ResponseOnGetAllNewsDto> {
    const { limit = 100, offset = 0, sortOrder = 'ASC' } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'date') {
      sortBy = 'createdAt';
    }

    const { rows: news, count } = await this.newsModel.findAndCountAll({
      where: { deletedAt: null },
      attributes: {
        exclude: ['deletedAt'],
      },
      offset: +offset,
      limit: +limit,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: Сategory,
          as: 'categories',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
      ],
    });

    return {
      message: `Fetched. offset:${offset}, limit:${limit}`,
      data: news || [],
      pagination: {
        offset: +offset,
        limit: +limit,
        count,
      },
    };
  }

  async createNews(
    createNewsDto: CreateNewsDto,
  ): Promise<ResponseOnCreateNewsDto> {
    const transaction: Transaction = await this.sequelizeInstance.transaction();

    try {
      const news = await this.newsModel.create(
        {
          title: createNewsDto.title,
          description: createNewsDto.description,
          text: createNewsDto.text,
          publicationDate: createNewsDto.publicationDate,
        },
        { transaction },
      );

      if (createNewsDto.categories) {
        await Promise.all(
          createNewsDto.categories.map(
            async (categoryId) =>
              await this.newsСategory.create(
                { newsId: news.id, categoryId },
                { transaction },
              ),
          ),
        );
      }

      await transaction.commit();

      return {
        message: `Created`,
        data: news,
      };
    } catch (error) {
      await transaction.rollback();

      throw new HttpException(
        {
          isError: true,
          message: error.message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async getOneNews(id: number): Promise<ResponseOnGetNewsDto> {
    const news = await this.newsModel.findOne({
      where: { id, deletedAt: null },
      attributes: {
        exclude: ['deletedAt'],
      },
      include: [
        {
          model: Сategory,
          as: 'categories',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
      ],
    });

    handleNotFoundException(news, 'News');

    return {
      message: 'Fetched',
      data: news,
    };
  }

  async updateNews(
    id: number,
    updateNewsDto: UpdateNewsDto,
  ): Promise<ResponseOnUpdateNewsDto> {
    const transaction: Transaction = await this.sequelizeInstance.transaction();

    try {
      const news = await this.newsModel.findByPk(id, { transaction });
      handleNotFoundException(news, 'News');

      if (updateNewsDto.title) news.title = updateNewsDto.title;
      if (updateNewsDto.description)
        news.description = updateNewsDto.description;
      if (updateNewsDto.text) news.text = updateNewsDto.text;
      if (updateNewsDto.publicationDate)
        news.publicationDate = updateNewsDto.publicationDate;

      await news.save({ transaction });

      if (updateNewsDto.categories) {
        await this.newsСategory.destroy({
          where: { newsId: news.id },
          transaction,
        });

        await Promise.all(
          updateNewsDto.categories.map(
            async (categoryId) =>
              await this.newsСategory.create(
                { newsId: news.id, categoryId },
                { transaction },
              ),
          ),
        );
      }

      await transaction.commit();

      return {
        message: `Updated`,
        data: news,
      };
    } catch (error) {
      await transaction.rollback();

      throw new HttpException(
        {
          isError: true,
          message: error.message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async publishNews(id: number): Promise<ResponseOnPublishNewsDto> {
    const news = await this.newsModel.findByPk(id);
    handleNotFoundException(news, 'News');

    news.publicationDate = new Date();
    await news.save();

    return {
      message: 'Published',
      data: news,
    };
  }

  async removeNews(id: number): Promise<ResponseOnDeleteNewsDto> {
    const news = await this.newsModel.findByPk(id);
    handleNotFoundException(news, 'News');

    news.deletedAt = new Date();
    await news.save();

    return {
      message: 'Deleted',
    };
  }

  async assignCategoryToNews(
    newsId: number,
    categoryId: number,
  ): Promise<ResponseOnAssignCategoryDto> {
    const news = await this.newsModel.findByPk(newsId);
    handleNotFoundException(news, 'News');

    const category = await this.categoryModel.findByPk(categoryId);
    handleNotFoundException(category, 'Category');

    await this.newsСategory.create({ newsId, categoryId });

    return {
      message: 'Assigned',
      data: news,
    };
  }
}
