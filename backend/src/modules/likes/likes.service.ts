import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async toggleSongLike(userId: string, songId: string) {
    const existing = await (this.prisma as any).like.findUnique({
      where: { userId_songId: { userId, songId } },
    });
    if (existing) {
      await (this.prisma as any).like.delete({ where: { userId_songId: { userId, songId } } });
      return { liked: false };
    } else {
      await (this.prisma as any).like.create({ data: { userId, songId } });
      return { liked: true };
    }
  }

  async toggleAlbumLike(userId: string, albumId: string) {
    const existing = await (this.prisma as any).like.findUnique({
      where: { userId_albumId: { userId, albumId } },
    });
    if (existing) {
      await (this.prisma as any).like.delete({ where: { userId_albumId: { userId, albumId } } });
      return { liked: false };
    } else {
      await (this.prisma as any).like.create({ data: { userId, albumId } });
      return { liked: true };
    }
  }

  async togglePlaylistLike(userId: string, playlistId: string) {
    const existing = await (this.prisma as any).like.findUnique({
      where: { userId_playlistId: { userId, playlistId } },
    });
    if (existing) {
      await (this.prisma as any).like.delete({ where: { userId_playlistId: { userId, playlistId } } });
      return { liked: false };
    } else {
      await (this.prisma as any).like.create({ data: { userId, playlistId } });
      return { liked: true };
    }
  }

  async getLikedSongs(userId: string) {
    const likes = await (this.prisma as any).like.findMany({
      where: { userId, songId: { not: null } },
      include: {
        song: {
          include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
        },
      },
      orderBy: { likedAt: 'desc' },
    });
    return likes.map((l: any) => l.song).filter(Boolean);
  }

  async getLikedAlbums(userId: string) {
    const likes = await (this.prisma as any).like.findMany({
      where: { userId, albumId: { not: null } },
      include: {
        album: {
          include: { artist: { select: { id: true, username: true } }, _count: { select: { songs: true } } },
        },
      },
      orderBy: { likedAt: 'desc' },
    });
    return likes.map((l: any) => l.album).filter(Boolean);
  }

  async getLikedPlaylists(userId: string) {
    const likes = await (this.prisma as any).like.findMany({
      where: { userId, playlistId: { not: null } },
      include: {
        playlist: {
          include: { user: { select: { id: true, username: true } }, _count: { select: { songs: true } } },
        },
      },
      orderBy: { likedAt: 'desc' },
    });
    return likes.map((l: any) => l.playlist).filter(Boolean);
  }

  async checkSongLike(userId: string, songId: string): Promise<boolean> {
    const like = await (this.prisma as any).like.findUnique({ where: { userId_songId: { userId, songId } } });
    return !!like;
  }

  async checkPlaylistLike(userId: string, playlistId: string): Promise<boolean> {
    const like = await (this.prisma as any).like.findUnique({ where: { userId_playlistId: { userId, playlistId } } });
    return !!like;
  }

  async getSongLikeCount(songId: string): Promise<number> {
    return (this.prisma as any).like.count({ where: { songId } });
  }
}
