import React from "react";

import clsx from "clsx";

interface IProps {
    miningItem: any
    className?: string
    onClick?:(item:any)=>void
}

const MiningItem: React.FC<IProps> = ({ miningItem, className,onClick }) => {
    return (
        <div className={clsx(' text-sm', className)} onClick={()=>onClick?.(miningItem)}>
            <div className="flex items-center justify-between py-4 border-b" >
                {/* 左侧 */}
                <div className="flex items-center gap-3">
                    <img src={miningItem.logo} className="w-10 h-10 rounded-full" />

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold ">{miningItem.symbol}</span>
                           {/*  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                                赠币
                            </span> */}
                        </div>

                        <div className="text-gray-400 text-sm">{miningItem?.algorithm}</div>
                    </div>
                </div>

                {/* 中间 */}
                <div className="text-right">
                    <div className=" font-medium">
                        {miningItem?.poolHashrate} <span className="text-gray-500">/ {miningItem?.dailyRevenuePerP}</span>
                    </div>

                    <div className="text-sm text-gray-400 flex items-center justify-end gap-1">
                        {miningItem?.networkHashrate} / {miningItem?.priceCny}
                       {/*  <span className="text-red-500">↘</span> */}
                    </div>
                </div>

                {/* 右侧 */}
                <button className="ml-4 w-9 h-9 flex items-center justify-center rounded-full border text-gray-500">
                    ☰
                </button>
            </div>

        </div>
    );
};

export default MiningItem;
