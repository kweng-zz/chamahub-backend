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
exports.MpesaController = void 0;
const common_1 = require("@nestjs/common");
const mpesa_service_1 = require("./mpesa.service");
const stk_push_dto_1 = require("./dto/stk-push.dto");
const clerk_auth_guard_1 = require("../../../common/guards/clerk-auth.guard");
let MpesaController = class MpesaController {
    mpesaService;
    constructor(mpesaService) {
        this.mpesaService = mpesaService;
    }
    async initiateSTKPush(stkPushDto) {
        return this.mpesaService.initiateSTKPush(stkPushDto);
    }
    async handleCallback(callbackData) {
        await this.mpesaService.handleCallback(callbackData);
        return { ResultCode: 0, ResultDesc: 'Success' };
    }
    async queryStatus(body) {
        return this.mpesaService.queryTransactionStatus(body.checkoutRequestId);
    }
};
exports.MpesaController = MpesaController;
__decorate([
    (0, common_1.Post)('stk-push'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stk_push_dto_1.StkPushDto]),
    __metadata("design:returntype", Promise)
], MpesaController.prototype, "initiateSTKPush", null);
__decorate([
    (0, common_1.Post)('callback'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MpesaController.prototype, "handleCallback", null);
__decorate([
    (0, common_1.Post)('query-status'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MpesaController.prototype, "queryStatus", null);
exports.MpesaController = MpesaController = __decorate([
    (0, common_1.Controller)('mpesa'),
    __metadata("design:paramtypes", [mpesa_service_1.MpesaService])
], MpesaController);
//# sourceMappingURL=mpesa.controller.js.map