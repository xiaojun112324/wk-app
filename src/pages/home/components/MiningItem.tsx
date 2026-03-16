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
    return Number.isNaN(n) ? `￥${value}` : `￥${n}`;
  };

  const formatUsd = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    const n = Number(value);
    if (Number.isNaN(n)) return `$${value}`;
    return `$${n.toFixed(4).replace(/\.?0+$/, "")}`;
  };

  const priceUsd = (() => {
    const direct = Number(miningItem?.priceUsd);
    if (Number.isFinite(direct) && direct > 0) return direct;
    const cny = Number(miningItem?.priceCny || 0);
    if (!Number.isFinite(cny) || cny <= 0) return 0;
    const usdCnyRate = Number(miningItem?.usdCnyRate || miningItem?.usdCny || 7.2);
    if (!Number.isFinite(usdCnyRate) || usdCnyRate <= 0) return 0;
    return Number((cny / usdCnyRate).toFixed(8));
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
            <div className="text-[#6b85ad] text-xs truncate">{"全网算力"}: {miningItem?.networkHashrate || "-"}</div>
            <div className="text-[#6b85ad] text-xs truncate">{"矿池算力"}: {miningItem?.poolHashrate || "-"}</div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] text-[#7b8faa] mb-0.5">币价</div>
          <div className="text-[12px] text-[#5d7ca8]">$ {formatUsd(priceUsd).replace("$", "")}</div>
          <div className="text-[12px] text-[#5d7ca8]">¥ {formatCny(miningItem?.priceCny).replace("￥", "").replace("¥", "")}</div>
        </div>
      </div>
    </div>
  );
};

export default MiningItem;
