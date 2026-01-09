"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chamas_controller_1 = require("./chamas.controller");
const chamas_service_1 = require("./chamas.service");
const chama_entity_1 = require("../../../infrastructure/database/entities/chama.entity");
const clerk_service_1 = require("../../../core/security/clerk.service");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
let ChamasModule = class ChamasModule {
};
exports.ChamasModule = ChamasModule;
exports.ChamasModule = ChamasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chama_entity_1.Chama, user_entity_1.User])],
        controllers: [chamas_controller_1.ChamasController],
        providers: [chamas_service_1.ChamasService, clerk_service_1.ClerkService],
        exports: [chamas_service_1.ChamasService],
    })
], ChamasModule);
//# sourceMappingURL=chamas.module.js.map