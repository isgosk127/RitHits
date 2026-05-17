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
exports.PlaylistsController = void 0;
const common_1 = require("@nestjs/common");
const playlists_service_1 = require("./playlists.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let PlaylistsController = class PlaylistsController {
    playlistsService;
    constructor(playlistsService) {
        this.playlistsService = playlistsService;
    }
    findAll(limit) {
        return this.playlistsService.findAll(Number(limit) || 20);
    }
    findByUser(userId) {
        return this.playlistsService.findByUser(userId);
    }
    findMine(req) {
        return this.playlistsService.findMy(req.user.userId);
    }
    findOne(id) {
        return this.playlistsService.findOne(id);
    }
    create(req, body) {
        return this.playlistsService.create(req.user.userId, body);
    }
    update(id, req, body) {
        return this.playlistsService.update(id, req.user.userId, body);
    }
    remove(id, req) {
        return this.playlistsService.remove(id, req.user.userId);
    }
    addSong(id, songId, req) {
        return this.playlistsService.addSong(id, songId, req.user.userId);
    }
    removeSong(id, songId, req) {
        return this.playlistsService.removeSong(id, songId, req.user.userId);
    }
    reorder(id, req, body) {
        const songIds = body.songs.map(s => s.songId);
        return this.playlistsService.reorderSongs(id, songIds, req.user.userId);
    }
};
exports.PlaylistsController = PlaylistsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/songs/:songId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('songId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "addSong", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/songs/:songId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('songId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "removeSong", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/reorder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlaylistsController.prototype, "reorder", null);
exports.PlaylistsController = PlaylistsController = __decorate([
    (0, common_1.Controller)('playlists'),
    __metadata("design:paramtypes", [playlists_service_1.PlaylistsService])
], PlaylistsController);
//# sourceMappingURL=playlists.controller.js.map