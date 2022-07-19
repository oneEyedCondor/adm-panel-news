'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NewsСategories', {
      newsId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'News',
          key: 'id',
          as: 'news_id',
        },
      },
      categoryId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Сategories',
          key: 'id',
          as: 'category_id',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NewsСategories');
  },
};
