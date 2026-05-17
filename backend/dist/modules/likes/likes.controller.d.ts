import { LikesService } from './likes.service';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggleSong(songId: string, req: any): Promise<{
        liked: boolean;
    }>;
    toggleAlbum(albumId: string, req: any): Promise<{
        liked: boolean;
    }>;
    togglePlaylist(playlistId: string, req: any): Promise<{
        liked: boolean;
    }>;
    getLikedSongs(req: any): Promise<any>;
    getLikedAlbums(req: any): Promise<any>;
    getLikedPlaylists(req: any): Promise<any>;
    checkSong(songId: string, req: any): Promise<{
        liked: boolean;
    }>;
}
