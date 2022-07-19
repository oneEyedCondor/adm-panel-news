import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3000;

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT, () => console.log(`Service started on port ${PORT}`));
}
bootstrap();
