import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; username: string; password: string }) {
    return (this.prisma as any).user.create({ data });
  }

  // Ahora devuelve null en lugar de lanzar excepción
  async findOne(email: string) {
    return (this.prisma as any).user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id },
      select: {
        id: true, username: true, email: true, avatarUrl: true, bannerUrl: true,
        bio: true, isArtist: true, isVerified: true, role: true, createdAt: true,
        songs: {
          where: { isPublic: true },
          take: 20,
          orderBy: { playCount: 'desc' },
          include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
        },
        albums: {
          where: { isPublic: true },
          take: 12,
          orderBy: { releaseYear: 'desc' },
          include: { _count: { select: { songs: true } } },
        },
        _count: { select: { songs: true, albums: true, followers: true, following: true, playlists: true } },
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // Ahora devuelve null si no existe, permitiendo que el registro continúe
  async findByUsername(username: string) {
    return (this.prisma as any).user.findUnique({
      where: { username },
      select: {
        id: true, username: true, avatarUrl: true, bannerUrl: true,
        bio: true, isArtist: true, isVerified: true, createdAt: true,
        songs: {
          where: { isPublic: true },
          take: 10,
          orderBy: { playCount: 'desc' },
          include: { artist: { select: { id: true, username: true } } },
        },
        albums: {
          where: { isPublic: true },
          take: 6,
          orderBy: { releaseYear: 'desc' },
          include: { _count: { select: { songs: true } } },
        },
        _count: { select: { songs: true, albums: true, followers: true, following: true } },
      },
    });
  }

  async updateProfile(id: string, data: { username?: string; bio?: string; avatarUrl?: string; bannerUrl?: string; isArtist?: boolean }) {
    return (this.prisma as any).user.update({
      where: { id },
      data,
      select: { id: true, username: true, email: true, avatarUrl: true, bannerUrl: true, bio: true, isArtist: true },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return (this.prisma as any).user.update({ where: { id }, data: { refreshToken } });
  }

  async findByEmail(email: string) {
    return (this.prisma as any).user.findUnique({ where: { email } });
  }

  async getArtists(limit = 20) {
    return (this.prisma as any).user.findMany({
      where: { isArtist: true },
      take: limit,
      select: {
        id: true, username: true, avatarUrl: true, isVerified: true,
        _count: { select: { songs: true, followers: true } },
      },
    });
  }

  async getListeningHistory(userId: string, limit = 20) {
    const history = await (this.prisma as any).history.findMany({
      where: { userId },
      take: limit,
      orderBy: { playedAt: 'desc' },
      include: { song: { include: { artist: { select: { id: true, username: true } } } } },
      distinct: ['songId'],
    });
    return history.map((h: any) => h.song).filter(Boolean);
  }
}
