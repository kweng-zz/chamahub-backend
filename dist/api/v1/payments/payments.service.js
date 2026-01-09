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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../../../infrastructure/database/entities/payment.entity");
const loan_entity_1 = require("../../../infrastructure/database/entities/loan.entity");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
let PaymentsService = class PaymentsService {
    paymentRepository;
    loanRepository;
    userRepository;
    constructor(paymentRepository, loanRepository, userRepository) {
        this.paymentRepository = paymentRepository;
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }
    async create(createPaymentDto, clerkId) {
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const loan = await this.loanRepository.findOne({
            where: { id: createPaymentDto.loanId },
        });
        if (!loan) {
            throw new common_1.NotFoundException('Loan not found');
        }
        if (loan.status !== 'approved') {
            throw new common_1.BadRequestException('Can only make payments on approved loans');
        }
        if (loan.userId !== createPaymentDto.userId) {
            throw new common_1.ForbiddenException('You can only make payments on your own loans');
        }
        const payment = this.paymentRepository.create(createPaymentDto);
        return this.paymentRepository.save(payment);
    }
    async findAllByLoan(loanId) {
        return this.paymentRepository.find({
            where: { loanId },
            relations: ['user'],
            order: { paymentDate: 'DESC' },
        });
    }
    async findAllByUser(userId) {
        return this.paymentRepository.find({
            where: { userId },
            relations: ['loan'],
            order: { paymentDate: 'DESC' },
        });
    }
    async findOne(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['user', 'loan'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
    async update(id, updatePaymentDto, clerkId) {
        const payment = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (payment.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only update your own payments');
        }
        Object.assign(payment, updatePaymentDto);
        return this.paymentRepository.save(payment);
    }
    async remove(id, clerkId) {
        const payment = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const loan = await this.loanRepository.findOne({
            where: { id: payment.loanId },
            relations: ['chama'],
        });
        if (loan?.chama?.createdById !== user.id && payment.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only delete your own payments or if you are the chama creator');
        }
        await this.paymentRepository.remove(payment);
    }
    async getTotalByLoan(loanId) {
        const result = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .where('payment.loanId = :loanId', { loanId })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getRemainingBalance(loanId) {
        const loan = await this.loanRepository.findOne({
            where: { id: loanId },
        });
        if (!loan) {
            throw new common_1.NotFoundException('Loan not found');
        }
        const totalPaid = await this.getTotalByLoan(loanId);
        const totalOwed = parseFloat(loan.amount.toString()) * (1 + parseFloat(loan.interestRate.toString()) / 100);
        return totalOwed - totalPaid;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map