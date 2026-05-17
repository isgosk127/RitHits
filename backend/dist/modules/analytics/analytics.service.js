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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    prisma;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordPlay(userId, songId, duration) {
        try {
            return await this.prisma.$transaction([
                this.prisma.history.create({
                    data: { userId, songId, duration },
                }),
                this.prisma.song.update({
                    where: { id: songId },
                    data: { playCount: { increment: 1 } },
                }),
            ]);
        }
        catch (err) {
            this.logger.error(`Error recording play: ${err.message}`);
            throw err;
        }
    }
    async getTrending(limit = 10) {
        try {
            return await this.prisma.song.findMany({
                take: limit,
                orderBy: { playCount: 'desc' },
                include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
            });
        }
        catch (err) {
            this.logger.error(`Error fetching trending: ${err.message}`);
            return this.prisma.song.findMany({
                take: limit,
                orderBy: { playCount: 'desc' }
            });
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map