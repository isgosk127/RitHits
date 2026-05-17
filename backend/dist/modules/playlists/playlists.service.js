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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let PlaylistsService = class PlaylistsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.playlist.create({
            data: {
                name: data.name,
                description: data.description,
                isPublic: data.isPublic ?? true,
                userId,
            },
        });
    }
    async findAll(limit = 20, offset = 0) {
        return this.prisma.playlist.findMany({
            where: { isPublic: true },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true } },
                _count: { select: { songs: true } },
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.playlist.findMany({
            where: { userId, isPublic: true },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { songs: true } } },
        });
    }
    async findMy(userId) {
        return this.prisma.playlist.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: { _count: { select: { songs: true } } },
        });
    }
    async findOne(id, userId) {
        const playlist = await this.prisma.playlist.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, username: true } },
                songs: {
                    orderBy: { order: 'asc' },
                    include: {
                        song: {
                            include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
                        },
                    },
                },
                _count: { select: { likes: true } },
            },
        });
        if (!playlist)
            throw new common_1.NotFoundException('Playlist not found');
        if (!playlist.isPublic && playlist.userId !== userId) {
            throw new common_1.ForbiddenException('Private playlist');
        }
        return playlist;
    }
    async update(id, userId, data) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id } });
        if (!playlist || playlist.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.playlist.update({ where: { id }, data });
    }
    async remove(id, userId) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id } });
        if (!playlist || playlist.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.playlist.delete({ where: { id } });
    }
    async addSong(playlistId, songId, userId) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
        if (!playlist || playlist.userId !== userId)
            throw new common_1.ForbiddenException();
        const count = await this.prisma.playlistSong.count({ where: { playlistId } });
        return this.prisma.playlistSong.create({
            data: { playlistId, songId, order: count },
        });
    }
    async removeSong(playlistId, songId, userId) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
        if (!playlist || playlist.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.playlistSong.delete({
            where: { playlistId_songId: { playlistId, songId } },
        });
    }
    async reorderSongs(playlistId, songIds, userId) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
        if (!playlist || playlist.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.$transaction(songIds.map((id, index) => this.prisma.playlistSong.update({
            where: { playlistId_songId: { playlistId, songId: id } },
            data: { order: index },
        })));
    }
};
exports.PlaylistsService = PlaylistsService;
exports.PlaylistsService = PlaylistsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlaylistsService);
//# sourceMappingURL=playlists.service.js.map