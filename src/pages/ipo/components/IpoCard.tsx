import { Button } from "@/components/Button";
import clsx from "clsx";
import { isFutureTime } from "@/lib/dayjs/isFutureTime";



interface IProps {
    item: any;
    className?: string;
    onClick: (item: any) => void;
}

export default function IpoCard({ item, className, onClick }: IProps) {
    return (
        <div
            className={clsx(
                " text-sm my-2",
                className
            )}
            onClick={() => onClick(item)}
        >
            <header className="flex items-start">
                <div className="flex-1">
                    <div>{item?.name}</div>
                    <div>交易所：{item?.exchange}</div>
                    <div>截止日期：{item?.subscribeTime}</div>

                </div>
                <div className=" text-xs">
                    {
                        isFutureTime(item?.subscribeTime) ? <div className=" text-green-600">认购</div> : <div className=" text-red-600">已完成</div>
                    }

                </div>
            </header>
            <section className=" flex flex-col gap-2 py-4">
                <div className="flex items-center">
                    <div className=" text-gray-500">价格</div>
                    <div className="flex-1 text-right">{item?.price}</div>
                </div>
                <div className="flex items-center">
                    <div className=" text-gray-500">市场价格</div>
                    <div className="flex-1 text-right">{item?.marketPrice}</div>
                </div>

            </section>


        </div>
    );
}
