import React from "react";
import { getPriceColor } from "@/lib/getPriceColor";

interface IProps {
    item: any
    onClick: (item: any) => void
}

const DzongItem: React.FC<IProps> = ({ item, onClick }) => {


    return (
        <div className={`flex items-center gap-1 `} onClick={() => onClick(item)}>
            <div className="flex-1">{item.stockName}</div>
            <div className="w-26 text-center">{item.stockType}</div>
            <div className="w-26 text-center">{item.absolutePrice}</div>
            <div className="w-26 text-right">{item.currentprice}</div>
        </div>
    );
};

export default DzongItem;
