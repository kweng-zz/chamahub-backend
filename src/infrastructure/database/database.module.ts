// src/infrastructure/database/database.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Chama } from "./entities/chama.entity";
import { Member } from "./entities/member.entity";
import { Contribution } from "./entities/contribution.entity";
import { Loan } from "./entities/loan.entity";
import { Payment } from "./entities/payment.entity";
import { Meeting } from "./entities/meeting.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                // Check for DATABASE_URL first (Render provides this)
                const databaseUrl = configService.get<string>('database.url');
                
                if (databaseUrl) {
                    // Parse Render's DATABASE_URL: postgres://user:password@host:port/database
                    const url = new URL(databaseUrl);
                    
                    return {
                        type: "postgres",
                        host: url.hostname,
                        port: parseInt(url.port),
                        username: url.username,
                        password: url.password,
                        database: url.pathname.substring(1), // Remove leading "/"
                        entities: [User, Chama, Member, Contribution, Loan, Payment, Meeting],
                        synchronize: false, // ALWAYS false in production
                        logging: false, // Disable logging in production
                        ssl: {
                            rejectUnauthorized: false, // Required for Render PostgreSQL
                        },
                        extra: {
                            max: 20, // Connection pool size
                            idleTimeoutMillis: 30000,
                        },
                    };
                }
                
                // Development configuration (using individual params)
                return {
                    type: "postgres",
                    host: configService.get<string>('database.host'),
                    port: configService.get<number>('database.port'),
                    username: configService.get<string>('database.username'),
                    password: configService.get<string>('database.password'),
                    database: configService.get<string>('database.database'),
                    entities: [User, Chama, Member, Contribution, Loan, Payment, Meeting],
                    synchronize: configService.get<string>('nodeEnv') !== 'production',
                    logging: configService.get<boolean>('database.logging'),
                    ssl: configService.get<boolean>('database.ssl') 
                        ? { rejectUnauthorized: false }
                        : false,
                };
            },
        }),
    ],
})
export class DatabaseModule {}