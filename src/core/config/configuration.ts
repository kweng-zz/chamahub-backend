// src/core/config/configuration.ts
export default () => ({
  // Server Configuration
  port: parseInt(process.env.PORT || '3001', 10), 
  
  // Database Configuration with Render support
  database: {
    // Render provides DATABASE_URL automatically
    url: process.env.DATABASE_URL,
    
    // Fallback for development/local
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chamahub',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true',
  },
  
  // Clerk Authentication
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },
  
  // CORS Configuration
  cors: {
    // IMPORTANT: Fixed the typo - should be split(',') not split('.')
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
  },
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
});