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
exports.FollowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let FollowsService = class FollowsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async follow(followerId, followingId) {
        if (followerId === followingId)
            throw new common_1.ConflictException('Cannot follow yourself');
        try {
            return await this.prisma.follow.create({
                data: { followerId, followingId },
            });
        }
        catch {
            throw new common_1.ConflictException('Already following');
        }
    }
    async unfollow(followerId, followingId) {
        return this.prisma.follow.delete({
            where: { followerId_followingId: { followerId, followingId } },
        });
    }
    async checkFollow(followerId, followingId) {
        const follow = await this.prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });
        return { following: !!follow };
    }
    async getFollowers(userId) {
        const followers = await this.prisma.follow.findMany({
            where: { followingId: userId },
            include: { follower: { select: { id: true, username: true, avatarUrl: true } } },
        });
        return followers.map((f) => f.follower);
    }
    async getFollowing(userId) {
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId },
            include: { following: { select: { id: true, username: true, avatarUrl: true, isArtist: true } } },
        });
        return following.map((f) => f.following);
    }
    async getStats(userId) {
        const [followers, following] = await Promise.all([
            this.prisma.follow.count({ where: { followingId: userId } }),
            this.prisma.follow.count({ where: { followerId: userId } }),
        ]);
        return { followers, following };
    }
};
exports.FollowsService = FollowsService;
exports.FollowsService = FollowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowsService);
//# sourceMappingURL=follows.service.js.map