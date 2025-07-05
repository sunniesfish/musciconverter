import { Module, Global } from '@nestjs/common';
import { GoogleAuthService } from 'src/auth/providers/google/google-auth.service';
import { SpotifyAuthService } from 'src/auth/providers/spotify/spotify-auth.service';
import { OAuthErrorInterceptor } from 'src/auth/core/interceptors/oauth-error.interceptor';
import { OAuthInterceptor } from 'src/auth/core/interceptors/oauth.interceptor';

@Global()
@Module({
  providers: [
    GoogleAuthService,
    SpotifyAuthService,
    OAuthErrorInterceptor,
    OAuthInterceptor,
  ],
  exports: [
    GoogleAuthService,
    SpotifyAuthService,
    OAuthErrorInterceptor,
    OAuthInterceptor,
  ],
})
export class AuthModule {}
