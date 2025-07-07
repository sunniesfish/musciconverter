import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useConvertingStore } from "@/lib/store/converting.store";
import { useShallow } from "zustand/react/shallow";
import { useOAuth2Store } from "@/lib/store/oauth2.store";
import { Loader2 } from "lucide-react";
import type { PlaylistConvertResponse } from "@repo/shared";
const songsListMobileVarient = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

export function SongsListMobile() {
  const { apiDomain } = useConvertingStore(
    useShallow((state) => state.apiDomain)
  );
  const { link } = useOAuth2Store(useShallow((state) => state.link));
  const { data, isPending } = useQuery<PlaylistConvertResponse>({
    queryKey: ["convert", [link, apiDomain]],
  });

  return (
    <motion.div
      variants={songsListMobileVarient}
      initial="initial"
      animate="animate"
      className="bg-red-500"
    >
      {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isPending && data ? <div></div> : <div>No data</div>}
    </motion.div>
  );
}
