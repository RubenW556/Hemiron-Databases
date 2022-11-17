import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // @TODO update this with a domain
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  await app.listen(process.env.PORT);

}

bootstrap();
