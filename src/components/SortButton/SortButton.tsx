import React from "react";
import { PlayIcon } from "@heroicons/react/20/solid";

type SortOrder = "asc" | "desc" | "none";

interface SortButtonProps {
  label: string;
  value: string; // 唯一标识，比如 "sales" / "price"
  activeOrder: SortOrder; // 当前排序状态（父组件控制）
  onChange?: (value: string, order: SortOrder) => void;
}

const SortButton: React.FC<SortButtonProps> = ({
  label,
  value,
  activeOrder,
  onChange,
}) => {
  const handleClick = () => {
    let next: SortOrder;
    if (activeOrder === "none") next = "asc";
    else if (activeOrder === "asc") next = "desc";
    else next = "none";

    onChange?.(value, next);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-1 text-gray-700 hover:text-blue-500"
    >
      <span>{label}</span>
      <span className="flex flex-col items-center">
        <PlayIcon
          className={`w-2 -rotate-90 ${
            activeOrder === "asc" ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <PlayIcon
          className={`w-2 rotate-90 ${
            activeOrder === "desc" ? "text-blue-500" : "text-gray-400"
          }`}
        />
      </span>
    </button>
  );
};

export default SortButton;
