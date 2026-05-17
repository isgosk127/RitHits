import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; description?: string; isPublic?: boolean }) {
    return (this.prisma as any).playlist.create({
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic ?? true,
        userId,
      },
    });
  }

  async findAll(limit = 20, offset = 0) {
    return (this.prisma as any).playlist.findMany({
      where: { isPublic: true },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { songs: true } },
      },
    });
  }

  async findByUser(userId: string) {
    return (this.prisma as any).playlist.findMany({
      where: { userId, isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { songs: true } } },
    });
  }

  async findMy(userId: string) {
    return (this.prisma as any).playlist.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { songs: true } } },
    });
  }

  async findOne(id: string, userId?: string) {
    const playlist = await (this.prisma as any).playlist.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        songs: {
          orderBy: { order: 'asc' },
          include: {
            song: {
              include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
            },
          },
        },
        _count: { select: { likes: true } },
      },
    });

    if (!playlist) throw new NotFoundException('Playlist not found');
    if (!playlist.isPublic && playlist.userId !== userId) {
      throw new ForbiddenException('Private playlist');
    }
    return playlist;
  }

  async update(id: string, userId: string, data: any) {
    const playlist = await (this.prisma as any).playlist.findUnique({ where: { id } });
    if (!playlist || playlist.userId !== userId) throw new ForbiddenException();
    return (this.prisma as any).playlist.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const playlist = await (this.prisma as any).playlist.findUnique({ where: { id } });
    if (!playlist || playlist.userId !== userId) throw new ForbiddenException();
    return (this.prisma as any).playlist.delete({ where: { id } });
  }

  async addSong(playlistId: string, songId: string, userId: string) {
    const playlist = await (this.prisma as any).playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== userId) throw new ForbiddenException();

    // Comprobar si ya existe
    const existing = await (this.prisma as any).playlistSong.findUnique({
      where: { playlistId_songId: { playlistId, songId } },
    });
    if (existing) return existing;

    const count = await (this.prisma as any).playlistSong.count({ where: { playlistId } });
    return (this.prisma as any).playlistSong.create({
      data: { playlistId, songId, order: count },
    });
  }

  async removeSong(playlistId: string, songId: string, userId: string) {
    const playlist = await (this.prisma as any).playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== userId) throw new ForbiddenException();
    return (this.prisma as any).playlistSong.delete({
      where: { playlistId_songId: { playlistId, songId } },
    });
  }

  async reorderSongs(playlistId: string, songIds: string[], userId: string) {
    const playlist = await (this.prisma as any).playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== userId) throw new ForbiddenException();

    return this.prisma.$transaction(
      songIds.map((id, index) =>
        (this.prisma as any).playlistSong.update({
          where: { playlistId_songId: { playlistId, songId: id } },
          data: { order: index },
        }),
      ),
    );
  }
}
