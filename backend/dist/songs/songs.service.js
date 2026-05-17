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
var SongsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SongsService = SongsService_1 = class SongsService {
    prisma;
    logger = new common_1.Logger(SongsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            return await this.prisma.song.create({
                data,
                include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
            });
        }
        catch (err) {
            this.logger.error(`Error creating song: ${err.message}`);
            throw err;
        }
    }
    async findMy(artistId) {
        try {
            return await this.prisma.song.findMany({
                where: { artistId },
                orderBy: { createdAt: 'desc' },
                include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
            });
        }
        catch (err) {
            this.logger.error(`Error in findMy: ${err.message}`);
            throw err;
        }
    }
    async findAll(limit = 50) {
        try {
            return await this.prisma.song.findMany({
                where: { isPublic: true },
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
            });
        }
        catch (err) {
            this.logger.error(`Error in findAll: ${err.message}`);
            return this.prisma.song.findMany({ take: limit });
        }
    }
    async findOne(id) {
        return this.prisma.song.findUnique({
            where: { id },
            include: {
                artist: { select: { id: true, username: true, avatarUrl: true, isVerified: true } },
                album: { select: { id: true, title: true, coverUrl: true } },
                _count: { select: { likes: true } },
            },
        });
    }
    async findByArtist(artistId) {
        return this.prisma.song.findMany({
            where: { artistId },
            orderBy: { createdAt: 'desc' },
            include: { artist: { select: { id: true, username: true } } },
        });
    }
    async getRanking(period = 'all', limit = 50) {
        return this.prisma.song.findMany({
            where: { isPublic: true },
            take: limit,
            orderBy: { playCount: 'desc' },
            include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
        }).then((songs) => songs.map((s, i) => ({ ...s, rank: i + 1 })));
    }
    async remove(id) {
        return this.prisma.song.delete({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.song.update({
            where: { id },
            data,
            include: { artist: { select: { id: true, username: true } } },
        });
    }
};
exports.SongsService = SongsService;
exports.SongsService = SongsService = SongsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SongsService);
//# sourceMappingURL=songs.service.js.map