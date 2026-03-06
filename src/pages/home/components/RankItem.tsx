import React from "react";
import clsx from "clsx";

interface IProps {
    item: any;
    className?: string;
}

const RankItem: React.FC<IProps> = ({ item, className }) => {
    const revenue = item?.dailyRevenuePerP ?? item?.dailyRevenuePerT ?? "-";

    return (
        <div className={clsx("finance-list-row", className)}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-[#153966]">{item.symbol}</span>
                    <span className="finance-chip">{item?.algorithm || "-"}</span>
                </div>

                <div className="text-right shrink-0">
                    <div className="font-semibold text-[#0f3c7f]">{revenue}</div>
                    <div className="text-[12px] text-[#5d7ca8]">价格: {item?.priceCny ?? "-"}</div>
                </div>
            </div>
        </div>
    );
};

export default RankItem;

