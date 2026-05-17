import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import * as ffprobeStatic from 'ffprobe-static';
import * as ffmpegStatic from 'ffmpeg-static';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);

  constructor() {
    // Configurar rutas estáticas para FFmpeg y FFprobe
    const ffmpegPath = (ffmpegStatic as any).default || ffmpegStatic;
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath((ffprobeStatic as any).path);
    
    this.logger.log(`FFmpeg path set to: ${ffmpegPath}`);
  }

  async transcodeToHLS(inputPath: string, outputDir: string, songId: string): Promise<string> {
    const songFolder = path.join(outputDir, 'streaming', songId);
    if (!fs.existsSync(songFolder)) {
      fs.mkdirSync(songFolder, { recursive: true });
    }

    const playlistPath = path.join(songFolder, 'playlist.m3u8');

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-profile:v baseline',
          '-level 3.0',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls'
        ])
        .output(playlistPath)
        .on('start', (commandLine: string) => {
          this.logger.log('Spawned FFmpeg with command: ' + commandLine);
        })
        .on('end', () => {
          this.logger.log('Transcoding finished !');
          resolve(`/uploads/streaming/${songId}/playlist.m3u8`);
        })
        .on('error', (err: Error) => {
          this.logger.error('An error occurred during transcoding: ' + err.message);
          reject(err);
        })
        .run();
    });
  }

  async getWaveformData(inputPath: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      // Generar una representación simplificada de la onda
      resolve(Array.from({length: 100}, () => Math.random()));
    });
  }

  async getHookClip(inputPath: string, outputDir: string, songId: string): Promise<string> {
    const shortsFolder = path.join(outputDir, 'shorts');
    if (!fs.existsSync(shortsFolder)) {
      fs.mkdirSync(shortsFolder, { recursive: true });
    }

    const clipPath = path.join(shortsFolder, `${songId}.mp3`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(20)
        .setDuration(30)
        .output(clipPath)
        .on('end', () => {
          this.logger.log(`Short clip for ${songId} generated`);
          resolve(`/uploads/shorts/${songId}.mp3`);
        })
        .on('error', (err: Error) => {
          this.logger.error('Error generating short clip: ' + err.message);
          reject(err);
        })
        .run();
    });
  }
}
