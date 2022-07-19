import { News } from '../../../database/entities/news.entity';
import { Сategory } from '../../../database/entities/сategory.entity';
import { NewsСategory } from '../../../database/entities/news_category.entity';

export const initTestingDB = async (): Promise<void> => {
  const news = [
    {
      title: 'News 1. Science & Technology',
      description: 'Lorem ipsum dolor sit amet',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'News 1. Sport',
      description: 'Lorem ipsum dolor sit amet',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      publicationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'News 2. Science & Technology',
      description: 'Lorem ipsum dolor sit amet',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'News 2. Sport',
      description: 'Lorem ipsum dolor sit amet',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      publicationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const categories = [
    {
      title: 'Sport',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Science & Technology',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const createdNews = await Promise.all(
    news.map(async (news) => await News.create(news)),
  );

  const createdСategories = await Promise.all(
    categories.map(async (category) => await Сategory.create(category)),
  );

  const newsIds = createdNews.map((n) => n.toJSON().id);
  const categoriesIds = createdСategories.map((c) => c.toJSON().id);

  await Promise.all(
    newsIds.map(
      async (newsId) =>
        await NewsСategory.create({
          newsId,
          categoryId: categoriesIds[newsId % 2],
        }),
    ),
  );
};
