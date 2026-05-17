import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async recordPlay(userId: string, songId: string, duration: number) {
    try {
      return await (this.prisma as any).$transaction([
        (this.prisma as any).history.create({
          data: { userId, songId, duration },
        }),
        (this.prisma as any).song.update({
          where: { id: songId },
          data: { playCount: { increment: 1 } },
        }),
      ]);
    } catch (err) {
      this.logger.error(`Error recording play: ${err.message}`);
      throw err;
    }
  }

  async getTrending(limit: number = 10) {
    try {
      return await (this.prisma as any).song.findMany({
        take: limit,
        orderBy: { playCount: 'desc' },
        include: { artist: { select: { id: true, username: true, avatarUrl: true } } },
      });
    } catch (err) {
      this.logger.error(`Error fetching trending: ${err.message}`);
      // Fallback: intentar sin include para diagnosticar
      return (this.prisma as any).song.findMany({ 
        take: limit,
        orderBy: { playCount: 'desc' }
      });
    }
  }
}
