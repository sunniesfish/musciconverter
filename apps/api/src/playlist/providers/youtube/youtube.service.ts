import { Inject, Injectable } from '@nestjs/common';
import {
  ConvertedPlaylist,
  PlaylistJSON,
} from '../../common/dto/playlists.dto';
import { ScraperService } from '../scraper/scraper.service';
import { GoogleAuthService } from 'src/auth/providers/google/google-auth.service';
import { YouTubeApiClient } from './client/youtube-api.client';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class YouTubeService {
  constructor(
    @Inject()
    private readonly youtubeApiClient: YouTubeApiClient,
    @Inject()
    private readonly scraperService: ScraperService,
    @Inject()
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  private async executeWithAuth<T>(
    accessToken: string,
    operation: (oauth2Client: OAuth2Client) => Promise<T>,
  ): Promise<T> {
    const oauth2Client =
      await this.googleAuthService.getOAuthClient(accessToken);
    return await operation(oauth2Client);
  }

  async convertToYoutubePlaylist(
    accessToken: string,
    playlistJSON: PlaylistJSON[],
  ): Promise<ConvertedPlaylist> {
    const playlistId = await this.executeWithAuth(
      accessToken,
      async (oauth2Client) => {
        return this.youtubeApiClient.createPlaylist(
          oauth2Client,
          'New Playlist ' + new Date().toISOString(),
        );
      },
    );

    await this.processSongs(playlistId, playlistJSON, accessToken);
    return {
      success: true,
      message: 'Playlist converted successfully',
      playlist: {
        listJson: playlistJSON,
      },
      playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
    };
  }

  private async processSongs(
    playlistId: string,
    songs: PlaylistJSON[],
    accessToken: string,
  ): Promise<void> {
    for (let i = 0; i < songs.length; i++) {
      await this.processOneSong(playlistId, songs[i], accessToken);
    }
  }

  private async processOneSong(
    playlistId: string,
    song: PlaylistJSON,
    accessToken: string,
  ): Promise<void> {
    const searchQuery = `${song.title} ${song.artist}`;
    const videoId = await this.executeWithAuth(
      accessToken,
      async (oauth2Client) => {
        return this.youtubeApiClient.searchVideo(oauth2Client, searchQuery);
      },
    );
    if (videoId) {
      await this.executeWithAuth(accessToken, async (oauth2Client) => {
        return this.youtubeApiClient.addToPlaylist(
          oauth2Client,
          playlistId,
          videoId,
        );
      });
    }
  }

  isYoutubeUrl(link: string) {
    return link.includes('youtube.com') || link.includes('youtu.be');
  }

  async readYoutubePlaylist(link: string): Promise<PlaylistJSON[]> {
    return this.scraperService.scrape(
      link,
      'ytd-playlist-video-renderer',
      async () => {
        const trackRows = document.querySelectorAll(
          'ytd-playlist-video-renderer',
        );
        return Array.from(trackRows).map((row) => {
          const titleElement = row.querySelector('#video-title');
          const title = titleElement?.textContent?.trim() || '';

          const channelElement = row.querySelector(
            'ytd-channel-name yt-formatted-string a',
          );
          const artist = channelElement?.textContent?.trim() || '';
          return {
            title: title ? title : 'no title',
            artist: artist ? artist : 'no artist',
          };
        });
      },
    );
  }
}
