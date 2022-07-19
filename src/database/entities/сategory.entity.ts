import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';

import { News } from './news.entity';
import { NewsСategory } from './news_category.entity';

interface СategoryCreationAttrs {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

@Table
export class Сategory extends Model<Сategory, СategoryCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @BelongsToMany(() => News, () => NewsСategory)
  news: News[];
}
