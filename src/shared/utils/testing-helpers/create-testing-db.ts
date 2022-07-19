import { ModelCtor, Sequelize } from 'sequelize-typescript';

export const createTestingDB = async (
  models: ModelCtor[],
): Promise<Sequelize> => {
  const db = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:', //path.join('database_test.sqlite')
    logging: false,
  });

  db.addModels(models);
  await db.sync();

  return db;
};
