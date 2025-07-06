import { useViewType } from "../../lib/hooks/use-viewtype";

import { ViewType } from "../../lib/hooks/use-viewtype";

import {
  ConvertLinkButton,
  ConvertLinkForm,
} from "../../assets/convert-link.form.common";
import { useShallow } from "zustand/react/shallow";
import { useConvertingStore } from "@/lib/store/converting.store";
import { SongsListMobile } from "../../assets/mobile/songs.list.mobile";
import { ConvertPageMobileUI } from "./mobile.ui";
import { ConvertPageDesktopUI } from "./desktop.ui";
import { cn } from "@/lib/utils";
import { SongListDesktop } from "../../assets/desktop/song.list.desktop";
import { UIWrapper } from "../../assets/ui.wrapper";
export default function ConvertPage() {
  const isMobile = useViewType(ViewType.Mobile);
  const { isSubmitted } = useConvertingStore(
    useShallow((state) => ({
      isSubmitted: state.isSubmitted,
    }))
  );

  return (
    <>
      <div className="absolute top-0 left-0">
        {isMobile ? "Mobile" : "Desktop"}
      </div>

      {/* main content */}
      <div
        className={cn(
          // !isMobile && "max-w-[70%]",
          "bg-blue-200",
          "flex flex-col gap-4 w-full h-full"
        )}
      >
        <ConvertLinkForm />
        {isMobile && isSubmitted && <SongsListMobile />}
        <ConvertLinkButton />
      </div>

      {/* desktop only song list */}
      {!isMobile && <SongListDesktop />}

      {/* for ui */}
      <UIWrapper className={cn(!isMobile && "max-w-[30%]", "bg-gray-200")}>
        {isMobile ? <ConvertPageMobileUI /> : <ConvertPageDesktopUI />}
      </UIWrapper>
    </>
  );
}
