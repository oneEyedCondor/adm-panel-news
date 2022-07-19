import { Test, TestingModule } from '@nestjs/testing';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

const createNewsDto: CreateNewsDto = {
  title: 'title',
  description: 'description',
  text: 'text',
  categories: [1, 2],
};

const updateNewsDto: UpdateNewsDto = {
  title: 'title',
  description: 'description',
};

describe('NewsController', () => {
  let newsController: NewsController;
  let newsService: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: {
            getAllNews: jest.fn().mockResolvedValue({
              message: 'Fetched',
              data: [
                {
                  id: 1,
                  title: 'title',
                  description: 'description',
                  text: 'text',
                },
              ],
              pagination: {
                offset: 0,
                limit: 1,
                count: 1,
              },
            }),
            createNews: jest
              .fn()
              .mockImplementation((newsData: CreateNewsDto) =>
                Promise.resolve({
                  message: 'Created',
                  data: {
                    id: 1,
                    ...newsData,
                  },
                }),
              ),
            getOneNews: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                message: 'Fetched',
                data: {
                  id,
                  title: 'title',
                  description: 'description',
                  text: 'text',
                },
              }),
            ),
            updateNews: jest
              .fn()
              .mockImplementation((id: number, newsData: UpdateNewsDto) =>
                Promise.resolve({
                  message: 'Updated',
                  data: {
                    id,
                    ...newsData,
                  },
                }),
              ),
            publishNews: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                message: 'Published',
                data: {
                  id,
                  title: 'title',
                  description: 'description',
                  text: 'text',
                  publicationDate: new Date(),
                },
              }),
            ),
            removeNews: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve({ message: 'Deleted' }),
              ),
            assignCategoryToNews: jest
              .fn()
              .mockImplementation((newsId: number, categoryId: number) =>
                Promise.resolve({
                  message: 'Assigned',
                  data: {
                    id: 1,
                    title: 'title',
                    description: 'description',
                    text: 'text',
                  },
                }),
              ),
          },
        },
      ],
    }).compile();

    newsController = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(newsController).toBeDefined();
  });

  describe('getAllNews()', () => {
    it('should find all news', () => {
      newsController.getAllNews();
      expect(newsService.getAllNews).toHaveBeenCalled();
    });
  });

  describe('createNews()', () => {
    it('should create a news', () => {
      expect(newsController.createNews(createNewsDto)).resolves.toEqual({
        message: 'Created',
        data: {
          id: 1,
          ...createNewsDto,
        },
      });
      expect(newsService.createNews).toHaveBeenCalled();
      expect(newsService.createNews).toHaveBeenCalledWith(createNewsDto);
    });
  });

  describe('getOneNews()', () => {
    it('should find the news', () => {
      newsController.getOneNews(1);
      expect(newsService.getOneNews).toHaveBeenCalled();
      expect(newsController.getOneNews(1)).resolves.toEqual({
        message: 'Fetched',
        data: {
          id: 1,
          title: 'title',
          description: 'description',
          text: 'text',
        },
      });
    });
  });

  describe('updateNews()', () => {
    it('should update the news', () => {
      expect(newsController.updateNews(1, updateNewsDto)).resolves.toEqual({
        message: 'Updated',
        data: {
          id: 1,
          ...updateNewsDto,
        },
      });
      expect(newsService.updateNews).toHaveBeenCalled();
      expect(newsService.updateNews).toHaveBeenCalledWith(1, updateNewsDto);
    });
  });

  describe('publishNews()', () => {
    it('should publish the news', () => {
      newsController.publishNews(1);
      expect(newsService.publishNews).toHaveBeenCalled();
      expect(newsController.publishNews(1)).resolves.toEqual({
        message: 'Published',
        data: {
          id: 1,
          title: 'title',
          description: 'description',
          text: 'text',
          publicationDate: new Date(),
        },
      });
    });
  });

  describe('removeNews()', () => {
    it('should remove the news', () => {
      expect(newsController.removeNews(1)).resolves.toEqual({
        message: 'Deleted',
      });
      expect(newsService.removeNews).toHaveBeenCalled();
    });
  });

  describe('assignCategoryToNews()', () => {
    it('should assign category to news', () => {
      expect(newsController.assignCategoryToNews(1, 1)).resolves.toEqual({
        message: 'Assigned',
        data: {
          id: 1,
          title: 'title',
          description: 'description',
          text: 'text',
        },
      });
      expect(newsService.assignCategoryToNews).toHaveBeenCalled();
      expect(newsService.assignCategoryToNews).toHaveBeenCalledWith(1, 1);
    });
  });
});
