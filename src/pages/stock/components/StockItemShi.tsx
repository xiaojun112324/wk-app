import clsx from "clsx";
import { formatDate } from "@/lib/format-time";
import StockType from "@/components/StockType";


interface IProps {
    item: any;
    className?: string;
}

export default function StockItemShi({ item, className }: IProps) {


    return (
        <div
            className={clsx(
                "flex gap-1 text-gray-800 items-center  rounded-xl py-4 px-2 mb-2",
                className
            )}
        >
            <div className="w-26 text-sm text-foreground">
                <div className="mb-1">{item?.stockName}</div>
                <div className=" text-gray-400 text-xs flex items-center gap-1"><StockType value={item?.stockGid}/>{item?.stockCode}</div>
            </div>
            <div className=" flex-1 text-xs text-center text-gray-500">{(item?.close || '-')}</div>
            <div className="flex-1 text-xs text-center text-gray-500">{(item?.change || '-')}</div>
            <div className="flex-1 text-xs text-right pr-2 text-gray-500">{(item?.rank || '-')}</div>
        </div>
    );
}
