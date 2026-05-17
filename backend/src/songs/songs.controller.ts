import { Controller, Post, UseInterceptors, UploadedFiles, Body, Get, Delete, UseGuards, Request, Param, Query, Logger, InternalServerErrorException, Put, UploadedFile } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MediaProcessor } from '../modules/streaming/media.processor';
import { existsSync, mkdirSync } from 'fs';

@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(
    private readonly songsService: SongsService,
    private readonly mediaProcessor: MediaProcessor,
  ) {
    const paths = ['./uploads/songs', './uploads/covers'];
    paths.forEach(p => {
      if (!existsSync(p)) mkdirSync(p, { recursive: true });
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dest = file.fieldname === 'audio' ? './uploads/songs' : './uploads/covers';
        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadSong(
    @UploadedFiles() files: { audio?: Express.Multer.File[], cover?: Express.Multer.File[] },
    @Body() body: any,
    @Request() req: any,
  ) {
    try {
      this.logger.log('--- NUEVA SUBIDA DE CANCIÓN ---');
      this.logger.log(`Usuario ID: ${req.user?.userId || req.user?.id || 'NO ENCONTRADO'}`);
      this.logger.log(`Título: ${body.title}`);
      this.logger.log(`Audio File: ${files.audio?.[0]?.filename || 'MISSING'}`);
      
      const artistId = req.user?.userId || req.user?.id || req.user?.sub;
      const audioFile = files.audio?.[0];
      const coverFile = files.cover?.[0];

      if (!audioFile) {
        this.logger.error('Error: No se recibió el archivo de audio');
        throw new Error('Audio file is required');
      }

      if (!artistId) {
        this.logger.error('Error: No se pudo identificar al artista (ID faltante)');
        throw new Error('User ID not found in token');
      }

      const songData = {
        title: body.title || 'Sin Título',
        genre: body.genre || 'Pop',
        lyrics: body.lyrics || '',
        isPublic: body.isPublic === 'true' || body.isPublic === true || true,
        audioUrl: `/uploads/songs/${audioFile.filename}`,
        coverUrl: coverFile ? `/uploads/covers/${coverFile.filename}` : null,
        duration: 0,
        artist: { connect: { id: artistId } },
      };

      this.logger.log('Intentando guardar en base de datos...');
      const song = await (this.songsService as any).create(songData);
      this.logger.log(`¡Éxito! Canción creada con ID: ${song.id}`);

      // Procesamiento en background
      this.mediaProcessor.process({
        data: { songId: song.id, filePath: audioFile.path, fileName: audioFile.filename },
      } as any).catch(err => this.logger.error(`Error en procesamiento background: ${err.message}`));

      return song;
    } catch (err) {
      this.logger.error(`FALLO CRÍTICO EN UPLOAD: ${err.message}`);
      this.logger.error(err.stack);
      throw new InternalServerErrorException(`Fallo en el servidor: ${err.message}`);
    }
  }

  @Get()
  findAll(@Query('limit') limit: string) {
    return this.songsService.findAll(Number(limit) || 50);
  }

  @Get('ranking')
  getRanking(@Query('period') period: 'week' | 'month' | 'all', @Query('limit') limit: string) {
    return this.songsService.getRanking(period || 'all', Number(limit) || 50);
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId') artistId: string) {
    return this.songsService.findByArtist(artistId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMine(@Request() req: any) {
    return this.songsService.findMy(req.user?.userId || req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/covers',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: any,
    @UploadedFile() cover?: Express.Multer.File
  ) {
    const artistId = req.user?.userId || req.user?.id;
    const data = { ...body };
    if (cover) {
      data.coverUrl = `/uploads/covers/${cover.filename}`;
    }
    return this.songsService.update(id, artistId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songsService.remove(id);
  }
}
