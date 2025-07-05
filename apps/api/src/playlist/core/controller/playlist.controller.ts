import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { PlaylistService } from '../services/playlist.service';
import {
  ConvertPlaylistRequest,
  ConvertedPlaylist,
  PlaylistJSON,
} from 'src/playlist/common/dto/playlists.dto';
import { OAuthErrorInterceptor } from 'src/auth/core/interceptors/oauth-error.interceptor';
import { OAuthInterceptor } from 'src/auth/core/interceptors/oauth.interceptor';
import { PlatformError } from 'src/playlist/common/errors/platform.errors';
import { AuthRequiredResponse } from 'src/playlist/common/dto/playlists.dto';
import { ApiAccessToken } from 'src/global/decorators/api-access-token.decorator';
import { OAuthenticationError } from 'src/auth/common/errors/oauth.errors';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseInterceptors(OAuthErrorInterceptor, OAuthInterceptor)
  @Post('convert')
  async convertPlaylistRequest(
    @Body() body: ConvertPlaylistRequest,
    @ApiAccessToken() apiAccessToken: string,
  ): Promise<ConvertedPlaylist | AuthRequiredResponse> {
    const { link, apiDomain }: ConvertPlaylistRequest = body;
    if (!apiAccessToken) {
      throw new OAuthenticationError('No access token found');
    }

    if (!link) {
      throw new OAuthenticationError('No link found');
    }
    try {
      const listJson = await this.readPlaylist(link);
      return await this.playlistService.convertPlaylist(
        apiDomain,
        apiAccessToken,
        listJson,
      );
    } catch (error) {
      if (error instanceof OAuthenticationError) {
        throw new OAuthenticationError(error.message);
      }
      throw new PlatformError('PLAYLIST_CONVERSION_ERROR');
    }
  }

  private async readPlaylist(link: string): Promise<PlaylistJSON[]> {
    try {
      return await this.playlistService.read(link);
    } catch (error) {
      if (error.message.includes('Playlist not found')) {
        throw new PlatformError('PLAYLIST_NOT_FOUND');
      }
      throw error;
    }
  }
}
