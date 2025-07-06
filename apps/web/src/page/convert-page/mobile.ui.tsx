import { useConvertingStore } from "@/lib/store/converting.store";
import { useShallow } from "zustand/react/shallow";

export function ConvertPageMobileUI() {
  const { isSubmitted } = useConvertingStore(
    useShallow((state) => state.isSubmitted)
  );

  return <div className=""></div>;
}
