import clsx from "clsx";

interface TabItem {
  label: string;
  value: string;
  des?: string

}

interface IProps {
  options: TabItem[];
  value: string; // 当前选中项（由父组件传入）

  onChange?: (value: string) => void;
  className?: string;
}

export default function FollowItems({ options, value, onChange, className }: IProps) {
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
      {options.map((tab) => (
        <div
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          className={clsx(
            "cursor-pointer whitespace-nowrap rounded-full transition-all duration-200 text-center shadow ",
            value === tab.value
              ? "text-gray-900 font-semibold"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <div>{tab.label}天</div>

          <div>{tab.des}</div>

        </div>
      ))}
    </div>
  );
}
