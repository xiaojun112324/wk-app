import React from "react";
import { getPriceColor } from "@/lib/getPriceColor";

interface HcRateValueProps {
    hcrate?: string | number;
    preclosePx?: number;
}

const HcRateValue: React.FC<HcRateValueProps> = ({ hcrate, preclosePx }) => {


    return (
        <div className={`flex items-center gap-1 ${getPriceColor(hcrate || 0)}`}>
            <span>{hcrate}</span>
            <span>{preclosePx}</span>
        </div>
    );
};

export default HcRateValue;
