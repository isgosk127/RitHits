import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { SongsService } from '../../songs/songs.service';
import * as musicMetadata from 'music-metadata';
import { join } from 'path';

@Processor('media_processing')
export class MediaProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaProcessor.name);

  constructor(
    private readonly streamingService: StreamingService,
    private readonly songsService: SongsService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { songId, filePath, fileName } = job.data;
    this.logger.log(`Processing song ${songId}...`);

    try {
      const outputDir = join(process.cwd(), 'uploads');
      const streamingDir = join(outputDir, 'streaming');

      // 1. Extraer Metadatos Reales
      const metadata = await musicMetadata.parseFile(filePath);
      const duration = Math.round(metadata.format.duration || 0);
      
      // 2. Generar HLS Adaptive
      const hlsPath = await this.streamingService.transcodeToHLS(filePath, streamingDir, songId);
      
      // 3. Generar Short Clip (Hook) — Default: 20s to 50s
      const shortUrl = await this.streamingService.getHookClip(filePath, outputDir, songId);
      
      // 4. Generar Waveform Data (JSON representation)
      const waveformData = await this.streamingService.getWaveformData(filePath);
      const waveformJson = JSON.stringify(waveformData);

      // 5. Actualizar registro en DB con todos los campos enterprise
      await this.songsService.updateInternal(songId, {
        duration,
        audioUrl: hlsPath,
        waveform: waveformJson,
        hookStart: 20,
        hookEnd: 50,
      });

      this.logger.log(`Processing complete for song ${songId}`);
      return { hlsPath, shortUrl, duration, waveformData };
    } catch (error) {
      this.logger.error(`Failed to process song ${songId}: ${error.message}`);
      throw error;
    }
  }
}
