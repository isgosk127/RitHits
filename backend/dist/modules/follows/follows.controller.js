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
exports.FollowsController = void 0;
const common_1 = require("@nestjs/common");
const follows_service_1 = require("./follows.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let FollowsController = class FollowsController {
    followsService;
    constructor(followsService) {
        this.followsService = followsService;
    }
    follow(targetId, req) {
        const followerId = req.user.userId;
        return this.followsService.follow(followerId, targetId);
    }
    unfollow(targetId, req) {
        const followerId = req.user.userId;
        return this.followsService.unfollow(followerId, targetId);
    }
    isFollowing(targetId, req) {
        const followerId = req.user.userId;
        return this.followsService.checkFollow(followerId, targetId);
    }
    getFollowers(userId) {
        return this.followsService.getFollowers(userId);
    }
    getFollowing(userId) {
        return this.followsService.getFollowing(userId);
    }
};
exports.FollowsController = FollowsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':targetId'),
    __param(0, (0, common_1.Param)('targetId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "follow", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':targetId'),
    __param(0, (0, common_1.Param)('targetId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "unfollow", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('check/:targetId'),
    __param(0, (0, common_1.Param)('targetId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "isFollowing", null);
__decorate([
    (0, common_1.Get)(':userId/followers'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)(':userId/following'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "getFollowing", null);
exports.FollowsController = FollowsController = __decorate([
    (0, common_1.Controller)('follows'),
    __metadata("design:paramtypes", [follows_service_1.FollowsService])
], FollowsController);
//# sourceMappingURL=follows.controller.js.map