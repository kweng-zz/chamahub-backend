// src/infrastructure/database/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const getDataSourceOptions = (): DataSourceOptions => {
  // Check for Render's DATABASE_URL first
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Parse DATABASE_URL format: postgres://user:password@host:port/database
    const url = new URL(databaseUrl);
    
    return {
      type: 'postgres',
      host: url.hostname,
      port: parseInt(url.port),
      username: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading "/"
      
      // Entity paths
      entities: ['src/**/*.entity{.ts,.js}'],
      migrations: ['src/infrastructure/database/migrations/*{.ts,.js}'],
      subscribers: ['src/**/*.subscriber{.ts,.js}'],
      
      // Configuration
      synchronize: false, // NEVER true in production
      logging: process.env.NODE_ENV === 'development',
      migrationsRun: false, // We'll run manually
      
      // SSL for production
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
  
  // Development configuration
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chamahub',
    
    // Entity paths
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/infrastructure/database/migrations/*{.ts,.js}'],
    subscribers: ['src/**/*.subscriber{.ts,.js}'],
    
    // Configuration
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.DB_LOGGING === 'true',
    migrationsRun: false,
    
    // SSL for development (optional)
    ssl: process.env.DB_SSL === 'true' 
      ? { rejectUnauthorized: false }
      : false,
  };
};

// Create and export the DataSource instance
export const AppDataSource = new DataSource(getDataSourceOptions());