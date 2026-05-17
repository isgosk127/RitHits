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
exports.RadioController = void 0;
const common_1 = require("@nestjs/common");
const radio_service_1 = require("./radio.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let RadioController = class RadioController {
    radioService;
    constructor(radioService) {
        this.radioService = radioService;
    }
    getPersonalized(req, genre) {
        const userId = req.user.sub || req.user.id;
        return this.radioService.generateStation(userId, genre ? { genre } : undefined);
    }
    getGlobal() {
        return this.radioService.generateGlobalRadio();
    }
};
exports.RadioController = RadioController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('station'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('genre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RadioController.prototype, "getPersonalized", null);
__decorate([
    (0, common_1.Get)('global'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RadioController.prototype, "getGlobal", null);
exports.RadioController = RadioController = __decorate([
    (0, common_1.Controller)('radio'),
    __metadata("design:paramtypes", [radio_service_1.RadioService])
], RadioController);
//# sourceMappingURL=radio.controller.js.map