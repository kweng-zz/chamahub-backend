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
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const members_service_1 = require("./members.service");
const create_member_dto_1 = require("./dto/create-member.dto");
const update_member_dto_1 = require("./dto/update-member.dto");
const clerk_auth_guard_1 = require("../../../common/guards/clerk-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const member_entity_1 = require("../../../infrastructure/database/entities/member.entity");
const common_2 = require("@nestjs/common");
let MembersController = class MembersController {
    membersService;
    memberRepository;
    constructor(membersService, memberRepository) {
        this.membersService = membersService;
        this.memberRepository = memberRepository;
    }
    create(createMemberDto, req) {
        return this.membersService.create(createMemberDto, req.user.clerkId);
    }
    async requestMembership(createMemberDto) {
        const existingMember = await this.memberRepository.findOne({
            where: {
                chamaId: createMemberDto.chamaId,
                userId: createMemberDto.userId,
            },
        });
        if (existingMember) {
            throw new common_2.ConflictException('You have already applied to this chama');
        }
        const member = this.memberRepository.create({
            ...createMemberDto,
            status: 'pending',
            role: 'member',
        });
        return this.memberRepository.save(member);
    }
    findByChamaId(chamaId) {
        return this.membersService.findAllByChama(chamaId);
    }
    findByUserId(userId) {
        return this.membersService.findByUser(userId);
    }
    update(id, updateMemberDto, req) {
        return this.membersService.update(id, updateMemberDto, req.user.clerkId);
    }
    remove(id, req) {
        return this.membersService.remove(id, req.user.clerkId);
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_member_dto_1.CreateMemberDto, Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_member_dto_1.CreateMemberDto]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "requestMembership", null);
__decorate([
    (0, common_1.Get)('chama/:chamaId'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __param(0, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "findByChamaId", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_member_dto_1.UpdateMemberDto, Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "remove", null);
exports.MembersController = MembersController = __decorate([
    (0, common_1.Controller)('members'),
    __param(1, (0, typeorm_1.InjectRepository)(member_entity_1.Member)),
    __metadata("design:paramtypes", [members_service_1.MembersService,
        typeorm_2.Repository])
], MembersController);
//# sourceMappingURL=members.controller.js.map