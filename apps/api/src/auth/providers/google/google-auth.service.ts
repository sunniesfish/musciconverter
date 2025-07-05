import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { OAuth2Service } from 'src/auth/core/services/oauth2.service';

import {
  OAuth2AuthResponse,
  OAuth2TokenResponse,
  OAuth2AuthOptions,
} from '../../common/interfaces/oauth.interface';
import { OAuthorizationError } from '../../common/errors/oauth.errors';
import { ConfigService } from '@nestjs/config';
import { createGoogleAuthConfig, GoogleAuthConfig } from './google.auth.config';
import { GOOGLE_OAUTH_SCOPES } from '../../common/constants/oauth-scope.constant';

@Injectable()
export class GoogleAuthService extends OAuth2Service {
  private readonly config: GoogleAuthConfig;
  constructor(private readonly configService: ConfigService) {
    super();
    this.config = createGoogleAuthConfig(this.configService);
  }

  /**
   * create oauth2 client
   * @returns oauth2 client
   */
  private createOAuthClient(): OAuth2Client {
    return new OAuth2Client(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri,
    );
  }

  async getOAuthClient(accessToken: string): Promise<OAuth2Client> {
    const oauth2Client = this.createOAuthClient();

    oauth2Client.setCredentials({
      access_token: accessToken,
      scope: GOOGLE_OAUTH_SCOPES.YOUTUBE.join(' '),
    });

    return oauth2Client;
  }
  /**
   * create auth url
   * @returns auth url
   */
  getAuthUrl(options?: OAuth2AuthOptions): string {
    const oauth2Client = this.createOAuthClient();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_OAUTH_SCOPES.YOUTUBE,
      prompt: 'consent',
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      state: options?.state,
    });
  }

  /**
   * get access token and refresh token
   * @param authResponse - auth response
   * @param userId - user id
   * @returns OAuth2TokenResponse
   */
  async getToken(
    authResponse: OAuth2AuthResponse,
    // userId: string | null,
  ): Promise<OAuth2TokenResponse> {
    const oauth2Client = this.createOAuthClient();
    try {
      const { tokens } = await oauth2Client.getToken(authResponse.code);
      if (
        !tokens.access_token ||
        !tokens.refresh_token ||
        !tokens.expiry_date ||
        !tokens.token_type
      ) {
        throw new OAuthorizationError('Failed to get token');
      }
      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expiry_date,
        token_type: tokens.token_type,
      };
    } catch {
      throw new OAuthorizationError('Failed to get token');
    }
  }

  /**
   * refresh access token
   * @param userId - user id
   * @returns OAuth2TokenResponse
   */
  async refreshAccessToken(): Promise<OAuth2TokenResponse> {
    // const oauth2Client = this.createOAuthClient();

    // return await this.firestore.runTransaction(async (transaction) => {
    //   const user = await this.userService.findOne(
    //     userId,
    //     ['youtubeCredentials'],
    //     transaction,
    //   );
    //   if (!user) {
    //     throw new OAuthorizationError('User not found');
    //   }

    //   oauth2Client.setCredentials({
    //     refresh_token: user.youtubeCredentials.refreshToken,
    //   });

    //   const { credentials: newCredentials } =
    //     await oauth2Client.refreshAccessToken();

    //   await this.userService.update(
    //     {
    //       userId,
    //       youtubeCredentials: {
    //         refreshToken: newCredentials.refresh_token,
    //         scope: newCredentials.scope,
    //         tokenType: newCredentials.token_type,
    //         expiryDate: newCredentials.expiry_date,
    //       },
    //     },
    //     transaction,
    //   );
    //   return {
    //     access_token: newCredentials.access_token,
    //     refresh_token: newCredentials.refresh_token,
    //     expires_in: newCredentials.expiry_date,
    //     token_type: newCredentials.token_type,
    //   };
    // });
    return {
      access_token: '',
      refresh_token: '',
      expires_in: 0,
      token_type: '',
    };
  }

  /**
   * sign out
   * @param userId - user id
   */
  async signOut(): Promise<void> {
    // await this.userService.update({
    //   userId,
    //   youtubeCredentials: {
    //     expiryDate: 0,
    //     refreshToken: null,
    //     scope: null,
    //     tokenType: null,
    //   },
    // });
  }
}
