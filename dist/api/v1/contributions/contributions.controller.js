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
exports.ContributionsController = void 0;
const common_1 = require("@nestjs/common");
const contributions_service_1 = require("./contributions.service");
const create_contribution_dto_1 = require("./dto/create-contribution.dto");
const update_contribution_dto_1 = require("./dto/update-contribution.dto");
const clerk_auth_guard_1 = require("../auth/guards/clerk-auth.guard");
let ContributionsController = class ContributionsController {
    contributionsService;
    constructor(contributionsService) {
        this.contributionsService = contributionsService;
    }
    create(createContributionDto, req) {
        return this.contributionsService.create(createContributionDto, req.user.clerkId);
    }
    findAllByChama(chamaId) {
        return this.contributionsService.findAllByChama(chamaId);
    }
    findAllByUser(userId) {
        return this.contributionsService.findAllByUser(userId);
    }
    getTotalByChama(chamaId) {
        return this.contributionsService.getTotalByChama(chamaId);
    }
    getTotalByUserInChama(userId, chamaId) {
        return this.contributionsService.getTotalByUserInChama(userId, chamaId);
    }
    findOne(id) {
        return this.contributionsService.findOne(id);
    }
    update(id, updateContributionDto, req) {
        return this.contributionsService.update(id, updateContributionDto, req.user.clerkId);
    }
    remove(id, req) {
        return this.contributionsService.remove(id, req.user.clerkId);
    }
};
exports.ContributionsController = ContributionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contribution_dto_1.CreateContributionDto, Object]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('chama/:chamaId'),
    __param(0, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "findAllByChama", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)('total/chama/:chamaId'),
    __param(0, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "getTotalByChama", null);
__decorate([
    (0, common_1.Get)('total/user/:userId/chama/:chamaId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "getTotalByUserInChama", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_contribution_dto_1.UpdateContributionDto, Object]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContributionsController.prototype, "remove", null);
exports.ContributionsController = ContributionsController = __decorate([
    (0, common_1.Controller)('contributions'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __metadata("design:paramtypes", [contributions_service_1.ContributionsService])
], ContributionsController);
//# sourceMappingURL=contributions.controller.js.map