import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  UseGuards, Request, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  findAll(@Query('limit') limit: string, @Query('offset') offset: string) {
    return this.albumsService.findAll(Number(limit) || 20, Number(offset) || 0);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Request() req: any) {
    return this.albumsService.findByArtist(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId') artistId: string) {
    return this.albumsService.findByArtist(artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/covers',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  create(@Request() req: any, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const artistId = req.user.userId;
    const data = { ...body };
    if (file) {
      data.coverUrl = `/uploads/covers/${file.filename}`;
    }
    return this.albumsService.create(artistId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/covers',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  update(
    @Param('id') id: string, 
    @Request() req: any, 
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const artistId = req.user.userId;
    const data = { ...body };
    if (file) {
      data.coverUrl = `/uploads/covers/${file.filename}`;
    }
    return this.albumsService.update(id, artistId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const artistId = req.user.userId;
    return this.albumsService.remove(id, artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/songs/:songId')
  addSong(@Param('id') id: string, @Param('songId') songId: string, @Request() req: any) {
    const artistId = req.user.userId;
    return this.albumsService.addSong(id, songId, artistId);
  }
}
