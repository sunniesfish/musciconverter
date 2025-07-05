import { ApiDomain } from 'src/auth/common/enums/api-domain.enum';

export class Playlist {
  listJson?: PlaylistJSON[];
}

/**
 * @description
 * 1. PlaylistJSON
 */

export class PlaylistJSON {
  title?: string;

  artist?: string;

  album?: string;

  thumbnail?: string;
}

export class ConvertPlaylistRequest {
  userId?: string;
  apiDomain: ApiDomain;
  state?: string;
  authorizationCode?: string;
  link?: string;
}

export class ConvertedPlaylist {
  success: boolean;

  message: string;

  playlistUrl: string;

  playlist: Playlist;
}

export class AuthRequiredResponse {
  needsAuth: boolean;

  authUrl: string;

  apiDomain: ApiDomain;
}
