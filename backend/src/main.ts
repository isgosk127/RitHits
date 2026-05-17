import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: false, // Permite cargar imágenes/audio de este servidor
  }));

  // CORS Enterprise
  app.enableCors({ 
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', 
    credentials: true 
  });

  // Global Validation
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`🚀 RitHits Enterprise API running on port ${port}`);
}
bootstrap();
