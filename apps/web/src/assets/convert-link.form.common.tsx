import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useConvertingStore } from "@/lib/store/converting.store";
import {
  ApiDomain,
  type ConvertPlaylistRequest,
  type PlaylistConvertResponse,
} from "@repo/shared";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { cn, validateOAuthState } from "@/lib/utils";
import { useOAuth2Store } from "@/lib/store/oauth2.store";
import { handleOAuthCallback } from "@/lib/utils";
import { useOAuthMessage } from "@/lib/hooks/use-oauth";
import { v4 as uuidv4 } from "uuid";

const convertLinkFormVarient = {
  defaultMobile: { y: (window.innerHeight * 2) / 9 },
  defaultDesktop: { y: (window.innerHeight * 2) / 9 },
  submittedMobile: { y: 0 },
  submittedDesktop: { y: 0 },
  transitionMobile: {
    type: "tween" as const,
    duration: 0.4,
  },
  transitionDesktop: {
    type: "tween" as const,
    duration: 0.4,
  },
};

export function ConvertLinkForm({ isMobile }: { isMobile: boolean }) {
  const queryClient = useQueryClient();
  const [link, setLink] = useState("");
  const {
    setLink: setLinkFromOAuth2Store,
    state,
    setState,
  } = useOAuth2Store(
    useShallow((state) => ({
      link: state.link,
      setLink: state.setLink,
      state: state.state,
      setState: state.setState,
    }))
  );

  const { apiDomain, setIsConverting, setIsSubmitted, isSubmitted } =
    useConvertingStore(
      useShallow((state) => ({
        apiDomain: state.apiDomain,
        setIsConverting: state.setIsConverting,
        setIsSubmitted: state.setIsSubmitted,
        isSubmitted: state.isSubmitted,
      }))
    );
  const { mutate, isPending } = useMutation<
    PlaylistConvertResponse,
    Error,
    ConvertPlaylistRequest
  >({
    mutationKey: ["convert", [link, apiDomain]],
    mutationFn: ({ link, apiDomain }: ConvertPlaylistRequest) =>
      api.convertPlaylist({ link, apiDomain }),
    onSuccess: (response) => {
      if ("playlist" in response) {
        queryClient.setQueryData(["convert", [link, apiDomain]], response);
        return;
      }
      if ("authUrl" in response) {
        handleOAuthCallback(response);
        return;
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useOAuthMessage(
    {
      onSuccess: async (authCode, receivedState) => {
        try {
          if (!state) {
            throw new Error("State is null");
          }
          if (!validateOAuthState(state, receivedState)) {
            throw new Error("Invalid state");
          }
          mutate({
            link: link,
            apiDomain,
            authorizationCode: authCode,
            state: JSON.stringify(state),
          });
        } catch (error) {
          console.error(error);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    },
    apiDomain,
    [state]
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!link) return;
    const newState = { domain: apiDomain, id: uuidv4() };
    setState(newState);
    setLinkFromOAuth2Store(link);
    mutate({ link, apiDomain });
    setIsSubmitted(true);
  };

  useEffect(() => {
    setIsConverting(isPending);
  }, [isPending, setIsConverting]);

  return (
    <motion.form
      variants={convertLinkFormVarient}
      initial={isMobile ? "defaultMobile" : "defaultDesktop"}
      animate={
        isMobile
          ? isSubmitted
            ? "submittedMobile"
            : "defaultMobile"
          : isSubmitted
            ? "submittedDesktop"
            : "defaultDesktop"
      }
      transition={
        isMobile
          ? convertLinkFormVarient.transitionMobile
          : convertLinkFormVarient.transitionDesktop
      }
      id="convert-link-form"
      onSubmit={handleSubmit}
      className={cn(isMobile ? "" : "", "flex justify-center w-full")}
    >
      <Input
        className={cn("bg-amber-400", isMobile ? " w-10/12" : "w-5/12")}
        type="text"
        value={link ?? ""}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter link"
      />
      {!isMobile && <ConvertLinkButtonDesktop />}
    </motion.form>
  );
}

const convertLinkButtonVarient = {
  defaultMobile: { y: (window.innerHeight * 2) / 6 },
  defaultDesktop: { y: (window.innerHeight * 2) / 9 },
  submittedMobile: { y: (window.innerHeight * 7) / 9 },
  submittedDesktop: { y: 0 },
};

export function ConvertLinkButtonMobile() {
  const { isConverting } = useConvertingStore(useShallow((state) => state));
  const isSubmitted = useConvertingStore(
    useShallow((state) => state.isSubmitted)
  );
  return (
    <motion.div
      variants={convertLinkButtonVarient}
      initial={"defaultMobile"}
      animate={isSubmitted ? "submittedMobile" : "defaultMobile"}
      className="absolute w-full flex justify-center"
    >
      <Button type="submit" form="convert-link-form">
        {isConverting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Convert"
        )}
      </Button>
      <ApiDomainSwitcher />
    </motion.div>
  );
}

export function ConvertLinkButtonDesktop() {
  const { isConverting } = useConvertingStore(useShallow((state) => state));

  return (
    <motion.div className="flex justify-cente">
      <Button type="submit" form="convert-link-form">
        {isConverting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Convert"
        )}
      </Button>
      <ApiDomainSwitcher />
    </motion.div>
  );
}

export default function ApiDomainSwitcher() {
  const { apiDomain, setApiDomain } = useConvertingStore(
    useShallow((state) => state)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg">
        <Avatar className="rounded-lg h-8 w-8">
          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
            {apiDomain[0]}
          </AvatarFallback>
        </Avatar>
        <div className="text-start flex flex-col gap-1 leading-none">
          <span className="text-sm leading-none font-semibold truncate max-w-[17ch]">
            {apiDomain}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[20ch]">
            {apiDomain}
          </span>
        </div>
        <ChevronsUpDown className="ml-6 h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="start">
        <DropdownMenuLabel>Api Domain</DropdownMenuLabel>
        {Object.values(ApiDomain).map((apiDomain) => (
          <DropdownMenuItem
            key={apiDomain}
            onClick={() => setApiDomain(apiDomain)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="rounded-md h-8 w-8">
                <AvatarFallback className="rounded-md bg-primary/10 text-foreground">
                  {apiDomain[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{apiDomain}</span>
                <span className="text-xs text-muted-foreground">
                  {apiDomain}
                </span>
              </div>
            </div>
            {apiDomain === apiDomain && <Check className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
