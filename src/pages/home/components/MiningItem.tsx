import React from "react";
import clsx from "clsx";

interface IProps {
  miningItem: any;
  className?: string;
  onClick?: (item: any) => void;
}

const MiningItem: React.FC<IProps> = ({ miningItem, className, onClick }) => {
  const formatCny = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    const n = Number(value);
    return Number.isNaN(n) ? `\uffe5${value}` : `\uffe5${n}`;
  };

  const perPRevenueCny = (() => {
    const price = Number(miningItem?.priceCny || 0);
    const dailyCoin = Number(miningItem?.dailyRevenuePerP || 0);
    if (!Number.isFinite(price) || !Number.isFinite(dailyCoin)) return 0;
    return Number((price * dailyCoin).toFixed(8));
  })();

  return (
    <div className={clsx("finance-list-row", className)} onClick={() => onClick?.(miningItem)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <img src={miningItem.logo} className="w-11 h-11 rounded-full ring-2 ring-[#d8e6ff]" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#153966]">{miningItem.symbol}</span>
              <span className="finance-chip">{miningItem?.algorithm || "-"}</span>
            </div>
            <div className="text-[#6b85ad] text-xs truncate">{"\u5168\u7f51\u7b97\u529b"}: {miningItem?.networkHashrate || "-"}</div>
            <div className="text-[#6b85ad] text-xs truncate">{"\u77ff\u673a\u7b97\u529b"}: {miningItem?.poolHashrate || "-"}</div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[12px] text-[#5d7ca8]">{"\u6bcfP\u65e5\u6536\u76ca"}: {formatCny(perPRevenueCny)}</div>
          <div className="text-[12px] text-[#5d7ca8]">{"\u5e01\u4ef7"}: {formatCny(miningItem?.priceCny)}</div>
        </div>
      </div>
    </div>
  );
};

export default MiningItem;
