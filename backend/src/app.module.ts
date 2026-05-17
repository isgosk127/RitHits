import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { PrismaModule } from './prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { SearchModule } from './modules/search/search.module';
import { StreamingModule } from './modules/streaming/streaming.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { FollowsModule } from './modules/follows/follows.module';
import { LikesModule } from './modules/likes/likes.module';
import { RadioModule } from './modules/radio/radio.module';

@Module({
  imports: [
    // Rate Limiting: 100 peticiones cada 60 segundos
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 1000,
    }]),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    SongsModule,

    // Static assets (audio, covers)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // Feature modules
    StreamingModule,
    AnalyticsModule,
    RecommendationsModule,
    SearchModule,

    // Enterprise modules (new)
    AlbumsModule,
    PlaylistsModule,
    FollowsModule,
    LikesModule,
    RadioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
