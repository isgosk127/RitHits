import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async create(artistId: string, data: { title: string; description?: string; genre?: string; releaseYear?: number; coverUrl?: string }) {
    return (this.prisma as any).album.create({
      data: {
        title: data.title,
        description: data.description,
        genre: data.genre || 'Pop',
        releaseYear: Number(data.releaseYear) || new Date().getFullYear(),
        coverUrl: data.coverUrl,
        artistId,
      },
      include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }

  async findAll(limit = 20, offset = 0) {
    return (this.prisma as any).album.findMany({
      where: { isPublic: true },
      take: limit,
      skip: offset,
      orderBy: { playCount: 'desc' },
      include: {
        artist: { select: { id: true, username: true, avatarUrl: true } },
        songs: { select: { id: true, title: true, duration: true, coverUrl: true } },
        _count: { select: { songs: true, likes: true } },
      },
    });
  }

  async findOne(id: string) {
    const album = await (this.prisma as any).album.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, username: true, avatarUrl: true, isVerified: true } },
        songs: {
          orderBy: { createdAt: 'asc' },
          include: { artist: { select: { id: true, username: true } } },
        },
        _count: { select: { likes: true } },
      },
    });
    if (!album) throw new NotFoundException(`Album ${id} not found`);
    return album;
  }

  async findByArtist(artistId: string) {
    return (this.prisma as any).album.findMany({
      where: { artistId, isPublic: true },
      orderBy: { releaseYear: 'desc' },
      include: {
        _count: { select: { songs: true, likes: true } },
        songs: { select: { id: true, title: true, duration: true, coverUrl: true } },
      },
    });
  }

  async update(id: string, artistId: string, data: any) {
    const album = await (this.prisma as any).album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(`Album ${id} not found`);
    if (album.artistId !== artistId) throw new ForbiddenException('Not your album');
    return (this.prisma as any).album.update({ where: { id }, data });
  }

  async remove(id: string, artistId: string) {
    const album = await (this.prisma as any).album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException();
    if (album.artistId !== artistId) throw new ForbiddenException();
    return (this.prisma as any).album.delete({ where: { id } });
  }

  async addSong(albumId: string, songId: string, artistId: string) {
    const album = await (this.prisma as any).album.findUnique({ where: { id: albumId } });
    if (!album || album.artistId !== artistId) throw new ForbiddenException();
    return (this.prisma as any).song.update({ where: { id: songId }, data: { albumId } });
  }

  async incrementPlayCount(albumId: string) {
    return (this.prisma as any).album.update({
      where: { id: albumId },
      data: { playCount: { increment: 1 } },
    });
  }
}
