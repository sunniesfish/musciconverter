import { cn } from "@/lib/utils";

export function UIWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute -z-10 top-0 left-0 w-full h-full overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
