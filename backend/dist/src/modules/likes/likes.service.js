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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let LikesService = class LikesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggleSongLike(userId, songId) {
        const existing = await this.prisma.like.findUnique({
            where: { userId_songId: { userId, songId } },
        });
        if (existing) {
            await this.prisma.like.delete({ where: { userId_songId: { userId, songId } } });
            return { liked: false };
        }
        else {
            await this.prisma.like.create({ data: { userId, songId } });
            return { liked: true };
        }
    }
    async toggleAlbumLike(userId, albumId) {
        const existing = await this.prisma.like.findUnique({
            where: { userId_albumId: { userId, albumId } },
        });
        if (existing) {
            await this.prisma.like.delete({ where: { userId_albumId: { userId, albumId } } });
            return { liked: false };
        }
        else {
            await this.prisma.like.create({ data: { userId, albumId } });
            return { liked: true };
        }
    }
    async togglePlaylistLike(userId, playlistId) {
        const existing = await this.prisma.like.findUnique({
            where: { userId_playlistId: { userId, playlistId } },
        });
        if (existing) {
            await this.prisma.like.delete({ where: { userId_playlistId: { userId, playlistId } } });
            return { liked: false };
        }
        else {
            await this.prisma.like.create({ data: { userId, playlistId } });
            return { liked: true };
        }
    }
    async getLikedSongs(userId) {
        const likes = await this.prisma.like.findMany({
            where: { userId, songId: { not: null } },
            include: {
                song: {
                    include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
                },
            },
            orderBy: { likedAt: 'desc' },
        });
        return likes.map((l) => l.song).filter(Boolean);
    }
    async getLikedAlbums(userId) {
        const likes = await this.prisma.like.findMany({
            where: { userId, albumId: { not: null } },
            include: {
                album: {
                    include: { artist: { select: { id: true, username: true } }, _count: { select: { songs: true } } },
                },
            },
            orderBy: { likedAt: 'desc' },
        });
        return likes.map((l) => l.album).filter(Boolean);
    }
    async getLikedPlaylists(userId) {
        const likes = await this.prisma.like.findMany({
            where: { userId, playlistId: { not: null } },
            include: {
                playlist: {
                    include: { user: { select: { id: true, username: true } }, _count: { select: { songs: true } } },
                },
            },
            orderBy: { likedAt: 'desc' },
        });
        return likes.map((l) => l.playlist).filter(Boolean);
    }
    async checkSongLike(userId, songId) {
        const like = await this.prisma.like.findUnique({ where: { userId_songId: { userId, songId } } });
        return !!like;
    }
    async checkPlaylistLike(userId, playlistId) {
        const like = await this.prisma.like.findUnique({ where: { userId_playlistId: { userId, playlistId } } });
        return !!like;
    }
    async getSongLikeCount(songId) {
        return this.prisma.like.count({ where: { songId } });
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesService);
//# sourceMappingURL=likes.service.js.map