import { RecommendationsService } from './recommendations.service';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    getForYou(req: any): Promise<({
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
    getSimilar(songId: string): Promise<({
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
