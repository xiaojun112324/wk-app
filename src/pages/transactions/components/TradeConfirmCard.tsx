import { formatMoney } from "@/lib/formatMoney";
import clsx from "clsx";
import { useMemo } from "react";

interface IProps {
    data: any;
    className?: string;
}

const typeMap: Record<string, { name: string; txtColor: string }> = { 
    "0": { name: "买入股票", txtColor: "#000000" },
    "1": { name: "卖出股票", txtColor: "#FF0000" },
    "2": { name: "基金购买", txtColor: "#0000FF" },
    "3": { name: "基金赎回", txtColor: "#008000" },
    "4": { name: "基金收益率", txtColor: "#FFA500" },
    "5": { name: "快捷兑换", txtColor: "#800080" },
    "6": { name: "新股认购", txtColor: "#00CED1" },
    "7": { name: "借/贷", txtColor: "#A52A2A" },
    "8": { name: "批量购买", txtColor: "#00008B" },
    "9": { name: "托管订单盈亏", txtColor: "#228B22" },
    "10": { name: "取消买入订单", txtColor: "#B22222" },
    "11": { name: "托管订单", txtColor: "#2F4F4F" },
    "20": { name: "入款", txtColor: "#006400" },
    "21": { name: "扣款", txtColor: "#8B0000" }
};



export default function TradeConfirmCard({ className, data }: IProps) {
    const item = useMemo(() => {
        try {
            const _data = JSON.parse(data.detailDesc)
            return { ..._data, orginData: data }

        } catch (error) {

        }
        return null
    }, [data])


    if ([0, 1].includes(item?.type)) {
        return (
            <div className={clsx('w-full  px-4 py-3 text-sm  rounded-lg bg-card', className)}>
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="font-medium text-gray-900 flex-1">
                        {/* 300353 / 东土科技 */}
                        {item?.stockInfo}
                    </div>
                    {item?.type == 0 ? <button className="rounded bg-red-500 px-3 py-1 text-xs text-white">
                        买入股票
                    </button> : ''}
                    {item?.type == 1 ? <button className="rounded bg-red-500 px-3 py-1 text-xs text-white">
                        卖出股票
                    </button> : ''}
                </div>

                {/* Profit / Loss */}
                {item?.type == 0 ? <>
                    <div className="mt-3 text-2xl font-semibold text-green-600">
                        {item?.buyPrice}
                    </div>

                    {/* Detail List */}
                    <div className="mt-4 space-y-2">
                        <Row label="买入股票" value={item?.stockInfo} />
                        <Row label="方向" value={item?.buyType} />
                        <Row label="买入数量" value={item?.orderNum} />
                        <Row label="买入价格" value={item?.buyOrderPrice} />
                        <Row label="倍数" value={item?.orderLever} />
                        <Row label="买入总花费" value={item?.buyPrice} />
                        <Row label="手续费" value={item?.feePrice} />
                        <Row label="点差" value={item?.spreadPrice} />
                        <Row label="印花税" value={item?.dutyPrice} />
                    </div>

                    <div className="mt-4 flex justify-between ">
                        <span className=" text-gray-400">可用资金</span>
                        <span>
                            {item?.enableAmt}

                        </span>
                    </div>
                </> : ""}
                {item?.type == 1 ? <>
                    <div className="mt-3 text-2xl font-semibold text-green-600">
                        {item?.usedFunds}
                    </div>

                    {/* Detail List */}
                    <div className="mt-4 space-y-2">
                        <Row label="卖出股票" value={item?.stockInfo} />
                        <Row label="价格" value={item?.usedFunds} />

                    </div>

                </> : ""}

            </div>
        );

    }
    if ([11].includes(item?.type)) {
        return <div className={clsx('w-full  px-4 py-3 text-sm  rounded-lg bg-card', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="font-medium  flex-1 text-lg">
                    {/* 300353 / 东土科技 */}
                    {formatMoney(item?.orginData?.amount)}
                </div>
                <div className=" text-muted-foreground text-xs font-semibold">{typeMap[item?.type]?.name}</div>
            </div>
        </div>
    }
    if ([20, 21].includes(item?.type)) {
        return <div className={clsx('w-full  px-4 py-3 text-sm bg-card rounded-lg', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="font-medium  flex-1 text-lg">
                    {/* 300353 / 东土科技 */}
                    {formatMoney(item?.orginData?.amount)}
                </div>
                <div className=" text-muted-foreground text-xs font-semibold">{typeMap[item?.type]?.name}</div>
            </div>
        </div>
    }
    return <div className={clsx('w-full  px-4 py-3 text-sm bg-card rounded-lg', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="font-medium  flex-1 text-lg">
                {/* 300353 / 东土科技 */}
                {formatMoney(item?.orginData?.amount)}
            </div>
            <div className=" text-muted-foreground text-xs font-semibold">{typeMap[item?.type]?.name}</div>
        </div>
    </div>


}

/** 公共行组件 */
function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-400">{label}</span>
            <span className="font-medium text-muted-foreground">{value}</span>
        </div>
    );
}
