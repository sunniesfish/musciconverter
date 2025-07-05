import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ConvertedPlaylist,
  PlaylistJSON,
} from 'src/playlist/common/dto/playlists.dto';
import { YouTubeService } from '../../providers/youtube/youtube.service';
import { SpotifyService } from '../../providers/spotify/spotify.service';
import { ApiDomain } from 'src/auth/common/enums/api-domain.enum';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly youtubeService: YouTubeService,
  ) {}

  async convertPlaylist(
    apiDomain: ApiDomain,
    apiAccessToken: string,
    playlistJSON: PlaylistJSON[],
  ): Promise<ConvertedPlaylist> {
    switch (apiDomain) {
      case ApiDomain.SPOTIFY:
        return await this.spotifyService.convertToSpotifyPlaylist(
          apiAccessToken,
          playlistJSON,
        );
      case ApiDomain.YOUTUBE:
        return await this.youtubeService.convertToYoutubePlaylist(
          apiAccessToken,
          playlistJSON,
        );
      default:
        throw new BadRequestException('Invalid API domain');
    }
  }

  async read(link: string): Promise<PlaylistJSON[]> {
    if (!link) {
      throw new Error('Please provide a valid URL');
    }

    const isSpotify = this.spotifyService.isSpotifyUrl(link);

    if (isSpotify) {
      return await this.spotifyService.readSpotifyPlaylist(link);
    }

    const isYoutube = this.youtubeService.isYoutubeUrl(link);

    if (isYoutube) {
      return await this.youtubeService.readYoutubePlaylist(link);
    }

    throw new Error('Please provide a valid Spotify or YouTube URL');
  }
}
