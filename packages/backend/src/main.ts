import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 8002;
  await app.listen(port);
  console.log(`Nova Admin API running on port ${port}`);
}
bootstrap();
