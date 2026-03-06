import React, { useState } from "react";

interface TabItem {
  key: string;
  label: string;
}

interface CapsuleTabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
}

export default function CapsuleTabs({
  tabs,
  value,
  defaultValue,
  onChange,
}: CapsuleTabsProps) {
  const [innerValue, setInnerValue] = useState(
    defaultValue || tabs[0]?.key
  );

  const activeKey = value ?? innerValue;

  const handleChange = (key: string) => {
    if (value === undefined) {
      setInnerValue(key);
    }
    onChange?.(key);
  };

  return (
    <div className="flex w-full rounded-full border border-white/30 bg-black/80 p-1">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;

        return (
          <button
            key={tab.key}
            onClick={() => handleChange(tab.key)}
            className={`
              px-6 py-2 text-sm rounded-full transition-all flex-1
              ${
                active
                  ? "bg-gray-200/20 text-black"
                  : "text-white/70 hover:text-white"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
