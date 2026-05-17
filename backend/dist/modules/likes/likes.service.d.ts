import { PrismaService } from '../../prisma.service';
export declare class LikesService {
    private prisma;
    constructor(prisma: PrismaService);
    toggleSongLike(userId: string, songId: string): Promise<{
        liked: boolean;
    }>;
    toggleAlbumLike(userId: string, albumId: string): Promise<{
        liked: boolean;
    }>;
    togglePlaylistLike(userId: string, playlistId: string): Promise<{
        liked: boolean;
    }>;
    getLikedSongs(userId: string): Promise<any>;
    getLikedAlbums(userId: string): Promise<any>;
    getLikedPlaylists(userId: string): Promise<any>;
    checkSongLike(userId: string, songId: string): Promise<boolean>;
    getSongLikeCount(songId: string): Promise<number>;
}
