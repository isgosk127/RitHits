import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { PrismaModule } from '../../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
