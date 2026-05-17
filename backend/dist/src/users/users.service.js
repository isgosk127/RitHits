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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.user.create({ data });
    }
    async findOne(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true, username: true, email: true, avatarUrl: true, bannerUrl: true,
                bio: true, isArtist: true, isVerified: true, role: true, createdAt: true,
                songs: {
                    where: { isPublic: true },
                    take: 20,
                    orderBy: { playCount: 'desc' },
                    include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
                },
                albums: {
                    where: { isPublic: true },
                    take: 12,
                    orderBy: { releaseYear: 'desc' },
                    include: { _count: { select: { songs: true } } },
                },
                _count: { select: { songs: true, albums: true, followers: true, following: true, playlists: true } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return user;
    }
    async findByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true, username: true, avatarUrl: true, bannerUrl: true,
                bio: true, isArtist: true, isVerified: true, createdAt: true,
                songs: {
                    where: { isPublic: true },
                    take: 10,
                    orderBy: { playCount: 'desc' },
                    include: { artist: { select: { id: true, username: true } } },
                },
                albums: {
                    where: { isPublic: true },
                    take: 6,
                    orderBy: { releaseYear: 'desc' },
                    include: { _count: { select: { songs: true } } },
                },
                _count: { select: { songs: true, albums: true, followers: true, following: true } },
            },
        });
    }
    async updateProfile(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
            select: { id: true, username: true, email: true, avatarUrl: true, bannerUrl: true, bio: true, isArtist: true },
        });
    }
    async updateRefreshToken(id, refreshToken) {
        return this.prisma.user.update({ where: { id }, data: { refreshToken } });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async getArtists(limit = 20) {
        return this.prisma.user.findMany({
            where: { isArtist: true },
            take: limit,
            select: {
                id: true, username: true, avatarUrl: true, isVerified: true,
                _count: { select: { songs: true, followers: true } },
            },
        });
    }
    async getListeningHistory(userId, limit = 20) {
        const history = await this.prisma.history.findMany({
            where: { userId },
            take: limit,
            orderBy: { playedAt: 'desc' },
            include: { song: { include: { artist: { select: { id: true, username: true } } } } },
            distinct: ['songId'],
        });
        return history.map((h) => h.song).filter(Boolean);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map