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
exports.AlbumsController = void 0;
const common_1 = require("@nestjs/common");
const albums_service_1 = require("./albums.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let AlbumsController = class AlbumsController {
    albumsService;
    constructor(albumsService) {
        this.albumsService = albumsService;
    }
    findAll(limit, offset) {
        return this.albumsService.findAll(Number(limit) || 20, Number(offset) || 0);
    }
    findOne(id) {
        return this.albumsService.findOne(id);
    }
    findByArtist(artistId) {
        return this.albumsService.findByArtist(artistId);
    }
    create(req, body) {
        const artistId = req.user.userId;
        return this.albumsService.create(artistId, body);
    }
    update(id, req, body) {
        const artistId = req.user.userId;
        return this.albumsService.update(id, artistId, body);
    }
    remove(id, req) {
        const artistId = req.user.userId;
        return this.albumsService.remove(id, artistId);
    }
    addSong(id, songId, req) {
        const artistId = req.user.userId;
        return this.albumsService.addSong(id, songId, artistId);
    }
};
exports.AlbumsController = AlbumsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AlbumsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlbumsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('artist/:artistId'),
    __param(0, (0, common_1.Param)('artistId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlbumsController.prototype, "findByArtist", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AlbumsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlbumsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlbumsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/songs/:songId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('songId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AlbumsController.prototype, "addSong", null);
exports.AlbumsController = AlbumsController = __decorate([
    (0, common_1.Controller)('albums'),
    __metadata("design:paramtypes", [albums_service_1.AlbumsService])
], AlbumsController);
//# sourceMappingURL=albums.controller.js.map