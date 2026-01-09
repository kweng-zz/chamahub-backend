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
exports.LoansController = void 0;
const common_1 = require("@nestjs/common");
const loans_service_1 = require("./loans.service");
const create_loan_dto_1 = require("./dto/create-loan.dto");
const update_loan_dto_1 = require("./dto/update-loan.dto");
const clerk_auth_guard_1 = require("../auth/guards/clerk-auth.guard");
let LoansController = class LoansController {
    loansService;
    constructor(loansService) {
        this.loansService = loansService;
    }
    create(createLoanDto, req) {
        return this.loansService.create(createLoanDto, req.user.clerkId);
    }
    findAllByChama(chamaId) {
        return this.loansService.findAllByChama(chamaId);
    }
    findAllByUser(userId) {
        return this.loansService.findAllByUser(userId);
    }
    getTotalByChama(chamaId) {
        return this.loansService.getTotalByChama(chamaId);
    }
    getActiveByUserInChama(userId, chamaId) {
        return this.loansService.getActiveByUserInChama(userId, chamaId);
    }
    findOne(id) {
        return this.loansService.findOne(id);
    }
    update(id, updateLoanDto, req) {
        return this.loansService.update(id, updateLoanDto, req.user.clerkId);
    }
    remove(id, req) {
        return this.loansService.remove(id, req.user.clerkId);
    }
};
exports.LoansController = LoansController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_loan_dto_1.CreateLoanDto, Object]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('chama/:chamaId'),
    __param(0, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "findAllByChama", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)('total/chama/:chamaId'),
    __param(0, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "getTotalByChama", null);
__decorate([
    (0, common_1.Get)('active/user/:userId/chama/:chamaId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "getActiveByUserInChama", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_loan_dto_1.UpdateLoanDto, Object]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "remove", null);
exports.LoansController = LoansController = __decorate([
    (0, common_1.Controller)('loans'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __metadata("design:paramtypes", [loans_service_1.LoansService])
], LoansController);
//# sourceMappingURL=loans.controller.js.map