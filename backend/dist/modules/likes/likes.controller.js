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
exports.LikesController = void 0;
const common_1 = require("@nestjs/common");
const likes_service_1 = require("./likes.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let LikesController = class LikesController {
    likesService;
    constructor(likesService) {
        this.likesService = likesService;
    }
    toggleSong(songId, req) {
        return this.likesService.toggleSongLike(req.user.sub || req.user.id, songId);
    }
    toggleAlbum(albumId, req) {
        return this.likesService.toggleAlbumLike(req.user.sub || req.user.id, albumId);
    }
    togglePlaylist(playlistId, req) {
        return this.likesService.togglePlaylistLike(req.user.sub || req.user.id, playlistId);
    }
    getLikedSongs(req) {
        return this.likesService.getLikedSongs(req.user.sub || req.user.id);
    }
    getLikedAlbums(req) {
        return this.likesService.getLikedAlbums(req.user.sub || req.user.id);
    }
    getLikedPlaylists(req) {
        return this.likesService.getLikedPlaylists(req.user.sub || req.user.id);
    }
    checkSong(songId, req) {
        return this.likesService.checkSongLike(req.user.userId || req.user.id, songId).then(liked => ({ liked }));
    }
    checkPlaylist(playlistId, req) {
        return this.likesService.checkPlaylistLike(req.user.userId || req.user.id, playlistId).then(liked => ({ liked }));
    }
};
exports.LikesController = LikesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('songs/:songId'),
    __param(0, (0, common_1.Param)('songId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "toggleSong", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('albums/:albumId'),
    __param(0, (0, common_1.Param)('albumId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "toggleAlbum", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('playlists/:playlistId'),
    __param(0, (0, common_1.Param)('playlistId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "togglePlaylist", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('songs'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "getLikedSongs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('albums'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "getLikedAlbums", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('playlists'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "getLikedPlaylists", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('check/songs/:songId'),
    __param(0, (0, common_1.Param)('songId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "checkSong", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('check/playlists/:playlistId'),
    __param(0, (0, common_1.Param)('playlistId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "checkPlaylist", null);
exports.LikesController = LikesController = __decorate([
    (0, common_1.Controller)('likes'),
    __metadata("design:paramtypes", [likes_service_1.LikesService])
], LikesController);
//# sourceMappingURL=likes.controller.js.map