import { PrismaService } from '../prisma.service';
export declare class SongsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findMy(artistId: string): Promise<any>;
    findAll(limit?: number): Promise<any>;
    findOne(id: string): Promise<any>;
    findByArtist(artistId: string): Promise<any>;
    getRanking(period?: 'week' | 'month' | 'all', limit?: number): Promise<any>;
    remove(id: string): Promise<any>;
    update(id: string, artistId: string, data: any): Promise<any>;
}
