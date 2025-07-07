import type { PlaylistConvertResponse, PlaylistJSON } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export function SongListDesktop() {
  const { data, isPending } = useQuery<PlaylistConvertResponse>({
    queryKey: ["convert"],
  });

  // 타입 가드: ConvertedPlaylist인지 확인
  const isConvertedPlaylist = data && "playlist" in data;

  return (
    <div>
      {isPending
        ? "Loading..."
        : isConvertedPlaylist
          ? data.playlist.listJson?.map((song: PlaylistJSON) => (
              <div key={song.title}>
                <h1>{song.title}</h1>
                <p>{song.artist}</p>
              </div>
            ))
          : "No playlist data"}
    </div>
  );
}
