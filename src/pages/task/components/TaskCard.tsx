import React, { ReactNode, useMemo, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/Button";
import { Form, Input, Space } from "antd";
import UploadImg from "@/components/UploadImg";
import clsx from "clsx";
import StockType from "@/components/StockType";
import { Counter } from "@/components/Counter/Counter";
import BigNumber from "bignumber.js";
import { useUserContext } from "@/contexts/user/userContext";
import { useMutation } from "@/hooks/useMutation";
import { ApiStock } from "@/apis/stockInfo";
import { toast } from "sonner";
import { Link } from "react-router-dom";
const CONTRACT_SIZE = 100;


interface IProps {
    open: boolean;
    onClose: (open: boolean) => void;
    title?: string;
    stockItem: any;
    description?: string;
    children?: ReactNode;
    trigger?: ReactNode;
}

export default function Detail({
    open,
    onClose,
    title,
    description,
    children,
    stockItem,
    trigger,
}: IProps) {
    const [form] = Form.useForm();
    const [buyNum, setBuyNum] = useState(1)
    const [lever, setLever] = useState(10)
    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;



    const calcSellTotalAmount = useMemo(() => {
        if (!stockItem) {
            return 0
        }
        if (stockItem?.sellOrderId) {
            return new BigNumber(stockItem?.sellOrderTotalPrice ?? 0)
                .minus(stockItem?.orderFee ?? 0)
                .minus(stockItem?.orderSpread ?? 0)
                .decimalPlaces(2, BigNumber.ROUND_DOWN) // 关键：舍去，不四舍五入
                .toFixed(2);

        }
        return new BigNumber(stockItem?.orderTotalPrice ?? 0)
            .plus(stockItem?.allProfitAndLose ?? 0)
            .minus(stockItem?.orderFee ?? 0)
            .minus(stockItem?.orderSpread ?? 0)
            .decimalPlaces(2, BigNumber.ROUND_DOWN) // 关键：舍去，不四舍五入
            .toFixed(2);
    }, [stockItem])

    const amount = useMemo(() => {
        return new BigNumber(stockItem?.orderTotalPrice ?? 0)
            .plus(stockItem?.allProfitAndLose ?? 0).decimalPlaces(2, BigNumber.ROUND_DOWN) // 关键：舍去，不四舍五入
            .toFixed(2);
    }, [stockItem])



    return <section className="mb-3 border-b border-gray-100 pb-4" key={stockItem.id}>
        <div className="flex">
            <div className="flex-1">
                <div>成为初级合伙人V1 <span className=" inline-block bg-orange-200 text-xs px-2 py-0.5 text-orange-800 rounded">单次</span></div>
                <div className="my-1"><small>¥</small >288</div>
                <div className=" text-muted-foreground text-xs">完成即可领取</div>
            </div>
            <Link to="/center" className="flex flex-col justify-end">
                <div className=" text-xs bg-red-500 text-white rounded-lg px-2 pt-1 pb-5 -mb-5">0级策略师 / 1级策略师</div>
                <div className=" -mr-1.5 inline-block bg-no-repeat bg-[length:100%_100%] px-4 pt-2 pb-4 text-center min-w-30 text-orange-800 text-sm  bg-center  bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-btn.png')]">去完成</div>
            </Link>
        </div>
        <div className=" bg-gray-100 flex gap-1 px-2 py-1 rounded mt-2">
            <span className="inline-block size-3 bg-no-repeat bg-contain bg-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/zan.png')]" />
            <div className="flex-1 text-xs text-muted-foreground">可获得：288元现金</div>
        </div>



    </section>;
}
