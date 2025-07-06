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
import { ApiDomain } from "@repo/shared";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";

export function ConvertLinkForm() {
  const [link, setLink] = useState("");

  const { apiDomain, setIsConverting } = useConvertingStore(
    useShallow((state) => state)
  );
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.convertPlaylist({ link, apiDomain }),
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  useEffect(() => {
    setIsConverting(isPending);
  }, [isPending, setIsConverting]);

  return (
    <motion.form id="convert-link-form" onSubmit={handleSubmit} className="">
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter link"
      />
    </motion.form>
  );
}

export function ConvertLinkButton() {
  const { isConverting } = useConvertingStore(useShallow((state) => state));

  return (
    <motion.div className="">
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
