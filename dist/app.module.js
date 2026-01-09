"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = __importDefault(require("./core/config/configuration"));
const database_module_1 = require("./infrastructure/database/database.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./api/v1/auth/auth.module");
const chamas_module_1 = require("./api/v1/chamas/chamas.module");
const members_module_1 = require("./api/v1/members/members.module");
const contributions_module_1 = require("./api/v1/contributions/contributions.module");
const loans_module_1 = require("./api/v1/loans/loans.module");
const payments_module_1 = require("./api/v1/payments/payments.module");
const meetings_module_1 = require("./api/v1/meetings/meetings.module");
const mpesa_module_1 = require("./api/v1/mpesa/mpesa.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            chamas_module_1.ChamasModule,
            members_module_1.MembersModule,
            contributions_module_1.ContributionsModule,
            loans_module_1.LoansModule,
            payments_module_1.PaymentsModule,
            meetings_module_1.MeetingsModule,
            mpesa_module_1.MpesaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map