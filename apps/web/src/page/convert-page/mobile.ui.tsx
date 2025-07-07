import { useConvertingStore } from "@/lib/store/converting.store";
import { motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";

const convertPageMobileVarient = {
  initial: { y: "100vh" },
  animate: {
    y: "0vh",
    transition: { type: "spring", bounce: 0.15, duration: 0.4 },
  },
};

export function ConvertPageMobileUI() {
  const { isSubmitted } = useConvertingStore(
    useShallow((state) => ({
      isSubmitted: state.isSubmitted,
    }))
  );

  return (
    <div className="flex flex-col w-full h-[120vh]">
      {isSubmitted && (
        <motion.div
          variants={convertPageMobileVarient}
          initial="initial"
          animate="animate"
          className="bg-blue-900 mt-5 w-full h-full"
        />
      )}
    </div>
  );
}
