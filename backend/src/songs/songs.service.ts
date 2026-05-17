import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await (this.prisma as any).song.create({
        data,
        include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
      });
    } catch (err) {
      this.logger.error(`Error creating song: ${err.message}`);
      throw err;
    }
  }

  async findMy(artistId: string) {
    try {
      return await (this.prisma as any).song.findMany({
        where: { artistId },
        orderBy: { createdAt: 'desc' },
        include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
      });
    } catch (err) {
      this.logger.error(`Error in findMy: ${err.message}`);
      throw err;
    }
  }

  async findAll(limit = 50) {
    try {
      return await (this.prisma as any).song.findMany({
        where: { isPublic: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
      });
    } catch (err) {
      this.logger.error(`Error in findAll: ${err.message}`);
      // Fallback: intentar sin include para diagnosticar
      return (this.prisma as any).song.findMany({ take: limit });
    }
  }

  async findOne(id: string) {
    return (this.prisma as any).song.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, username: true, avatarUrl: true, isVerified: true } },
        album: { select: { id: true, title: true, coverUrl: true } },
        _count: { select: { likes: true } },
      },
    });
  }

  async findByArtist(artistId: string) {
    return (this.prisma as any).song.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
      include: { artist: { select: { id: true, username: true } } },
    });
  }

  async getRanking(period: 'week' | 'month' | 'all' = 'all', limit = 50) {
    return (this.prisma as any).song.findMany({
      where: { isPublic: true },
      take: limit,
      orderBy: { playCount: 'desc' },
      include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
    }).then((songs: any[]) => songs.map((s, i) => ({ ...s, rank: i + 1 })));
  }

  async remove(id: string) {
    return (this.prisma as any).song.delete({ where: { id } });
  }

  async update(id: string, artistId: string, data: any) {
    const song = await (this.prisma as any).song.findUnique({ where: { id } });
    if (!song) throw new Error('Canción no encontrada');
    if (song.artistId !== artistId) throw new Error('No tienes permiso para editar esta canción');

    return (this.prisma as any).song.update({
      where: { id },
      data: {
        title: data.title,
        genre: data.genre,
        lyrics: data.lyrics,
        coverUrl: data.coverUrl,
        albumId: data.albumId === "" ? null : data.albumId,
        isPublic: data.isPublic !== undefined ? data.isPublic : song.isPublic,
      },
      include: { artist: { select: { id: true, username: true } } },
    });
  }

  async updateInternal(id: string, data: any) {
    return (this.prisma as any).song.update({
      where: { id },
      data,
    });
  }
}
