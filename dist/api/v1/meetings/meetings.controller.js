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
exports.MeetingsController = void 0;
const common_1 = require("@nestjs/common");
const meetings_service_1 = require("./meetings.service");
const create_meeting_dto_1 = require("./dto/create-meeting.dto");
const update_meeting_dto_1 = require("./dto/update-meeting.dto");
const clerk_auth_guard_1 = require("../auth/guards/clerk-auth.guard");
let MeetingsController = class MeetingsController {
    meetingsService;
    constructor(meetingsService) {
        this.meetingsService = meetingsService;
    }
    create(createMeetingDto, req) {
        return this.meetingsService.create(createMeetingDto, req.user.clerkId);
    }
    findAllByChama(chamaId) {
        return this.meetingsService.findAllByChama(chamaId);
    }
    findUpcomingByChama(chamaId) {
        return this.meetingsService.findUpcomingByChama(chamaId);
    }
    getCountByStatus(chamaId, status) {
        return this.meetingsService.getCountByStatus(chamaId, status);
    }
    findOne(id) {
        return this.meetingsService.findOne(id);
    }
    update(id, updateMeetingDto, req) {
        return this.meetingsService.update(id, updateMeetingDto, req.user.clerkId);
    }
    remove(id, req) {
        return this.meetingsService.remove(id, req.user.clerkId);
    }
};
exports.MeetingsController = MeetingsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meeting_dto_1.CreateMeetingDto, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('chama/:chamaId'),
    __param(0, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "findAllByChama", null);
__decorate([
    (0, common_1.Get)('upcoming/chama/:chamaId'),
    __param(0, (0, common_1.Param)('chamaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "findUpcomingByChama", null);
__decorate([
    (0, common_1.Get)('count/chama/:chamaId'),
    __param(0, (0, common_1.Param)('chamaId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "getCountByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_meeting_dto_1.UpdateMeetingDto, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "remove", null);
exports.MeetingsController = MeetingsController = __decorate([
    (0, common_1.Controller)('meetings'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __metadata("design:paramtypes", [meetings_service_1.MeetingsService])
], MeetingsController);
//# sourceMappingURL=meetings.controller.js.map