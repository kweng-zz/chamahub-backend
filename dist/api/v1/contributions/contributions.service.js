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
exports.ContributionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contribution_entity_1 = require("../../../infrastructure/database/entities/contribution.entity");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
const chama_entity_1 = require("../../../infrastructure/database/entities/chama.entity");
let ContributionsService = class ContributionsService {
    contributionRepository;
    userRepository;
    chamaRepository;
    constructor(contributionRepository, userRepository, chamaRepository) {
        this.contributionRepository = contributionRepository;
        this.userRepository = userRepository;
        this.chamaRepository = chamaRepository;
    }
    async create(createContributionDto, clerkId) {
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: createContributionDto.chamaId },
        });
        if (!chama) {
            throw new common_1.NotFoundException('Chama not found');
        }
        const contribution = this.contributionRepository.create(createContributionDto);
        return this.contributionRepository.save(contribution);
    }
    async findAllByChama(chamaId) {
        return this.contributionRepository.find({
            where: { chamaId },
            relations: ['user'],
            order: { contributionDate: 'DESC' },
        });
    }
    async findAllByUser(userId) {
        return this.contributionRepository.find({
            where: { userId },
            relations: ['chama'],
            order: { contributionDate: 'DESC' },
        });
    }
    async findOne(id) {
        const contribution = await this.contributionRepository.findOne({
            where: { id },
            relations: ['user', 'chama'],
        });
        if (!contribution) {
            throw new common_1.NotFoundException(`Contribution with ID ${id} not found`);
        }
        return contribution;
    }
    async update(id, updateContributionDto, clerkId) {
        const contribution = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: contribution.chamaId },
        });
        if (chama?.createdById !== user.id && contribution.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only update your own contributions or if you are the chama creator');
        }
        Object.assign(contribution, updateContributionDto);
        return this.contributionRepository.save(contribution);
    }
    async remove(id, clerkId) {
        const contribution = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: contribution.chamaId },
        });
        if (chama?.createdById !== user.id) {
            throw new common_1.ForbiddenException('Only the chama creator can delete contributions');
        }
        await this.contributionRepository.remove(contribution);
    }
    async getTotalByChama(chamaId) {
        const result = await this.contributionRepository
            .createQueryBuilder('contribution')
            .select('SUM(contribution.amount)', 'total')
            .where('contribution.chamaId = :chamaId', { chamaId })
            .andWhere('contribution.status = :status', { status: 'completed' })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalByUserInChama(userId, chamaId) {
        const result = await this.contributionRepository
            .createQueryBuilder('contribution')
            .select('SUM(contribution.amount)', 'total')
            .where('contribution.userId = :userId', { userId })
            .andWhere('contribution.chamaId = :chamaId', { chamaId })
            .andWhere('contribution.status = :status', { status: 'completed' })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
};
exports.ContributionsService = ContributionsService;
exports.ContributionsService = ContributionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contribution_entity_1.Contribution)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(chama_entity_1.Chama)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ContributionsService);
//# sourceMappingURL=contributions.service.js.map