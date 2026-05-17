import { SongsService } from './songs.service';
import { MediaProcessor } from '../modules/streaming/media.processor';
export declare class SongsController {
    private readonly songsService;
    private readonly mediaProcessor;
    private readonly logger;
    constructor(songsService: SongsService, mediaProcessor: MediaProcessor);
    uploadSong(files: {
        audio?: Express.Multer.File[];
        cover?: Express.Multer.File[];
    }, body: any, req: any): Promise<any>;
    findAll(limit: string): Promise<any>;
    getRanking(period: 'week' | 'month' | 'all', limit: string): Promise<any>;
    findByArtist(artistId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    findMine(req: any): Promise<any>;
    remove(id: string): Promise<any>;
}
