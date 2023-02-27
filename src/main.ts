import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  // ejecuta el módulo principal
  const app = await NestFactory.create(AppModule);

  // configuramos globalmente el prefijo de las API 
  app.setGlobalPrefix('api');

  // utilizamos los PIPES a nivel global para validar la forma de los DTO 
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
      })
    );

  // puerto utilizado por la aplicación
  await app.listen(3000);
}
bootstrap();
