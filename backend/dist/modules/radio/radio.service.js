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
exports.RadioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let RadioService = class RadioService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateStation(userId, seed) {
        const history = await this.prisma.history.findMany({
            where: { userId },
            include: { song: { select: { genre: true } } },
            orderBy: { playedAt: 'desc' },
            take: 50,
        });
        const genreScores = {};
        history.forEach((h) => {
            const g = h.song?.genre || 'Pop';
            genreScores[g] = (genreScores[g] || 0) + 1;
        });
        const topGenres = Object.keys(genreScores)
            .sort((a, b) => genreScores[b] - genreScores[a])
            .slice(0, 3);
        const genres = seed?.genre ? [seed.genre, ...topGenres].slice(0, 3) : topGenres;
        const fallbackGenre = genres[0] || 'Pop';
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentlyPlayed = await this.prisma.history.findMany({
            where: { userId, playedAt: { gte: oneWeekAgo } },
            select: { songId: true },
        });
        const recentIds = [...new Set(recentlyPlayed.map((h) => h.songId))];
        const songs = await this.prisma.song.findMany({
            where: {
                genre: { in: genres.length > 0 ? genres : [fallbackGenre] },
                id: { notIn: recentIds },
                isPublic: true,
            },
            take: 30,
            orderBy: [{ playCount: 'desc' }],
            include: {
                artist: { select: { id: true, username: true, avatarUrl: true } },
            },
        });
        if (songs.length < 10) {
            const popular = await this.prisma.song.findMany({
                where: { isPublic: true, id: { notIn: songs.map((s) => s.id) } },
                take: 30 - songs.length,
                orderBy: { playCount: 'desc' },
                include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
            });
            songs.push(...popular);
        }
        const shuffled = [...songs];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return {
            station: {
                name: seed?.genre ? `${seed.genre} Radio` : `Tu Radio Personalizada`,
                genre: fallbackGenre,
                description: `Basado en tus gustos musicales`,
            },
            queue: shuffled,
        };
    }
    async generateGlobalRadio() {
        const songs = await this.prisma.song.findMany({
            where: { isPublic: true },
            take: 50,
            orderBy: { playCount: 'desc' },
            include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
        });
        const shuffled = [...songs];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return {
            station: { name: 'Radio Global RitHits', description: 'Lo más popular del momento' },
            queue: shuffled
        };
    }
};
exports.RadioService = RadioService;
exports.RadioService = RadioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RadioService);
//# sourceMappingURL=radio.service.js.map