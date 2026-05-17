import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { RadioService } from './radio.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('radio')
export class RadioController {
  constructor(private readonly radioService: RadioService) {}

  @UseGuards(JwtAuthGuard)
  @Get('station')
  getPersonalized(@Request() req: any, @Query('genre') genre: string) {
    const userId = req.user.sub || req.user.id;
    return this.radioService.generateStation(userId, genre ? { genre } : undefined);
  }

  @Get('global')
  getGlobal() {
    return this.radioService.generateGlobalRadio();
  }
}
