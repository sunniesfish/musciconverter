import { Module } from '@nestjs/common';
import { PlaylistService } from './core/services/playlist.service';
import { SpotifyModule } from './providers/spotify/spotify.module';
import { YouTubeModule } from './providers/youtube/youtube.module';
import { PlaylistController } from './core/controller/playlist.controller';
@Module({
  imports: [SpotifyModule, YouTubeModule],
  providers: [PlaylistService, PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
