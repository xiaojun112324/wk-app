import React from "react";
import { getPriceColor } from "@/lib/getPriceColor";

interface IProps {
    loading?: boolean;

}

const Loading: React.FC<IProps> = ({ loading }) => {

    return loading ? <div className="animate-loading-container animation-6">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
    </div> : ''
};

export default Loading;



