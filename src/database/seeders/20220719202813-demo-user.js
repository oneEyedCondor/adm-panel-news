'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'James',
        email: 'james@example.com',
        password: 'p4ssw0rd',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'John',
        email: 'john@example.com',
        password:
          '$2b$04$TxZs5XeIrVksBlsTH7Sz9uw7o5y/tuIvUje1yLoYuotIskVMZIFXG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Robert',
        email: 'robert@example.com',
        password: 'p4ssw0rd_dy2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'William',
        email: 'william@example.com',
        password: 'p4ssw0rdABC',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Paul',
        email: 'paul@example.com',
        password: 'p4ssw0rd932',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
