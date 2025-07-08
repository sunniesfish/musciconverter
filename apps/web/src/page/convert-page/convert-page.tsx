import { useViewType } from "../../lib/hooks/use-viewtype";

import { ViewType } from "../../lib/hooks/use-viewtype";

import {
  ConvertLinkButtonMobile,
  ConvertLinkForm,
} from "../../assets/convert-link.form.common";

import { SongsListMobile } from "../../assets/mobile/songs.list.mobile";
import { ConvertPageMobileUI } from "./mobile.ui";
import { ConvertPageDesktopUI } from "./desktop.ui";
import { cn } from "@/lib/utils";
import { SongListDesktop } from "../../assets/desktop/song.list.desktop";
import { UIWrapper } from "../../assets/ui.wrapper";
import { motion } from "motion/react";
import { useMatch } from "react-router";
export default function ConvertPage() {
  const isMobile = useViewType(ViewType.Mobile);
  const isSubmitted = useMatch("/converted");

  return (
    <>
      {/* main content */}
      <div className="flex w-full h-full pt-10">
        <motion.div
          className={cn(
            // !isMobile && "max-w-[70%]",
            "bg-transparent",
            "flex flex-col gap-4 grow h-full"
          )}
        >
          <ConvertLinkForm isMobile={isMobile} />
          {isMobile && isSubmitted && <SongsListMobile />}
          {isMobile && <ConvertLinkButtonMobile />}
        </motion.div>

        {/* desktop only song list */}
        {!isMobile && isSubmitted && <SongListDesktop />}
      </div>

      {/* for ui */}
      <UIWrapper className={cn(!isMobile && "max-w-[30%]", "bg-transparent")}>
        {isMobile ? <ConvertPageMobileUI /> : <ConvertPageDesktopUI />}
      </UIWrapper>
    </>
  );
}
