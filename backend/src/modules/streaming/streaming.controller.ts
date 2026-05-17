import { Controller, Get, Param, Res, Header, Headers, HttpStatus } from '@nestjs/common';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('stream')
export class StreamingController {
  
  @Get(':songId')
  async streamAudio(
    @Param('songId') songId: string,
    @Headers('range') range: string,
    @Res() res: express.Response,
  ) {
    // Nota: En un sistema real buscaríamos el path en la DB. 
    // Aquí asumimos la convención de archivos subidos.
    const songPath = path.join(process.cwd(), 'uploads', 'songs', `${songId}.mp3`);
    
    // Fallback: Si no existe con ese nombre exacto, buscamos en el directorio
    if (!fs.existsSync(songPath)) {
      // Intento de búsqueda por patrón si el ID es parte del nombre
      const files = fs.readdirSync(path.join(process.cwd(), 'uploads', 'songs'));
      const foundFile = files.find(f => f.includes(songId));
      if (!foundFile) return res.status(HttpStatus.NOT_FOUND).send('Song not found');
    }

    const stat = fs.statSync(songPath);
    const fileSize = stat.size;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(songPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(HttpStatus.OK, head);
      fs.createReadStream(songPath).pipe(res);
    }
  }
}
