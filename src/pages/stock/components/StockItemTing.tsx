import clsx from "clsx";
import { formatDate } from "@/lib/format-time";


interface IProps {
    item: any;
    className?: string;
}

export default function StockItemTing({ item, className }: IProps) {


    return (
        <div
            className={clsx(
                "flex gap-1 text-gray-800 items-center  rounded-xl py-4 px-2 mb-2",
                className
            )}
        >
            <div className="flex-1 text-sm">
                <div className="">{item?.stockName}</div>
                <div className=" text-gray-400">{item?.stockCode}</div>
            </div>
            <div className=" w-32 text-xs text-center text-gray-500">{formatDate(item?.date || '-')}</div>
            <div className=" w-32 text-xs text-center text-gray-500">{'-'}</div>

        </div>
    );
}
