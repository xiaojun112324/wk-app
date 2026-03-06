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

    const amount=useMemo(()=>{
        return new BigNumber(stockItem?.orderTotalPrice ?? 0)
            .plus(stockItem?.allProfitAndLose ?? 0).decimalPlaces(2, BigNumber.ROUND_DOWN) // 关键：舍去，不四舍五入
            .toFixed(2);
    },[stockItem])



    return (
        <Drawer open={open} onOpenChange={onClose}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader className="!pb-0">
                    <DrawerTitle>{stockItem?.stockName}</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                    <div className="flex gap-2 items-center justify-center"><StockType value={stockItem?.stockGid} />{stockItem?.stockCode}</div>

                </DrawerHeader>
                <div className="h-[1px] bg-gray-100 my-2" />
                <section className="px-5 pt-3 pb-10">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">总金额</div>
                            <div>{calcSellTotalAmount}</div>
                        </div>
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">买入价格</div>
                            <div>{stockItem?.buyOrderPrice || '-'}</div>
                        </div>
                    </div>
                    <div className="h-2" />
                    <div className="flex items-center gap-4">
                   {/*      <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">杠杆</div>
                            <div>{stockItem?.orderLever || '-'}</div>
                        </div> */}
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">卖出价格</div>
                            <div>{stockItem?.sellOrderPrice || '-'}</div>
                        </div>
                    </div>
                    <div className="h-2" />
                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">金额</div>
                            <div>{stockItem?.sellOrderId?stockItem?.sellOrderTotalPrice:amount|| '-'}</div>
                        </div>
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">交易数量</div>
                            <div>{stockItem?.orderNum || '-'}</div>
                        </div>
                    </div>
                    <div className="h-2" />
                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">印花税</div>
                            <div>{stockItem?.orderSpread}</div>
                        </div>
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">手续费</div>
                            <div>{stockItem?.orderFee}</div>
                        </div>
                    </div>
                    <div className="h-2" />

                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">递延费</div>
                            <div>{stockItem?.orderStayFee}</div>
                        </div>
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <div className=" text-gray-400">总盈亏</div>
                            <div className={clsx(
                                stockItem?.allProfitAndLose > 0 && "text-red-500",
                                stockItem?.allProfitAndLose < 0 && "text-green-500",
                                stockItem?.allProfitAndLose === 0 && "text-gray-500")}>{stockItem?.allProfitAndLose}</div>
                        </div>
                    </div>

                    <div className=" text-right text-sm mt-3">{stockItem?.sellOrderTime}</div>
                </section>

            </DrawerContent>
        </Drawer>
    );
}
