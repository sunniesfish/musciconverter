// API 도메인 열거형
export enum ApiDomain {
  SPOTIFY = "spotify",
  YOUTUBE = "youtube",
}

// 플레이리스트 JSON 인터페이스
export interface PlaylistJSON {
  title?: string;
  artist?: string;
  album?: string;
  thumbnail?: string;
}

// 플레이리스트 인터페이스
export interface Playlist {
  listJson?: PlaylistJSON[];
}

// 플레이리스트 변환 요청 인터페이스
export interface ConvertPlaylistRequest {
  userId?: string;
  apiDomain: ApiDomain;
  state?: string;
  authorizationCode?: string;
  link?: string;
}

// 변환된 플레이리스트 응답 인터페이스
export interface ConvertedPlaylist {
  success: boolean;
  message: string;
  playlistUrl: string;
  playlist: Playlist;
}

// 인증 필요 응답 인터페이스
export interface AuthRequiredResponse {
  needsAuth: boolean;
  authUrl: string;
  apiDomain: ApiDomain;
}

// API 응답 타입 (유니온 타입)
export type PlaylistConvertResponse = ConvertedPlaylist | AuthRequiredResponse;

// 기본 앱 응답 인터페이스
export interface AppResponse {
  message: string;
}

// API 에러 인터페이스
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
