import { PrismaService } from '../../prisma.service';
export declare class FollowsController {
    private prisma;
    constructor(prisma: PrismaService);
    follow(id: string, req: any): Promise<any>;
    unfollow(id: string, req: any): Promise<any>;
    check(id: string, req: any): Promise<{
        following: boolean;
    }>;
}
