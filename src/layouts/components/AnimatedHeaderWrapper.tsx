import { ReactNode, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface AnimatedHeaderWrapperProps {
  children: ReactNode; // 自定义 Header
  hideThreshold?: number; // 滚动多少像素才触发隐藏
}

export default function AnimatedHeaderWrapper({
  children,
  hideThreshold = 50, // 默认滚动超过50px才隐藏
}: AnimatedHeaderWrapperProps) {
  const controls = useAnimation();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);

  // 页面加载时显示 Header
  useEffect(() => {
    controls.set({ y: 0, opacity: 1 });
  }, [controls]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // 只在超过阈值时才判断隐藏/显示
      if (currentY > hideThreshold) {
        if (currentY > lastScrollY && !hidden) {
          // 向下滚动 -> 隐藏
          controls.start({ y: -100, opacity: 0 });
          setHidden(true);
        } else if (currentY < lastScrollY && hidden) {
          // 向上滚动 -> 显示
          controls.start({ y: 0, opacity: 1 });
          setHidden(false);
        }
      } else {
        // 未超过阈值，确保 Header 显示
        if (hidden) {
          controls.start({ y: 0, opacity: 1 });
          setHidden(false);
        }
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, hidden, controls, hideThreshold]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-50"
      initial={false} // 初始不隐藏
      animate={controls}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}
