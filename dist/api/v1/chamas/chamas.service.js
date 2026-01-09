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
exports.ChamasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chama_entity_1 = require("../../../infrastructure/database/entities/chama.entity");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
let ChamasService = class ChamasService {
    chamaRepository;
    userRepository;
    constructor(chamaRepository, userRepository) {
        this.chamaRepository = chamaRepository;
        this.userRepository = userRepository;
    }
    async create(createChamaDto, clerkId) {
        const user = await this.userRepository.findOne({
            where: { clerkId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found. Please sync your account first.');
        }
        const chama = this.chamaRepository.create({
            ...createChamaDto,
            createdById: user.id,
        });
        return this.chamaRepository.save(chama);
    }
    async findAll() {
        return this.chamaRepository.find({
            relations: ['createdBy'],
        });
    }
    async findOne(id) {
        const chama = await this.chamaRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!chama) {
            throw new common_1.NotFoundException(`Chama with ID ${id} not found`);
        }
        return chama;
    }
    async update(id, updateChamaDto, clerkId) {
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.findOne(id);
        if (chama.createdById !== user.id) {
            throw new common_1.ForbiddenException('You can only update chamas you created');
        }
        Object.assign(chama, updateChamaDto);
        return this.chamaRepository.save(chama);
    }
    async remove(id, clerkId) {
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.findOne(id);
        if (chama.createdById !== user.id) {
            throw new common_1.ForbiddenException('You can only delete chamas you created');
        }
        await this.chamaRepository.remove(chama);
    }
};
exports.ChamasService = ChamasService;
exports.ChamasService = ChamasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chama_entity_1.Chama)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChamasService);
//# sourceMappingURL=chamas.service.js.map