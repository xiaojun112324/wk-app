import React from "react";
import HcRateValue from "../HcRateValue";
import clsx from "clsx";

interface IProps {
    stockItem: any
    className?: string
}

const StockItem: React.FC<IProps> = ({ stockItem, className }) => {
    return (
        <div className={clsx('flex items-center gap-1', className)}>
            <div className="flex-1">
                <div>{stockItem.name}</div>
                <div>{stockItem.code}</div>
            </div>
            <div></div>
            <div>
                <div>{stockItem.nowPrice}</div>
                <div><HcRateValue hcrate={stockItem.hcrate}  /></div>
            </div>

        </div>
    );
};

export default StockItem;
