import clsx from "clsx";
import { formatDate } from "@/lib/format-time";
import StockType from "@/components/StockType";


interface IProps {
    item: any;
    className?: string;
    onDelete: (item: any) => void;
    onClick: (item: any) => void;
}

export default function StockCusItem({ item, className, onDelete, onClick }: IProps) {

    const _onDelete = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation(); // 阻止冒泡
        // 删除逻辑
        onDelete(item)
    };

    return (
        <div
            className={clsx(
                "flex gap-1 text-gray-800 items-center  rounded-xl py-4 px-2 mb-2",
                className
            )}
            onClick={() => onClick?.(item)}
        >
            <div className="w-26 text-sm text-foreground">
                <div className="">{item?.name}</div>
                <div className=" text-gray-400 flex items-center gap-1"><StockType value={item?.stockGid} />{item?.code}</div>
            </div>
            <div className={clsx('flex-1 text-sm text-center  font-semibold', Number(item?.preclose_px ?? 0) > 0 && "text-red-600",
                Number(item?.preclose_px ?? 0) && "text-green-600",
                Number(item?.preclose_px ?? 0) === 0 && "text-gray-600")}>{item?.nowPrice || '-'}</div>
            <div className={clsx('flex-1 text-sm text-center  font-semibold', Number(item?.preclose_px ?? 0) > 0 && "text-red-600",
                Number(item?.preclose_px ?? 0) && "text-green-600",
                Number(item?.preclose_px ?? 0) === 0 && "text-gray-600")}>{item?.hcrate ? `${item.hcrate}%` : '-'}</div>
            <div className="flex-1 text-sm  text-center text-gray-500">
                <span onClick={_onDelete} className=" mx-auto size-5 border-2 rounded border-red-600 flex items-center justify-center"><span className="block  w-[75%] h-[2px] bg-red-600" /></span>
            </div>
        </div>
    );
}
