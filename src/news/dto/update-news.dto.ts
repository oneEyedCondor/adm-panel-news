export class UpdateNewsDto {
  title?: string;
  description?: string;
  text?: string;
  publicationDate?: Date;
  categories?: Array<number>;
}
