import { PrismaService } from '../../prisma.service';
export declare class PlaylistsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        name: string;
        description?: string;
        isPublic?: boolean;
    }): Promise<any>;
    findAll(limit?: number, offset?: number): Promise<any>;
    findByUser(userId: string): Promise<any>;
    findMy(userId: string): Promise<any>;
    findOne(id: string, userId?: string): Promise<any>;
    update(id: string, userId: string, data: any): Promise<any>;
    remove(id: string, userId: string): Promise<any>;
    addSong(playlistId: string, songId: string, userId: string): Promise<any>;
    removeSong(playlistId: string, songId: string, userId: string): Promise<any>;
    reorderSongs(playlistId: string, songIds: string[], userId: string): Promise<any[]>;
}
