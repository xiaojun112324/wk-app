import clsx from "clsx";
import { formatDate } from "@/lib/format-time";
import StockType from "@/components/StockType";

interface IProps {
    item: any;
    className?: string;
    onClick?: (item: any) => void;
}

export default function StockItem({ item, className, onClick }: IProps) {


    return (
        <div
            className={clsx(
                "flex gap-1 text-gray-800 items-center  rounded-xl py-4 px-2 mb-2",
                className
            )}
            onClick={() => onClick?.(item)}
        >
            <div className="w-26 text-sm text-foreground">
                <div className="mb-1">{item?.name}</div>
                <div className=" text-gray-400 flex items-center gap-1"><StockType value={item?.stockGid} className="mr-1" />{item?.code}</div>
            </div>
            <div className={clsx('flex-1 text-sm text-center  font-semibold',item?.preclose_px>0?'text-red-600':'text-green-600')}>{item?.nowPrice || '-'}</div>
            <div className={clsx('flex-1 text-sm  text-center  rounded py-1 font-semibold',item?.preclose_px>0?'text-red-600 bg-red-400/10':'text-green-600 bg-green-400/10')}>{item?.preclose_px || '-'}</div>
            <div className={clsx('flex-1 text-sm text-center  font-semibold',item?.preclose_px>0?'text-red-600':'text-green-600')}>{item?.hcrate?`${item.hcrate}%` : '-'}</div>
        </div>
    );
}
