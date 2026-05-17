import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('play')
  async recordPlay(@Request() req: any, @Body('songId') songId: string, @Body('duration') duration: number) {
    const userId = req.user.userId;
    return this.analyticsService.recordPlay(userId, songId, duration);
  }

  @Get('trending')
  async getTrending(@Query('limit') limit: string) {
    return this.analyticsService.getTrending(limit ? parseInt(limit) : 10);
  }
}
