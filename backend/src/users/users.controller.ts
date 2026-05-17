import { Controller, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('artists')
  getArtists() {
    return this.usersService.getArtists();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/history')
  getHistory(@Request() req: any) {
    return this.usersService.getListeningHistory(req.user.sub || req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/profile')
  updateProfile(@Request() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.sub || req.user.id, body);
  }
}
