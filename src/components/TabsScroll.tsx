import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export interface TabItem {
  key: string | number;
  label: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (key: string | number) => void;
  className?: string
}

const TabsScroll: React.FC<TabsProps> = ({
  tabs,
  value,
  defaultValue,
  onChange,
  className
}) => {
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue ?? tabs[0]?.key);
  const activeKey = isControlled ? value : innerValue;

  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string | number, HTMLDivElement | null>>({});

  const [indicator, setIndicator] = useState({ x: 0, width: 0 });

  // 可选最小/最大宽度限制
  const MIN_WIDTH = 16;
  const MAX_WIDTH = 64;

  useEffect(() => {
    const container = scrollRef.current;
    const el = btnRefs.current[activeKey];
    if (!container || !el) return;

    // 1️⃣ 居中滚动 Tab
    const containerWidth = container.clientWidth;
    const scrollTo = el.offsetLeft - containerWidth / 2 + el.offsetWidth / 2;
    const maxScroll = container.scrollWidth - containerWidth;
    container.scrollTo({
      left: Math.max(0, Math.min(scrollTo, maxScroll)),
      behavior: "smooth",
    });

    // 2️⃣ 容器 padding
    const style = window.getComputedStyle(container);
    const paddingLeft = parseFloat(style.paddingLeft || "0");

    // 3️⃣ 获取文本宽度
    const textEl = el.querySelector("span");
    let textWidth = textEl ? textEl.getBoundingClientRect().width : el.offsetWidth;

    // 4️⃣ 计算 bar 宽度 = 文本宽度的一半
    let barWidth = textWidth / 2;

    // 5️⃣ 限制最小/最大宽度
    barWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, barWidth));

    // 6️⃣ 计算偏移量，让 bar 居中在文本下方
    const targetX = el.offsetLeft - paddingLeft + (textWidth - barWidth) / 2;

    setIndicator({ x: targetX, width: barWidth });
  }, [activeKey, tabs]);

  const handleChange = (key: string | number) => {
    if (!isControlled) setInnerValue(key);
    onChange?.(key);
  };

  return (
    <div className=" relative">
      <div
        ref={scrollRef}
        className={clsx("flex gap-6 overflow-x-auto whitespace-nowrap no-scrollbar px-2 relative text-sm", className)}
      >
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <div
              key={tab.key}
              ref={(el) => void (btnRefs.current[tab.key] = el)}
              onClick={() => handleChange(tab.key)}
              className={`
                py-3 cursor-pointer transition-colors
                ${active
                  ? "text-foreground font-medium"
                  : "text-gray-500 hover:text-gray-400"}
              `}
            >
              <span>{tab.label}</span>
            </div>
          );
        })}

        {/* Framer Motion 指示条 */}
        <motion.span
          className="bg-primary h-1 rounded-2xl absolute bottom-0"
          animate={{ x: indicator.x, width: indicator.width }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
    </div>
  );
};

export default TabsScroll;
