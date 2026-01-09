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
exports.LoansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_entity_1 = require("../../../infrastructure/database/entities/loan.entity");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
const chama_entity_1 = require("../../../infrastructure/database/entities/chama.entity");
let LoansService = class LoansService {
    loanRepository;
    userRepository;
    chamaRepository;
    constructor(loanRepository, userRepository, chamaRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.chamaRepository = chamaRepository;
    }
    async create(createLoanDto, clerkId) {
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: createLoanDto.chamaId },
        });
        if (!chama) {
            throw new common_1.NotFoundException('Chama not found');
        }
        const pendingLoan = await this.loanRepository.findOne({
            where: {
                userId: createLoanDto.userId,
                chamaId: createLoanDto.chamaId,
                status: 'pending',
            },
        });
        if (pendingLoan) {
            throw new common_1.BadRequestException('User already has a pending loan in this chama');
        }
        const loan = this.loanRepository.create(createLoanDto);
        return this.loanRepository.save(loan);
    }
    async findAllByChama(chamaId) {
        return this.loanRepository.find({
            where: { chamaId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllByUser(userId) {
        return this.loanRepository.find({
            where: { userId },
            relations: ['chama'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const loan = await this.loanRepository.findOne({
            where: { id },
            relations: ['user', 'chama'],
        });
        if (!loan) {
            throw new common_1.NotFoundException(`Loan with ID ${id} not found`);
        }
        return loan;
    }
    async update(id, updateLoanDto, clerkId) {
        const loan = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: loan.chamaId },
        });
        if (chama?.createdById !== user.id) {
            throw new common_1.ForbiddenException('Only the chama creator can update loans');
        }
        Object.assign(loan, updateLoanDto);
        return this.loanRepository.save(loan);
    }
    async remove(id, clerkId) {
        const loan = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: loan.chamaId },
        });
        if (chama?.createdById !== user.id) {
            throw new common_1.ForbiddenException('Only the chama creator can delete loans');
        }
        await this.loanRepository.remove(loan);
    }
    async getTotalByChama(chamaId) {
        const result = await this.loanRepository
            .createQueryBuilder('loan')
            .select('SUM(loan.amount)', 'total')
            .where('loan.chamaId = :chamaId', { chamaId })
            .andWhere('loan.status = :status', { status: 'approved' })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getActiveByUserInChama(userId, chamaId) {
        return this.loanRepository.find({
            where: {
                userId,
                chamaId,
                status: 'approved',
            },
            relations: ['chama'],
        });
    }
};
exports.LoansService = LoansService;
exports.LoansService = LoansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(chama_entity_1.Chama)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LoansService);
//# sourceMappingURL=loans.service.js.map