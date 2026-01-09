"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const chama_entity_1 = require("./entities/chama.entity");
const member_entity_1 = require("./entities/member.entity");
const contribution_entity_1 = require("./entities/contribution.entity");
const loan_entity_1 = require("./entities/loan.entity");
const payment_entity_1 = require("./entities/payment.entity");
const meeting_entity_1 = require("./entities/meeting.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: "postgres",
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.database'),
                    entities: [user_entity_1.User, chama_entity_1.Chama, member_entity_1.Member, contribution_entity_1.Contribution, loan_entity_1.Loan, payment_entity_1.Payment, meeting_entity_1.Meeting],
                    synchronize: true,
                    logging: configService.get('database.logging'),
                    ssl: configService.get('database.ssl')
                        ? { rejectUnauthorized: false }
                        : false,
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map