import type {
  AppResponse,
  ConvertPlaylistRequest,
  PlaylistConvertResponse,
  ApiError,
} from "@repo/shared";

// API 기본 URL (환경변수로 관리하는 것을 권장)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// API 에러 클래스
class ApiErrorClass extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 기본 fetch 래퍼 함수
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new ApiErrorClass(
        response.status,
        errorData.message || "API 요청 실패",
        errorData.error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiErrorClass) {
      throw error;
    }
    throw new ApiErrorClass(500, "네트워크 오류가 발생했습니다.");
  }
}

export const api = {
  getAppStatus: async (): Promise<AppResponse> => {
    return fetchApi<AppResponse>("/");
  },

  convertPlaylist: async (
    requestData: ConvertPlaylistRequest,
    accessToken?: string
  ): Promise<PlaylistConvertResponse> => {
    const headers: Record<string, string> = {};

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetchApi<PlaylistConvertResponse>("/playlist/convert", {
      method: "POST",
      headers,
      body: JSON.stringify(requestData),
    });
  },
};

// 개별 함수들도 내보내기 (선택적)
export const getAppStatus = api.getAppStatus;
export const convertPlaylist = api.convertPlaylist;

// 에러 타입 내보내기
export { ApiErrorClass as ApiError };
