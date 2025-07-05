import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SpotifyAuthService } from 'src/auth/providers/spotify/spotify-auth.service';
import { GoogleAuthService } from 'src/auth/providers/google/google-auth.service';
import { OAuthorizationError } from 'src/auth/common/errors/oauth.errors';
import { ApiDomain } from '../../common/enums/api-domain.enum';
import { ConvertPlaylistRequest } from 'src/playlist/common/dto/playlists.dto';
import { ExtendedRequest } from 'src/global/interfaces/convert-context.interface';

@Injectable()
export class OAuthErrorInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly googleAuthService: GoogleAuthService,
    private readonly spotifyAuthService: SpotifyAuthService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<ExtendedRequest>();

    const body = req.body as ConvertPlaylistRequest;

    const { apiDomain, state } = body;

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof OAuthorizationError) {
          if (apiDomain === ApiDomain.SPOTIFY) {
            return of({
              needsAuth: true,
              authUrl: this.spotifyAuthService.getAuthUrl({
                state: state,
              }),
              apiDomain: apiDomain,
            });
          }
          if (apiDomain === ApiDomain.YOUTUBE) {
            return of({
              needsAuth: true,
              authUrl: this.googleAuthService.getAuthUrl({
                state: state,
              }),
              apiDomain: apiDomain,
            });
          }
        }

        return throwError(() => error);
      }),
    );
  }
}
