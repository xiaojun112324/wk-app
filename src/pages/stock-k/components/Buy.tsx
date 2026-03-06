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
import { useNavigate } from "react-router-dom";
const CONTRACT_SIZE = 100;


interface IProps {
    open: boolean;
    onClose: (open: boolean) => void;
    title?: string;
    stockInfo: any;
    description?: string;
    children?: ReactNode;
    trigger?: ReactNode;
}

export default function Buy({
    open,
    onClose,
    title,
    description,
    children,
    stockInfo,
    trigger,
}: IProps) {
    const [form] = Form.useForm();
    const [buyNum, setBuyNum] = useState(1)
    const [lever, setLever] = useState(1)
    const context = useUserContext();
    const nav = useNavigate();
    const { loading: userLoading, userInfo, amountInfo } = context.store;
    const { mutate: $buy, loading: buyLoading } = useMutation({
        fetcher: ApiStock.buy,
        onSuccess: () => {
            toast.success("购买成功");
            nav('/position')

        },
    });


    const levers = useMemo(() => {
        return [10, 8, 5, 2]
    }, [])

    const onBuy = () => {
        $buy({
            lever,
            buyNum,
            buyType: 0,// 1 买跌 0 买涨
            stockId: stockInfo?.id
        })

        // muAuth(values);
    };

    //计算市值
    const marketValue = useMemo(() => {
        if (!stockInfo?.nowPrice || !buyNum) return new BigNumber(0)

        return new BigNumber(stockInfo.nowPrice)
            .times(buyNum)
            .times(CONTRACT_SIZE)
    }, [stockInfo?.nowPrice, buyNum])
    //计算支付保证金
    const margin = useMemo(() => {
        if (!lever || marketValue.isZero()) return new BigNumber(0)

        return marketValue.div(lever)
    }, [marketValue, lever])



    const onLevel = (key: any) => {
        setLever(key)
    }
 




    return (
        <Drawer open={open} onOpenChange={onClose}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader className="!pb-0">
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                    <div className="flex items-center gap-5">
                        <strong className="">{stockInfo?.name}</strong>
                        <div className=" text-sm text-gray-500">
                            {stockInfo?.spell}   <StockType value={stockInfo?.stockGid} className=" ml-1" />
                        </div>
                    </div>
                    <div className={clsx('flex items-center gap-2 font-semibold', clsx(
                        stockInfo?.hcrate > 0 && "text-red-600",
                        stockInfo?.hcrate < 0 && "text-green-600",
                        stockInfo?.hcrate === 0 && "text-gray-600"))}>
                        <span className=" text-3xl ">{stockInfo?.nowPrice}</span>
                        <span>{stockInfo?.hcrate}</span>
                    </div>

                </DrawerHeader>
                <div className="h-[1px] bg-gray-100 my-2" />

                <div className="mt-4 px-5 overflow-y-auto pb-10">
                    <div className=" flex items-center">
                        <div className="w-30 text-sm text-gray-400">类型</div>
                        <div className=" bg-primary text-white rounded text-sm px-3 py-1">现价交易</div>
                    </div>
                    <div className=" flex items-center my-4">
                        <div className="w-30 text-sm text-gray-400">数量</div>
                        <div className="flex items-center gap-2">
                            <div><Counter min={1} max={999999} value={buyNum} onChange={setBuyNum} /></div>
                            <div className="text-xs text-muted-foreground">1手=100股</div>
                        </div>
                    </div>
                    {/*     <div className=" flex items-center">
                        <div className="w-30 text-sm text-gray-400">杠杆倍数</div>
                        <div className="flex flex-1 flex-wrap gap-2">

                            {levers.map((item: any) => <div onClick={() => onLevel(item)} key={item} className={clsx('inline-block px-2 py-1  text-xs rounded ', lever == item ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800')}>{item}倍</div>)}
                        </div>
                    </div> */}
                    <div className="h-[1px] bg-gray-100 my-5" />
                    <section className="mb-5">
                        <div className="flex items-center">
                            <span className=" text-sm text-gray-400 w-30">可用额度</span>
                        </div>
                        <div className="flex items-center my-2">
                            <span className=" text-sm text-gray-400 w-30">市值</span>
                            <span className=" text-primary font-semibold">¥{marketValue.toFixed(2)}</span>
                        </div>
                        {/*     <div className="flex items-center">
                            <span className=" text-sm text-gray-400 w-30">支付保证金</span>
                            <span className=" text-primary font-semibold">¥{margin.toFixed(2)}</span>
                        </div> */}
                    </section>



                </div>
            </DrawerContent>
        </Drawer>
    );
}
