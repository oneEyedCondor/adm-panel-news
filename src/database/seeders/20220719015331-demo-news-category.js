'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('NewsСategories', [
      {
        newsId: 1,
        categoryId: 1,
      },
      {
        newsId: 2,
        categoryId: 3,
      },
      {
        newsId: 3,
        categoryId: 3,
      },
      {
        newsId: 4,
        categoryId: 2,
      },
      {
        newsId: 5,
        categoryId: 1,
      },
      {
        newsId: 6,
        categoryId: 4,
      },
      {
        newsId: 7,
        categoryId: 2,
      },
      {
        newsId: 8,
        categoryId: 4,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('NewsСategories', null, {});
  },
};
