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
exports.AlbumsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AlbumsService = class AlbumsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(artistId, data) {
        return this.prisma.album.create({
            data: {
                title: data.title,
                description: data.description,
                genre: data.genre || 'Pop',
                releaseYear: Number(data.releaseYear) || new Date().getFullYear(),
                coverUrl: data.coverUrl,
                artistId,
            },
            include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
        });
    }
    async findAll(limit = 20, offset = 0) {
        return this.prisma.album.findMany({
            where: { isPublic: true },
            take: limit,
            skip: offset,
            orderBy: { playCount: 'desc' },
            include: {
                artist: { select: { id: true, username: true, avatarUrl: true } },
                songs: { select: { id: true, title: true, duration: true, coverUrl: true } },
                _count: { select: { songs: true, likes: true } },
            },
        });
    }
    async findOne(id) {
        const album = await this.prisma.album.findUnique({
            where: { id },
            include: {
                artist: { select: { id: true, username: true, avatarUrl: true, isVerified: true } },
                songs: {
                    orderBy: { createdAt: 'asc' },
                    include: { artist: { select: { id: true, username: true } } },
                },
                _count: { select: { likes: true } },
            },
        });
        if (!album)
            throw new common_1.NotFoundException(`Album ${id} not found`);
        return album;
    }
    async findByArtist(artistId) {
        return this.prisma.album.findMany({
            where: { artistId, isPublic: true },
            orderBy: { releaseYear: 'desc' },
            include: {
                _count: { select: { songs: true, likes: true } },
                songs: { select: { id: true, title: true, duration: true, coverUrl: true } },
            },
        });
    }
    async update(id, artistId, data) {
        const album = await this.prisma.album.findUnique({ where: { id } });
        if (!album)
            throw new common_1.NotFoundException(`Album ${id} not found`);
        if (album.artistId !== artistId)
            throw new common_1.ForbiddenException('Not your album');
        return this.prisma.album.update({ where: { id }, data });
    }
    async remove(id, artistId) {
        const album = await this.prisma.album.findUnique({ where: { id } });
        if (!album)
            throw new common_1.NotFoundException();
        if (album.artistId !== artistId)
            throw new common_1.ForbiddenException();
        return this.prisma.album.delete({ where: { id } });
    }
    async addSong(albumId, songId, artistId) {
        const album = await this.prisma.album.findUnique({ where: { id: albumId } });
        if (!album || album.artistId !== artistId)
            throw new common_1.ForbiddenException();
        return this.prisma.song.update({ where: { id: songId }, data: { albumId } });
    }
    async incrementPlayCount(albumId) {
        return this.prisma.album.update({
            where: { id: albumId },
            data: { playCount: { increment: 1 } },
        });
    }
};
exports.AlbumsService = AlbumsService;
exports.AlbumsService = AlbumsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlbumsService);
//# sourceMappingURL=albums.service.js.map