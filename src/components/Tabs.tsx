import clsx from "clsx";

interface TabItem {
  label: string;
  value: string;
  key: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  value: string; // 当前选中项（由父组件传入）

  onChange?: (value: string) => void;
  className?: string;
}

export default function Tabs({ tabs, value, onChange, className }: TabsProps) {
  const handleClick = (val: string) => {
    if (val !== value) onChange?.(val);
  };

  return (
    <div
      className={clsx(
        "flex gap-3 overflow-x-auto text-sm text-gray-800 scrollbar-hide",
        className
      )}
    >
      {tabs.map((tab) => (
        <span
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          className={clsx(
            "cursor-pointer whitespace-nowrap rounded-full transition-all duration-200",
            value === tab.value
              ? "text-gray-900 font-semibold"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
}
