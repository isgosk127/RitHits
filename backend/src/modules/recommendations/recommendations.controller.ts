import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('for-you')
  async getForYou(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.recommendationsService.getForYou(userId);
  }

  @Get('similar/:songId')
  async getSimilar(@Param('songId') songId: string) {
    return this.recommendationsService.getSimilarSongs(songId);
  }
}
