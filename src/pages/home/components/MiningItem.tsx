import React from "react";
import clsx from "clsx";

interface IProps {
  miningItem: any;
  className?: string;
  onClick?: (item: any) => void;
}

const MiningItem: React.FC<IProps> = ({ miningItem, className, onClick }) => {
  const hashUnits = ["H", "K", "M", "G", "T", "P", "E"];
  const hashPowerMap: Record<string, number> = {
    H: 1,
    K: 1e3,
    M: 1e6,
    G: 1e9,
    T: 1e12,
    P: 1e15,
    E: 1e18,
  };

  const formatCny = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    const n = Number(value);
    return Number.isNaN(n) ? `\uffe5${value}` : `\uffe5${n}`;
  };

  const perPRevenueCny = (() => {
    const price = Number(miningItem?.priceCny || 0);
    const dailyPerP = Number(miningItem?.dailyRevenuePerP || 0);
    const dailyPerT = Number(miningItem?.dailyRevenuePerT || 0);
    const dailyCoin = dailyPerP > 0 ? dailyPerP : dailyPerT > 0 ? dailyPerT * 1000 : 0;
    if (!Number.isFinite(price) || !Number.isFinite(dailyCoin)) return 0;
    return Number((price * dailyCoin).toFixed(8));
  })();

  const dynamicRevenue = (() => {
    const text = String(miningItem?.networkHashrate || "");
    const matched = text.match(/([kKmMgGtTpPeE]?)[hH]\s*\/?\s*[sS]/);
    const unit = ((matched?.[1] || "H").toUpperCase() || "H");
    const index = Math.max(0, hashUnits.indexOf(unit));
    const targetUnit = hashUnits[Math.max(0, index - 1)];
    const factor = (hashPowerMap[targetUnit] || 1) / (hashPowerMap.P || 1);
    const value = Number((perPRevenueCny * factor).toFixed(8));
    return {
      unit: targetUnit,
      value,
    };
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
          <div className="text-[12px] text-[#5d7ca8]">日收益率: {formatCny(dynamicRevenue.value)}/{dynamicRevenue.unit}</div>
          <div className="text-[12px] text-[#5d7ca8]">{"\u5e01\u4ef7"}: {formatCny(miningItem?.priceCny)}</div>
        </div>
      </div>
    </div>
  );
};

export default MiningItem;
