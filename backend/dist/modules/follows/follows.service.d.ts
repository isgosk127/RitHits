import { PrismaService } from '../../prisma.service';
export declare class FollowsService {
    private prisma;
    constructor(prisma: PrismaService);
    follow(followerId: string, followingId: string): Promise<any>;
    unfollow(followerId: string, followingId: string): Promise<any>;
    checkFollow(followerId: string, followingId: string): Promise<{
        following: boolean;
    }>;
    getFollowers(userId: string): Promise<any>;
    getFollowing(userId: string): Promise<any>;
    getStats(userId: string): Promise<{
        followers: any;
        following: any;
    }>;
}
