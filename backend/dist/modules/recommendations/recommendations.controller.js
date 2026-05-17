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
exports.RecommendationsController = void 0;
const common_1 = require("@nestjs/common");
const recommendations_service_1 = require("./recommendations.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let RecommendationsController = class RecommendationsController {
    recommendationsService;
    constructor(recommendationsService) {
        this.recommendationsService = recommendationsService;
    }
    async getForYou(req) {
        const userId = req.user.sub || req.user.id;
        return this.recommendationsService.getForYou(userId);
    }
    async getSimilar(songId) {
        return this.recommendationsService.getSimilarSongs(songId);
    }
};
exports.RecommendationsController = RecommendationsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('for-you'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "getForYou", null);
__decorate([
    (0, common_1.Get)('similar/:songId'),
    __param(0, (0, common_1.Param)('songId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "getSimilar", null);
exports.RecommendationsController = RecommendationsController = __decorate([
    (0, common_1.Controller)('recommendations'),
    __metadata("design:paramtypes", [recommendations_service_1.RecommendationsService])
], RecommendationsController);
//# sourceMappingURL=recommendations.controller.js.map