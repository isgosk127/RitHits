import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  findAll(@Query('limit') limit: string) {
    return this.playlistsService.findAll(Number(limit) || 20);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.playlistsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMine(@Request() req: any) {
    return this.playlistsService.findMy(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.playlistsService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.playlistsService.update(id, req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.playlistsService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/songs/:songId')
  addSong(@Param('id') id: string, @Param('songId') songId: string, @Request() req: any) {
    return this.playlistsService.addSong(id, songId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/songs/:songId')
  removeSong(@Param('id') id: string, @Param('songId') songId: string, @Request() req: any) {
    return this.playlistsService.removeSong(id, songId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/reorder')
  reorder(@Param('id') id: string, @Request() req: any, @Body() body: { songs: { songId: string; order: number }[] }) {
    const songIds = body.songs.map(s => s.songId);
    return this.playlistsService.reorderSongs(id, songIds, req.user.userId);
  }
}
