'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Сategories', [
      {
        title: 'Science & Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Sport',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Politics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Economy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Сategories', null, {});
  },
};
