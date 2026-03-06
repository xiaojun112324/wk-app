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

export default function FundCard({ item, className, onClick }: IProps) {
    return (
        <section
            className={clsx(
                "w-full",
                className
            )}
            onClick={() => onClick(item)}
        >
            {/*      <div className="flex-1 flex justify-between items-center">
                <div>{item?.financeName}</div>
                <div>{item?.dailyInterestRate}</div>


            </div>
 */}

            <section className=" flex justify-between  gap-2 py-1 text-sm text-center ">
                <div>
                    <div className={clsx(getPriceColor(8), 'text-2xl')}>{item?.dailyInterestRate}%</div>
                    <div className=" text-xs text-muted-foreground">日收益率</div>
                </div>
                <div>
                    <div className="text-lg font-semibold">{item?.financeName}</div>
                    <div className=" text-xs text-muted-foreground"><span className="inline-block px-1 text-xs bg-orange-200 text-orange-700 ">{item?.financePeriod}天</span> {item?.startAmount}元起</div>
                </div>
                {/*   <div className="flex items-center">
                    <div className=" text-gray-500">最佳持有期</div>
                    <div className="flex-1 text-right">{item?.financePeriod}</div>
                </div>
                <div className="flex items-center">
                    <div className=" text-gray-500">初始值</div>
                    <div className="flex-1 text-right">{item?.startAmount} {item?.currency}</div>
                </div> */}

            </section>
            {item?.content ? <div className=" bg-gray-100 flex gap-1 px-2 py-1 rounded mt-2 overflow-hidden min-w-0">
                <span className="inline-block size-3 bg-no-repeat bg-contain bg-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/zan.png')]" />
                <div className="flex-1 text-xs text-muted-foreground ellipsis">{item?.content}</div>
            </div> : ''}




        </section>
    );
}
