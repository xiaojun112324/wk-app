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
                        <div className="text-[#6b85ad] text-xs truncate">全网算力: {miningItem?.networkHashrate || "-"}</div>
                        <div className="text-[#6b85ad] text-xs truncate">矿机算力（矿池）: {miningItem?.poolHashrate || "-"}</div>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <div className="text-[12px] text-[#5d7ca8]">每P收益: {formatCny(miningItem?.dailyRevenuePerP)}</div>
                    <div className="text-[12px] text-[#5d7ca8]">币价: {formatCny(miningItem?.priceCny)}</div>
                </div>
            </div>
        </div>
    );
};

export default MiningItem;

