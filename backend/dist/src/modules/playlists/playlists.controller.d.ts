import { PlaylistsService } from './playlists.service';
export declare class PlaylistsController {
    private readonly playlistsService;
    constructor(playlistsService: PlaylistsService);
    findAll(limit: string): Promise<any>;
    findByUser(userId: string): Promise<any>;
    findMine(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(req: any, body: any): Promise<any>;
    update(id: string, req: any, body: any): Promise<any>;
    remove(id: string, req: any): Promise<any>;
    addSong(id: string, songId: string, req: any): Promise<any>;
    removeSong(id: string, songId: string, req: any): Promise<any>;
    reorder(id: string, req: any, body: {
        songs: {
            songId: string;
            order: number;
        }[];
    }): Promise<any[]>;
}
