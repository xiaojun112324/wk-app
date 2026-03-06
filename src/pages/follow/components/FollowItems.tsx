import clsx from "clsx";

interface TabItem {
  label: string;
  value: string;
  level?: string | number;
  yieldRate: string | number;
  mentorCommissionPercentage?: string | number;
  des?: string

}

interface IProps {
  options: TabItem[];
  value: string; // 当前选中项（由父组件传入）sß

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
            "cursor-pointer whitespace-nowrap rounded-lg transition-all duration-200 text-center shadow-sm border border-gray-150 px-4 py-3 ",
            value === tab.value
              ? " bg-primary  text-white"
              : "text-gray-400 "
          )}
        >
          <div>{tab.label}个交易日</div>
          {tab.level ? <div>等级{tab.level}</div> : ''}


          <div className="my-2">{tab.des}</div>

          <div>分红{tab.mentorCommissionPercentage || 0}%</div>

        </div>
      ))}
    </div>
  );
}
