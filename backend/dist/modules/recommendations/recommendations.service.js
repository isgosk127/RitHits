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
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let RecommendationsService = class RecommendationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getForYou(userId) {
        const history = await this.prisma.history.findMany({
            where: { userId },
            include: { song: true },
            orderBy: { playedAt: 'desc' },
            take: 20
        });
        if (history.length === 0) {
            return this.prisma.song.findMany({
                orderBy: { playCount: 'desc' },
                take: 10,
                include: { artist: { select: { username: true } } }
            });
        }
        const genres = history.map((h) => h.song.genre);
        const genreFrequency = genres.reduce((acc, g) => {
            acc[g] = (acc[g] || 0) + 1;
            return acc;
        }, {});
        const topGenre = Object.keys(genreFrequency).sort((a, b) => genreFrequency[b] - genreFrequency[a])[0];
        const listenedIds = history.map((h) => h.songId);
        return this.prisma.song.findMany({
            where: {
                genre: topGenre,
                id: { notIn: listenedIds }
            },
            take: 10,
            orderBy: { playCount: 'desc' },
            include: { artist: { select: { username: true } } }
        });
    }
    async getSimilarSongs(songId) {
        const song = await this.prisma.song.findUnique({ where: { id: songId } });
        if (!song)
            return [];
        return this.prisma.song.findMany({
            where: {
                genre: song.genre,
                id: { not: songId }
            },
            take: 5,
            include: { artist: { select: { username: true } } }
        });
    }
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecommendationsService);
//# sourceMappingURL=recommendations.service.js.map