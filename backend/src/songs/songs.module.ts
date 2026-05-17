import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { StreamingModule } from '../modules/streaming/streaming.module';

@Module({
  imports: [
    StreamingModule,
  ],
  providers: [SongsService],
  controllers: [SongsController],
  exports: [SongsService]
})
export class SongsModule {}
