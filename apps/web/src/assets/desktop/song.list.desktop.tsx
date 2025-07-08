import { useOAuth2Store } from "@/lib/store/oauth2.store";
import type { PlaylistConvertResponse } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";

const songsListDesktopVarient = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

export function SongListDesktop() {
  const { apiDomain, link } = useOAuth2Store(
    useShallow((state) => ({
      apiDomain: state.apiDomain,
      link: state.link,
    }))
  );
  const { data, isPending } = useQuery<PlaylistConvertResponse>({
    queryKey: ["convert", [link, apiDomain]],
  });

  return (
    <motion.div
      variants={songsListDesktopVarient}
      initial="initial"
      animate="animate"
      className="bg-red-500"
    >
      {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isPending && data && "playlist" in data ? (
        <div>
          {data.playlist.listJson?.map((song, index) => (
            <div key={index + (song.title ?? "")}>{song.title}</div>
          ))}
        </div>
      ) : (
        <div>No data</div>
      )}
    </motion.div>
  );
}
