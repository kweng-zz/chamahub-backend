import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppDataSource } from './infrastructure/database/data-source';

async function bootstrap() {
  // Run migrations if in production
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log('Running database migrations...');
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      await AppDataSource.runMigrations();
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Migration error:', error);
      // Don't exit, let the app continue
      // Migrations might have already been run
    }
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get CORS origins from config
  const corsOrigins = configService.get<string[]>('cors.origins') || ['http://localhost:3000'];

  // Enable CORS with dynamic origins
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = configService.get<number>('port') || 3001;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
