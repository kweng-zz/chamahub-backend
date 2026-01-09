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
exports.MeetingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meeting_entity_1 = require("../../../infrastructure/database/entities/meeting.entity");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
const chama_entity_1 = require("../../../infrastructure/database/entities/chama.entity");
let MeetingsService = class MeetingsService {
    meetingRepository;
    userRepository;
    chamaRepository;
    constructor(meetingRepository, userRepository, chamaRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
        this.chamaRepository = chamaRepository;
    }
    async create(createMeetingDto, clerkId) {
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: createMeetingDto.chamaId },
        });
        if (!chama) {
            throw new common_1.NotFoundException('Chama not found');
        }
        if (chama?.createdById !== user.id) {
            throw new common_1.ForbiddenException('Only the chama creator can schedule meetings');
        }
        const meeting = this.meetingRepository.create(createMeetingDto);
        return this.meetingRepository.save(meeting);
    }
    async findAllByChama(chamaId) {
        return this.meetingRepository.find({
            where: { chamaId },
            relations: ['chama'],
            order: { scheduledAt: 'DESC' },
        });
    }
    async findUpcomingByChama(chamaId) {
        return this.meetingRepository
            .createQueryBuilder('meeting')
            .where('meeting.chamaId = :chamaId', { chamaId })
            .andWhere('meeting.scheduledAt > :now', { now: new Date() })
            .andWhere('meeting.status = :status', { status: 'scheduled' })
            .orderBy('meeting.scheduledAt', 'ASC')
            .getMany();
    }
    async findOne(id) {
        const meeting = await this.meetingRepository.findOne({
            where: { id },
            relations: ['chama'],
        });
        if (!meeting) {
            throw new common_1.NotFoundException(`Meeting with ID ${id} not found`);
        }
        return meeting;
    }
    async update(id, updateMeetingDto, clerkId) {
        const meeting = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: meeting.chamaId },
        });
        if (chama?.createdById !== user.id) {
            throw new common_1.ForbiddenException('Only the chama creator can update meetings');
        }
        Object.assign(meeting, updateMeetingDto);
        return this.meetingRepository.save(meeting);
    }
    async remove(id, clerkId) {
        const meeting = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { clerkId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const chama = await this.chamaRepository.findOne({
            where: { id: meeting.chamaId },
        });
        if (chama?.createdById !== user.id) {
            throw new common_1.ForbiddenException('Only the chama creator can delete meetings');
        }
        await this.meetingRepository.remove(meeting);
    }
    async getCountByStatus(chamaId, status) {
        return this.meetingRepository.count({
            where: { chamaId, status },
        });
    }
};
exports.MeetingsService = MeetingsService;
exports.MeetingsService = MeetingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(chama_entity_1.Chama)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MeetingsService);
//# sourceMappingURL=meetings.service.js.map