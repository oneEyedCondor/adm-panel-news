import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {
  ResponseOnGetAllNewsDto,
  ResponseOnCreateNewsDto,
  ResponseOnGetNewsDto,
  ResponseOnUpdateNewsDto,
  ResponseOnDeleteNewsDto,
  ResponseOnPublishNewsDto,
  ResponseOnAssignCategoryDto,
} from './dto/response.dto';
import { QueryStringLimitOffsetSortDto } from '../shared/dto/query-string-limit-offset-sort.dto';
import { ErrorsInterceptor } from '../shared/interceptors/errors.interceptor';

@Controller('news')
@UseInterceptors(ErrorsInterceptor)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getAllNews(
    @Query() query?: QueryStringLimitOffsetSortDto,
  ): Promise<ResponseOnGetAllNewsDto> {
    return this.newsService.getAllNews(query);
  }

  @Post()
  createNews(
    @Body() createUserDto: CreateNewsDto,
  ): Promise<ResponseOnCreateNewsDto> {
    return this.newsService.createNews(createUserDto);
  }

  @Get(':id')
  getOneNews(@Param('id') id: number): Promise<ResponseOnGetNewsDto> {
    return this.newsService.getOneNews(id);
  }

  @Put(':id')
  updateNews(
    @Param('id') id: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<ResponseOnUpdateNewsDto> {
    return this.newsService.updateNews(id, updateNewsDto);
  }

  @Patch(':id')
  publishNews(@Param('id') id: number): Promise<ResponseOnPublishNewsDto> {
    return this.newsService.publishNews(id);
  }

  @Delete(':id')
  removeNews(@Param('id') id: number): Promise<ResponseOnDeleteNewsDto> {
    return this.newsService.removeNews(id);
  }

  @Get(':id/assign-category/:categoryId')
  assignCategoryToNews(
    @Param('id') newsId: number,
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseOnAssignCategoryDto> {
    return this.newsService.assignCategoryToNews(newsId, categoryId);
  }
}
