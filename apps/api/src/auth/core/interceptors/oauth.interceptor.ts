import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ApiDomain } from '../../common/enums/api-domain.enum';
import { SpotifyAuthService } from 'src/auth/providers/spotify/spotify-auth.service';
import { GoogleAuthService } from 'src/auth/providers/google/google-auth.service';
import { OAuth2TokenResponse } from '../../common/interfaces/oauth.interface';
import { OAuthorizationError } from 'src/auth/common/errors/oauth.errors';
import { ConvertPlaylistRequest } from 'src/playlist/common/dto/playlists.dto';
import { ExtendedRequest } from 'src/global/interfaces/convert-context.interface';

/**
 * Interceptor that handles OAuth2 authentication for different API domains (YouTube, Spotify)
 * Validates access tokens and handles token refresh using authorization codes
 */
@Injectable()
export class OAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly googleAuthService: GoogleAuthService,
    private readonly spotifyAuthService: SpotifyAuthService,
  ) {}

  /**
   * Intercepts the request and handles OAuth2 authentication
   * @param context - Execution context containing the request information
   * @param next - Call handler to continue request processing
   * @returns Observable of the response
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<ExtendedRequest>();

    const body = req.body as ConvertPlaylistRequest;

    const { apiDomain, authorizationCode: authCode } = body;

    if (authCode) {
      const authResponse = await this.getNewToken(apiDomain, authCode);
      this.setAccessTokenToContext(req, authResponse.access_token);
      return next.handle();
    }

    // if (userId) {
    //   const authResponse = await this.refreshAccessToken(apiDomain, userId);
    //   this.setAccessTokenToContext(req, authResponse.access_token);
    //   return next.handle();
    // }

    return next.handle();
  }

  /**
   * Retrieves a new OAuth2 token using the authorization code
   * @param apiDomain - API domain to get the token for (YouTube or Spotify)
   * @param authCode - Authorization code from OAuth2 callback
   * @param userId - Optional user ID to associate with the token
   * @returns Promise resolving to OAuth2TokenResponse containing the new tokens
   * @throws UnauthorizedException for invalid API domains
   */
  private async getNewToken(
    apiDomain: ApiDomain,
    authCode: string,
    // userId: string | undefined,
  ): Promise<OAuth2TokenResponse> {
    try {
      if (apiDomain === ApiDomain.YOUTUBE) {
        return await this.googleAuthService.getToken({
          code: authCode,
          state: 'state',
        });
      }
      if (apiDomain === ApiDomain.SPOTIFY) {
        return await this.spotifyAuthService.getToken({
          code: authCode,
          state: 'state',
        });
      }
      throw new UnauthorizedException('Invalid API domain');
    } catch {
      throw new OAuthorizationError('Failed to get token');
    }
  }

  // private async refreshAccessToken(
  //   apiDomain: ApiDomain,
  //   userId: string,
  // ): Promise<OAuth2TokenResponse> {
  //   if (apiDomain === ApiDomain.YOUTUBE) {
  //     return await this.googleAuthService.refreshAccessToken(userId);
  //   }
  //   if (apiDomain === ApiDomain.SPOTIFY) {
  //     return await this.spotifyAuthService.refreshAccessToken(userId);
  //   }
  //   throw new UnauthorizedException('Invalid API domain');
  // }

  private setAccessTokenToContext(req: ExtendedRequest, accessToken: string) {
    req.api_accessToken = accessToken;
  }
}
