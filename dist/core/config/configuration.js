"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3001', 10),
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: process.env.DB_LOGGING === 'true',
        ssl: process.env.DB_SSL === 'true',
    },
    clerk: {
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    },
    cors: {
        origins: process.env.CORS_ORIGINS?.split('.') || ['http://localhost:3000']
    },
});
//# sourceMappingURL=configuration.js.map