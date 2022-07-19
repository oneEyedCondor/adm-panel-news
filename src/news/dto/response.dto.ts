import { News } from '../../database/entities/news.entity';
import { PaginationDto } from '../../shared/dto/pagination.dto';

class ResponseMessage {
  readonly message: string;
}

type newsOrPartialNews = News | Partial<News>;

export class ResponseOnGetNewsDto extends ResponseMessage {
  readonly data: newsOrPartialNews;
}

export class ResponseOnCreateNewsDto extends ResponseOnGetNewsDto {}

export class ResponseOnUpdateNewsDto extends ResponseOnGetNewsDto {}

export class ResponseOnPublishNewsDto extends ResponseOnGetNewsDto {}

export class ResponseOnAssignCategoryDto extends ResponseOnGetNewsDto {}

export class ResponseOnDeleteNewsDto extends ResponseMessage {}

export class ResponseOnGetAllNewsDto extends ResponseMessage {
  readonly data: Array<newsOrPartialNews>;
  readonly pagination: PaginationDto;
}
