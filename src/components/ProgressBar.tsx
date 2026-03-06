import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;       // 0 - 100
  height?: number;     // 高度 px
}

export default function ProgressBar({ value, height = 10 }: ProgressBarProps) {
  return (
    <div
      className="w-full bg-white rounded-full overflow-hidden"
      style={{ height }}
    >
      <motion.div
        className="h-full rounded-full
                   bg-gradient-to-r from-pink-400 to-red-400"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      />
    </div>
  );
}
