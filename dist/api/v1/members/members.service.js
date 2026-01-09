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
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const member_entity_1 = require("../../../infrastructure/database/entities/member.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
const chama_entity_1 = require("../../../infrastructure/database/entities/chama.entity");
let MembersService = class MembersService {
    memberRepository;
    userRepository;
    chamaRepository;
    constructor(memberRepository, userRepository, chamaRepository) {
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.chamaRepository = chamaRepository;
    }
    async create(createMemberDto, requestingClerkId) {
        const requestingUser = await this.userRepository.findOne({
            where: { clerkId: requestingClerkId }
        });
        if (!requestingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: createMemberDto.chamaId },
        });
        if (!chama) {
            throw new common_1.NotFoundException('Chama not Found');
        }
        if (chama?.createdById !== requestingUser.id) {
            throw new common_1.ForbiddenException('Only Admin can add members');
        }
        const existingMember = await this.memberRepository.findOne({
            where: {
                chamaId: createMemberDto.chamaId,
                userId: createMemberDto.userId,
            },
        });
        if (existingMember) {
            throw new common_1.ConflictException('User is already a  member');
        }
        const member = this.memberRepository.create(createMemberDto);
        const savedMember = await this.memberRepository.save(member);
        await this.chamaRepository.increment({ id: createMemberDto.chamaId }, 'memberCount', 1);
        return savedMember;
    }
    async findAllByChama(chamaId) {
        return this.memberRepository.find({
            where: { chamaId },
            relations: ['user'],
        });
    }
    async findByUser(userId) {
        return this.memberRepository.find({
            where: { userId },
            relations: ['chama', 'user'],
        });
    }
    async findOne(id) {
        const member = await this.memberRepository.findOne({
            where: { id },
            relations: ['user', 'chama'],
        });
        if (!member) {
            throw new common_1.NotFoundException(`Member with ID ${id} not found`);
        }
        return member;
    }
    async update(id, updateMemberDto, requestingClerkId) {
        const member = await this.findOne(id);
        const requestingUser = await this.userRepository.findOne({
            where: { clerkId: requestingClerkId }
        });
        if (!requestingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: member.chamaId },
        });
        if (chama?.createdById !== requestingUser.id) {
            throw new common_1.ForbiddenException('Only admin can update members');
        }
        Object.assign(member, updateMemberDto);
        return this.memberRepository.save(member);
    }
    async remove(id, requestingClerkId) {
        const member = await this.findOne(id);
        const requestingUser = await this.userRepository.findOne({
            where: { clerkId: requestingClerkId }
        });
        if (!requestingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: member.chamaId },
        });
        if (chama?.createdById !== requestingUser.id) {
            throw new common_1.ForbiddenException('Only admin can remove members');
        }
        await this.memberRepository.remove(member);
        await this.chamaRepository.decrement({ id: member.chamaId }, 'memberCount', 1);
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(member_entity_1.Member)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(chama_entity_1.Chama)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MembersService);
//# sourceMappingURL=members.service.js.map