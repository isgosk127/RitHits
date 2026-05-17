import { PrismaService } from '../../prisma.service';
export declare class RecommendationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getForYou(userId: string): Promise<({
        artist: {
            username: string;
        };
    } & {
        id: string;
        artistId: string;
        duration: number;
        title: string;
        audioUrl: string;
        coverUrl: string | null;
        genre: string;
        tags: string | null;
        lyrics: string | null;
        hookStart: number | null;
        hookEnd: number | null;
        waveform: string | null;
        playCount: number;
        isPublic: boolean;
        createdAt: Date;
        albumId: string | null;
    })[]>;
    getSimilarSongs(songId: string): Promise<({
        artist: {
            username: string;
        };
    } & {
        id: string;
        artistId: string;
        duration: number;
        title: string;
        audioUrl: string;
        coverUrl: string | null;
        genre: string;
        tags: string | null;
        lyrics: string | null;
        hookStart: number | null;
        hookEnd: number | null;
        waveform: string | null;
        playCount: number;
        isPublic: boolean;
        createdAt: Date;
        albumId: string | null;
    })[]>;
}
