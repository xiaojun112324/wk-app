import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";


interface BroadcastMarqueeProps {
  messages: string[];
  speed?: number; // px/s，默认 50
  separator?: string;
  icon?: React.ReactNode;
}

const BroadcastMarquee: React.FC<BroadcastMarqueeProps> = ({
  messages,
  speed = 50,
  separator = " ｜ ",
  icon,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const { t, i18n } = useTranslation();

  const combinedMessage = messages.join(separator);

  // 初始化内容宽度
  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, [combinedMessage]);

  // 连续偏移动画（无跳动）
  useAnimationFrame((_, delta) => {
    if (contentWidth === 0) return;
    setOffset((prev) => {
      const next = prev - (speed * delta) / 1000;
      return next <= -contentWidth ? 0 : next;
    });
  });

  return (
    <div
      ref={containerRef}
      className="relative flex items-center overflow-hidden w-full bg-gray py-3 px-4 rounded-2xl"
    >
      {/* 图标 */}
      {icon ? (
        <div className="mr-2 shrink-0 z-10">{icon}</div>
      ) : (
        <div className="flex items-center pr-1">
          <div className="pr-1  text-center text-xs  whitespace-nowrap">
            <SpeakerWaveIcon className="size-4 text-[#f9ae3d]" />
          </div>

        </div>
      )}

      {/* 滚动内容 */}
      <div className="relative w-full overflow-hidden text-[#f9ae3d] text-sm whitespace-nowrap">
        <motion.div className="flex" style={{ x: offset }}>
          <div
            ref={contentRef}
            className="mr-8"
            dangerouslySetInnerHTML={{ __html: combinedMessage }}
          ></div>
          <div dangerouslySetInnerHTML={{ __html: combinedMessage }}></div>
        </motion.div>
      </div>
    </div>
  );
};

export default BroadcastMarquee;
