import React from "react";

import clsx from "clsx";
import { formatMoney } from "@/lib/formatMoney";

interface IProps {
    item: any
    className?: string
}

const RankItem: React.FC<IProps> = ({ item, className }) => {
    return (
        <div className={clsx(' text-sm', className)}>
            <div className="flex items-center justify-between py-4 border-b">
                {/* 左侧 */}
                <div className="flex items-center gap-3">

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold ">{item.symbol}</span>
                          
                        </div>

                        <div className="text-gray-400 text-sm">{item?.algorithm}</div>
                    </div>
                </div>

                {/* 中间 */}
                <div className="text-right">
                    <div className=" font-medium">
                        {item?.poolHashrate} <span className="text-gray-500">/ {item?.networkDifficulty}</span>
                    </div>

                    <div className="text-sm text-gray-400 flex items-center justify-end gap-1">
                        {item?.networkHashrate} / {item?.priceCny}
                    </div>
                </div>

                {/* 右侧 */}
                <div>
                    <div className={clsx(' text-white rounded px-1.5 py-0.5',true?'bg-green-600':' bg-amber-600')}>{formatMoney(123131)}</div>
                </div>
            </div>

        </div>
    );
};

export default RankItem;
