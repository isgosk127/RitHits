import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async getForYou(userId: string) {
    const history = await this.prisma.history.findMany({
      where: { userId },
      include: { song: true },
      orderBy: { playedAt: 'desc' },
      take: 20
    });

    if (history.length === 0) {
      return this.prisma.song.findMany({
        orderBy: { playCount: 'desc' },
        take: 10,
        include: { artist: { select: { username: true } } }
      });
    }

    const genres = history.map((h: any) => h.song.genre);
    const genreFrequency = genres.reduce((acc: Record<string, number>, g: string) => {
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    const topGenre = Object.keys(genreFrequency).sort((a, b) => genreFrequency[b] - genreFrequency[a])[0];
    const listenedIds = history.map((h: any) => h.songId);
    
    return this.prisma.song.findMany({
      where: {
        genre: topGenre,
        id: { notIn: listenedIds }
      } as any,
      take: 10,
      orderBy: { playCount: 'desc' },
      include: { artist: { select: { username: true } } }
    });
  }

  async getSimilarSongs(songId: string) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) return [];

    return this.prisma.song.findMany({
      where: {
        genre: (song as any).genre,
        id: { not: songId }
      } as any,
      take: 5,
      include: { artist: { select: { username: true } } }
    });
  }
}
