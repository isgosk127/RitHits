import { PrismaService } from '../../prisma.service';
export declare class RadioService {
    private prisma;
    constructor(prisma: PrismaService);
    generateStation(userId: string, seed?: {
        genre?: string;
        mood?: string;
    }): Promise<{
        station: {
            name: string;
            genre: string;
            description: string;
        };
        queue: any[];
    }>;
    generateGlobalRadio(): Promise<{
        station: {
            name: string;
            description: string;
        };
        queue: any[];
    }>;
}
