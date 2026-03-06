import { Button } from "@/components/Button";
import clsx from "clsx";
import { isFutureTime } from "@/lib/dayjs/isFutureTime";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getPriceColor } from "@/lib/getPriceColor";


interface IProps {
    item: any;
    className?: string;
    onClick: (item: any) => void;
}

export default function FundHistoryCard({ item, className, onClick }: IProps) {
    return (

        <Card className={clsx('w-full', className)} onClick={() => onClick(item)}>
            <CardHeader>
                <CardTitle className="flex justify-between">产品名称：{item?.financeName}   <div className={clsx(' text-sm', getPriceColor(item?.dailyInterestRate))}>{item?.dailyInterestRate}%</div></CardTitle>
                {/*      <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                     <div>{item?.financeStatus == 1 ? '已退回' : ''}</div>
                </CardAction> */}
                <CardDescription>
                    <div>{item?.financeStatus == 1 ? '已退回' : ''}</div>
                </CardDescription>
     
            </CardHeader>
            <CardContent>

                <section className=" flex flex-col gap-2 py-2 text-sm">

                    <div className="flex items-center">
                        <div className=" text-gray-500">最佳持有期</div>
                        <div className="flex-1 text-right">{item?.financePeriod}</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500">认购金额</div>
                        <div className="flex-1 text-right">{item?.currency}{item?.startAmount} </div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500">认购周期</div>
                        <div className="flex-1 text-right">{item?.startTime}</div>
                    </div>


                </section>

            </CardContent>

        </Card>



    );
}
