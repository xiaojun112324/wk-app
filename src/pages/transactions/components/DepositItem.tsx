import { BadgeCustomColors } from "@/components/BadgeCustomColors";
import clsx from "clsx";

interface IProps {
    item: any;
    className?: string;
}

export default function DepositItem({ className, item }: IProps) {
    return (
        <div className={clsx('w-full  px-4 py-3 text-sm text-gray-700 rounded-lg bg-card ', className)}>

            <div className="flex items-center justify-between">
                <div className=" text-white">充值</div>
                <div className="flex items-center gap-5">
                    {item?.state == 0 ? <BadgeCustomColors color="blue" >核实中</BadgeCustomColors> : ''}
                    {item?.state == 1 ? <BadgeCustomColors color="green" >已到账</BadgeCustomColors> : ''}
                    {item?.state == 2 ? <BadgeCustomColors color="red" >已取消</BadgeCustomColors> : ''}
                    <div className=" font-semibold text-primary">{item?.amountType} {item?.amount}</div>
                </div>
            </div>
            {item?.rechargeMsg ? <div className="pt-4 text-red-400 text-xs break-all">{item?.rechargeMsg}</div> : ''}

            <div className="flex"><div className="flex-1">


                {/*         <BadgeCustomColors color="green" />
                <BadgeCustomColors color="red" /> */}
            </div> <div className="text-xs text-gray-500 text-right mt-4">{item?.createTime}</div></div>



        </div>
    );
}


