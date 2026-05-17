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

  // CORS Enterprise - acepta múltiples orígenes de Vercel
  const allowedOrigins = [
    'http://localhost:3000',
    'https://project-nyxdj.vercel.app',
    'https://rithits-58o1cg3bg-isgosk127-2503s-projects.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
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
