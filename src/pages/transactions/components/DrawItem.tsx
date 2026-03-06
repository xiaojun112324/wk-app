import { BadgeCustomColors } from "@/components/BadgeCustomColors";
import { formatMoney } from "@/lib/formatMoney";
import clsx from "clsx";

interface IProps {
    item: any;
    className?: string;
}

export default function DrawItem({ className, item }: IProps) {
    return (
        <div className={clsx('w-full  px-4 py-3 text-sm text-gray-700 rounded-lg bg-card', className)}>

            <div className="flex items-center justify-between">
                <div className=" text-white">提现</div>
                <div className="flex items-center gap-5">
                    {(item?.state == 0 || item?.state == 1) ? <BadgeCustomColors color="blue" >审核中</BadgeCustomColors> : ''}
                    {item?.state == 2 ? <BadgeCustomColors color="green" >提现成功</BadgeCustomColors> : ''}
                    {item?.state == 3 ? <BadgeCustomColors color="red" >提现失败</BadgeCustomColors> : ''}
                    <div className=" font-semibold text-primary">{item?.amountType} {item?.amount}</div>
                </div>

            </div>
            {item?.withMsg ? <div className="pt-4 text-red-400 text-xs break-all">{item?.withMsg}</div> : ''}
            <div className="flex items-center justify-between mt-4">
                <div className=" text-gray-300">银行卡</div>
                <div className=" text-gray-200" >{item?.bankNo}</div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className=" text-gray-300">手续费比例</div>
                <div className=" text-gray-200" >{item?.withdrawalFee}%</div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className=" text-gray-300">手续费金额</div>
                <div className=" text-gray-200" >{formatMoney(item?.withFee)}</div>
            </div>
            <div className="text-xs text-gray-500 text-right mt-4">{item?.createTime}</div>



        </div>
    );
}


