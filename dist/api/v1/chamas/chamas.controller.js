"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamasController = void 0;
const common_1 = require("@nestjs/common");
const clerk_auth_guard_1 = require("../auth/guards/clerk-auth.guard");
const chamas_service_1 = require("./chamas.service");
const create_chama_dto_1 = require("./dto/create-chama.dto");
const update_chama_dto_1 = require("./dto/update-chama.dto");
let ChamasController = class ChamasController {
    chamasService;
    constructor(chamasService) {
        this.chamasService = chamasService;
    }
    create(createChamaDto, req) {
        return this.chamasService.create(createChamaDto, req.user.clerkId);
    }
    findAll() {
        return this.chamasService.findAll();
    }
    findOne(id) {
        return this.chamasService.findOne(id);
    }
    update(id, updateChamaDto, req) {
        return this.chamasService.update(id, updateChamaDto, req.user.clerkId);
    }
    remove(id, req) {
        return this.chamasService.remove(id, req.user.clerkId);
    }
};
exports.ChamasController = ChamasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chama_dto_1.CreateChamaDto, Object]),
    __metadata("design:returntype", void 0)
], ChamasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChamasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChamasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chama_dto_1.UpdateChamaDto, Object]),
    __metadata("design:returntype", void 0)
], ChamasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChamasController.prototype, "remove", null);
exports.ChamasController = ChamasController = __decorate([
    (0, common_1.Controller)('chamas'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __metadata("design:paramtypes", [chamas_service_1.ChamasService])
], ChamasController);
//# sourceMappingURL=chamas.controller.js.map