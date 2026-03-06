import clsx from "clsx";



interface TabsProps {
    item: any;
    className?: string;
}

export default function StockItem({ item, className }: TabsProps) {


    return (
        <div
            className={clsx(
                "flex gap-3  text-sm text-gray-800 ",
                className
            )}
        >
            <div>
                <div>{item?.stockName}</div>
                <div>{item?.stockCode}</div>
            </div>
            <div></div>
            <div></div>

        </div>
    );
}
