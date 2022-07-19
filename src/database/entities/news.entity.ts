import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';

import { Сategory } from './сategory.entity';
import { NewsСategory } from './news_category.entity';

interface NewsCreationAttrs {
  id: number;
  title: string;
  description: string;
  text: string;
  publicationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

@Table
export class News extends Model<News, NewsCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.DATE })
  publicationDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @BelongsToMany(() => Сategory, () => NewsСategory)
  categories: Сategory[];
}
