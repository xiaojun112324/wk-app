import clsx from "clsx";
import StockType from "@/components/StockType";



interface TabsProps {
    item: any;
    className?: string;
    onDetail: (item: any) => void
}

export default function StockItemLong({ item, className, onDetail }: TabsProps) {


    return (
        <div
            className={clsx(
                "flex gap-1  text-sm    mb-3 px-2 py-3 rounded-xl items-center",
                className
            )}
        >
            <div className="flex-1">
                <div className=" font-semibold text-base">{item?.stockName}</div>
                <div className="text-gray-500 flex gap-1"><StockType value={item?.stockGid}/>{item?.stockCode}</div>
            </div>
            <div className="w-26 text-sm text-foreground">{item?.date}</div>
            <div className="w-17"><span onClick={() => onDetail(item)} className=" text-sm rounded-full text-white text-center inline-block px-4 py-1 bg-primary">详情</span></div>

        </div>
    );
}
