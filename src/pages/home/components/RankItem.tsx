import React from "react";
import clsx from "clsx";

interface IProps {
  item: any;
  className?: string;
}

const RankItem: React.FC<IProps> = ({ item, className }) => {
  const revenueValue = (() => {
    const price = Number(item?.priceCny || 0);
    const dailyCoin = Number(item?.dailyRevenuePerP ?? item?.dailyRevenuePerT ?? 0);
    if (!Number.isFinite(price) || !Number.isFinite(dailyCoin)) return 0;
    return Number((price * dailyCoin).toFixed(8));
  })();

  const formatCurrency = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "number") return `¥${value}`;
    const str = String(value).trim();
    if (!str) return "-";
    return str.startsWith("¥") ? str : `¥${str}`;
  };

  const revenueText =
    revenueValue === null || revenueValue === undefined
      ? "-"
      : `${formatCurrency(revenueValue)} /P`;
  const priceText = formatCurrency(item?.priceCny);

  return (
    <div className={clsx("finance-list-row", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-[#153966]">{item.symbol}</span>
          <span className="finance-chip">{item?.algorithm || "-"}</span>
        </div>

        <div className="text-right shrink-0">
          <div className="font-semibold text-[#0f3c7f]">{"\u6536\u76ca"}: {revenueText}</div>
          <div className="text-[12px] text-[#5d7ca8]">{"\u5e01\u4ef7"}: {priceText}</div>
        </div>
      </div>
    </div>
  );
};

export default RankItem;
