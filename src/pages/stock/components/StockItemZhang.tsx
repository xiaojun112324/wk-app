import clsx from "clsx";
import { formatDate } from "@/lib/format-time";


interface IProps {
    item: any;
    className?: string;
}

export default function StockItemZhang({ item, className }: IProps) {


    return (
        <div
            className={clsx(
                " rounded-xl  mb-2 py-3 px-2",
                className
            )}
        >
            <div className="flex-1 border-b-[1px] border-gray-400 pb-3 mb-3">
                <div className="">{item?.stockName}</div>
                <div className=" text-gray-400 text-sm">{item?.stockCode}</div>
            </div>
            <div className="flex gap-4 text-sm text-gray-800 py-1" >
                <div className="flex-1 flex justify-between">
                    <div>换手率</div>
                    <div>{item.tr}</div>
                </div>
                <div className="flex-1 flex justify-between ">
                    <div>涨跌幅</div>
                    <div>{item.change}</div>
                </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-800 py-1">
                <div className="flex-1 flex justify-between">
                    <div>最新价</div>
                    <div>{item.lastPx}</div>
                </div>
                <div className="flex-1 flex justify-between">
                    <div>成交额</div>
                    <div>{item.businessBalance}</div>
                </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-800 py-1">
                <div className="flex-1 flex justify-between">
                    <div>流通市值</div>
                    <div>{item.cmc}</div>
                </div>
                <div className="flex-1 flex justify-between">
                    <div>总市值</div>
                    <div>{item.mc}</div>
                </div>
            </div>

        </div>
    );
}
