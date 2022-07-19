export class CreateNewsDto {
  title: string;
  description: string;
  text: string;
  publicationDate?: Date;
  categories?: Array<number>;
}
