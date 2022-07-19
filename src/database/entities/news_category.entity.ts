import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

import { News } from './news.entity';
import { Сategory } from './сategory.entity';

interface NewsСategoryCreationAttrs {
  newsId: number;
  categoryId: number;
}

@Table({ timestamps: false })
export class NewsСategory extends Model<
  NewsСategory,
  NewsСategoryCreationAttrs
> {
  @ForeignKey(() => News)
  @Column({ type: DataType.INTEGER })
  newsId: number;

  @ForeignKey(() => Сategory)
  @Column({ type: DataType.INTEGER })
  categoryId: number;
}
