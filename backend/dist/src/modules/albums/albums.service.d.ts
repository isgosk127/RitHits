import { PrismaService } from '../../prisma.service';
export declare class AlbumsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(artistId: string, data: {
        title: string;
        description?: string;
        genre?: string;
        releaseYear?: number;
        coverUrl?: string;
    }): Promise<any>;
    findAll(limit?: number, offset?: number): Promise<any>;
    findOne(id: string): Promise<any>;
    findByArtist(artistId: string): Promise<any>;
    update(id: string, artistId: string, data: any): Promise<any>;
    remove(id: string, artistId: string): Promise<any>;
    addSong(albumId: string, songId: string, artistId: string): Promise<any>;
    incrementPlayCount(albumId: string): Promise<any>;
}
