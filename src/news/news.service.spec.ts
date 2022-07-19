import { Sequelize } from 'sequelize-typescript';

import { NewsService } from '../news/news.service';
import { createTestingDB } from '../shared/utils/testing-helpers/create-testing-db';
import { initTestingDB } from '../shared/utils/testing-helpers/init-testing-db';
import { News } from '../database/entities/news.entity';
import { Сategory } from '../database/entities/сategory.entity';
import { NewsСategory } from '../database/entities/news_category.entity';

describe('NewsService', () => {
  let db: Sequelize;
  let newsService: NewsService;

  beforeAll(async () => {
    db = await createTestingDB([News, Сategory, NewsСategory]);
    newsService = new NewsService(News, Сategory, NewsСategory, db);
  });

  afterAll(async () => await db.close());

  beforeEach(async () => {
    await initTestingDB();
  });

  afterEach(async () => {
    await db.truncate();
  });

  it('should be defined', () => {
    expect(newsService).toBeDefined();
  });

  describe('getAllNews()', () => {
    it('should find list news', async () => {
      const offset = 1;
      const limit = 2;

      const result = await newsService.getAllNews({
        limit,
        offset,
      });
      const { message, data, pagination } = result;

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        message: expect.any(String),
        data: expect.any(Array),
        pagination: expect.any(Object),
      });
      expect(message).toEqual(`Fetched. offset:${offset}, limit:${limit}`);
      expect(pagination).toMatchObject({
        limit,
        offset,
        count: expect.any(Number),
      });
      expect(data.length).toEqual(limit);
      expect(data[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        text: expect.any(String),
        publicationDate: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      if (data[0].categories) {
        expect(data[0].categories[0]).toMatchObject({
          id: expect.any(Number),
          title: expect.any(String),
        });
      }
    });
  });

  describe('createNews()', () => {
    it('should create a news', async () => {
      const result = await newsService.createNews({
        title: 'title-test',
        description: 'description-test',
        text: 'text-test',
      });

      const { message, data } = result;

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        message: expect.any(String),
        data: expect.any(Object),
      });

      expect(message).toEqual(`Created`);

      expect(data).toBeInstanceOf(News);
      expect(data.title).toEqual('title-test');
      expect(data.description).toEqual('description-test');
      expect(data.text).toEqual('text-test');
      expect(data.publicationDate).toBeUndefined();
      expect(data.deletedAt).toBeUndefined();
    });

    it('should create a news and assign category', async () => {
      const ctg1 = await Сategory.create({
        title: 'title-test1',
      });
      const ctg2 = await Сategory.create({
        title: 'title-test2',
      });

      const result = await newsService.createNews({
        title: 'title-test',
        description: 'description-test',
        text: 'text-test',
        publicationDate: new Date(),
        categories: [ctg1.id, ctg2.id],
      });

      expect(result).not.toBeNull();

      expect(result.data).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        text: expect.any(String),
        publicationDate: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('getOneNews()', () => {
    it('should find the news', async () => {
      const news = await newsService.getAllNews({ limit: 5, offset: 0 });

      const result = await newsService.getOneNews(news.data[0].id);
      const { message, data } = result;

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        message: expect.any(String),
        data: expect.any(Object),
      });

      expect(message).toEqual(`Fetched`);

      expect(data).toBeInstanceOf(News);
      expect(result.data).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        text: expect.any(String),
      });
      expect(result.data.categories[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
      });
    });
  });

  describe('updateNews()', () => {
    it('should update the news', async () => {
      const news = await newsService.getAllNews({ limit: 5, offset: 0 });

      let result = await newsService.updateNews(news.data[0].id, {
        title: 'new title',
        description: 'new description',
      });
      const { message, data } = result;

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        message: expect.any(String),
        data: expect.any(Object),
      });

      expect(message).toEqual(`Updated`);

      expect(data.title).toEqual('new title');
      expect(data.description).toEqual('new description');
      expect(data.text).not.toEqual('new text');

      const publicationDate = new Date();
      result = await newsService.updateNews(news.data[0].id, {
        text: 'new text',
        publicationDate,
      });

      expect(result.data.text).toEqual('new text');
      expect(result.data.publicationDate).toEqual(publicationDate);
    });

    it('should update the category news', async () => {
      const news = await newsService.getAllNews({ limit: 5, offset: 1 });
      const category = await Сategory.create({ title: 'Hobby' });

      const result = await newsService.updateNews(news.data[0].id, {
        title: 'Hobby: News 1',
        categories: [category.id],
      });
      const { message, data } = result;

      expect(result).not.toBeNull();
      expect(message).toEqual(`Updated`);
      expect(data.title).toEqual('Hobby: News 1');

      const updatedNews = await newsService.getOneNews(news.data[0].id);
      expect(updatedNews.data.categories[0]).toMatchObject({
        id: category.id,
        title: category.title,
      });
    });
  });

  describe('publishNews()', () => {
    it('should publish the news', async () => {
      const news = await newsService.getAllNews({ limit: 5, offset: 0 });

      const result = await newsService.publishNews(news.data[0].id);
      const { message, data } = result;

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        message: expect.any(String),
        data: expect.any(Object),
      });

      expect(message).toEqual('Published');
      expect(data.publicationDate).toBeDefined();
    });
  });

  describe('removeNews()', () => {
    it('should remove the news', async () => {
      const news = await newsService.getAllNews({ limit: 5, offset: 0 });

      const result = await newsService.removeNews(news.data[0].id);
      const { message } = result;

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        message: expect.any(String),
      });
      expect(message).toEqual('Deleted');
    });
  });

  describe('assignCategoryToNews()', () => {
    it('should assign category to news', async () => {
      const news = await newsService.getAllNews({ limit: 100, offset: 0 });
      const category1 = await Сategory.create({ title: 'c1' });
      const category2 = await Сategory.create({ title: 'c2' });

      await newsService.assignCategoryToNews(news.data[0].id, category1.id);
      let result = await newsService.assignCategoryToNews(
        news.data[0].id,
        category2.id,
      );

      expect(result).not.toBeNull();
      expect(result.message).toEqual(`Assigned`);

      result = await newsService.getOneNews(news.data[0].id);
      const { data } = result;

      expect(data.categories).toBeDefined();
      expect(data.categories[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
      });
      const categories = data.categories
        .map((category) => category.title)
        .join(' ');

      expect(categories).toContain(category1.title);
      expect(categories).toContain(category2.title);
    });
  });
});
