import { PrismaService } from '../../prisma.service';
export declare class AnalyticsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    recordPlay(userId: string, songId: string, duration: number): Promise<any>;
    getTrending(limit?: number): Promise<any>;
}
