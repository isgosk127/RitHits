import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { MediaProcessor } from './media.processor';
import { SongsModule } from '../../songs/songs.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => SongsModule),
  ],
  providers: [StreamingService, MediaProcessor],
  controllers: [StreamingController],
  exports: [StreamingService, MediaProcessor],
})
export class StreamingModule {}
