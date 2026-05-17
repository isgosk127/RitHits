import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('songs/:songId')
  toggleSong(@Param('songId') songId: string, @Request() req: any) {
    return this.likesService.toggleSongLike(req.user.sub || req.user.id, songId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('albums/:albumId')
  toggleAlbum(@Param('albumId') albumId: string, @Request() req: any) {
    return this.likesService.toggleAlbumLike(req.user.sub || req.user.id, albumId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('playlists/:playlistId')
  togglePlaylist(@Param('playlistId') playlistId: string, @Request() req: any) {
    return this.likesService.togglePlaylistLike(req.user.sub || req.user.id, playlistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('songs')
  getLikedSongs(@Request() req: any) {
    return this.likesService.getLikedSongs(req.user.sub || req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('albums')
  getLikedAlbums(@Request() req: any) {
    return this.likesService.getLikedAlbums(req.user.sub || req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('playlists')
  getLikedPlaylists(@Request() req: any) {
    return this.likesService.getLikedPlaylists(req.user.sub || req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/songs/:songId')
  checkSong(@Param('songId') songId: string, @Request() req: any) {
    return this.likesService.checkSongLike(req.user.userId || req.user.id, songId).then(liked => ({ liked }));
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/playlists/:playlistId')
  checkPlaylist(@Param('playlistId') playlistId: string, @Request() req: any) {
    return this.likesService.checkPlaylistLike(req.user.userId || req.user.id, playlistId).then(liked => ({ liked }));
  }
}
