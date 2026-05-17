import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RadioService {
  constructor(private prisma: PrismaService) {}

  async generateStation(userId: string, seed?: { genre?: string; mood?: string }) {
    const history = await (this.prisma as any).history.findMany({
      where: { userId },
      include: { song: { select: { genre: true } } },
      orderBy: { playedAt: 'desc' },
      take: 50,
    });

    const genreScores: Record<string, number> = {};
    history.forEach((h: any) => {
      const g = h.song?.genre || 'Pop';
      genreScores[g] = (genreScores[g] || 0) + 1;
    });

    const topGenres = Object.keys(genreScores)
      .sort((a, b) => genreScores[b] - genreScores[a])
      .slice(0, 3);

    const genres = seed?.genre ? [seed.genre, ...topGenres].slice(0, 3) : topGenres;
    const fallbackGenre = genres[0] || 'Pop';

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentlyPlayed = await (this.prisma as any).history.findMany({
      where: { userId, playedAt: { gte: oneWeekAgo } },
      select: { songId: true },
    });
    const recentIds = [...new Set(recentlyPlayed.map((h: any) => h.songId))];

    const songs = await (this.prisma as any).song.findMany({
      where: {
        genre: { in: genres.length > 0 ? genres : [fallbackGenre] },
        id: { notIn: recentIds },
        isPublic: true,
      },
      take: 30,
      orderBy: [{ playCount: 'desc' }],
      include: {
        artist: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    if (songs.length < 10) {
      const popular = await (this.prisma as any).song.findMany({
        where: { isPublic: true, id: { notIn: songs.map((s: any) => s.id) } },
        take: 30 - songs.length,
        orderBy: { playCount: 'desc' },
        include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
      });
      songs.push(...popular);
    }

    const shuffled = [...songs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return {
      station: {
        name: seed?.genre ? `${seed.genre} Radio` : `Tu Radio Personalizada`,
        genre: fallbackGenre,
        description: `Basado en tus gustos musicales`,
      },
      queue: shuffled,
    };
  }

  async generateGlobalRadio() {
    const songs = await (this.prisma as any).song.findMany({
      where: { isPublic: true },
      take: 50,
      orderBy: { playCount: 'desc' },
      include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
    });

    const shuffled = [...songs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return { 
      station: { name: 'Radio Global RitHits', description: 'Lo más popular del momento' }, 
      queue: shuffled 
    };
  }
}
