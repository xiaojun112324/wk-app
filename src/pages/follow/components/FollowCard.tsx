import { Button } from "@/components/Button";
import clsx from "clsx";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { formatMoney } from "@/lib/formatMoney";
import { useMemo } from "react";


interface TabsProps {
    item: any;
    className?: string;
    onFollow: (item: any) => void;
}

export default function FollowCard({ item, className, onFollow }: TabsProps) {

    const labelHtml = useMemo(() => {
        if (item.label) {
            const tags = item.label.split(';')
            return tags.map((tag: any) => <div><div key={tag} className="text-xs text-muted-foreground border-muted-foreground border px-2 py-0.5 rounded-2xl mt-2 text-center inline-block">{tag}</div></div>)
        }
    }, [item])


    return (
        <Card
            onClick={() => onFollow(item)}
            className={clsx(
                "w-full",
                className
            )}
        >
            <CardHeader>
                <header className="flex items-center">
                    <div className="bg-no-repeat bg-cover bg-center size-18 rounded-full mr-5" style={{ backgroundImage: `url(${item?.mentorAvatarUrl})` }}></div>
                    <div className="">
                        <div>
                            <strong className="">{item?.mentorName}</strong><span className=" inline-block pl-3 text-sm  text-gray-400">LH{item?.level}</span>
                        </div>
                        {labelHtml}

                    </div>
                    {/*       <strong className="">{item?.mentorName}</strong> */}
                    <div>

                    </div>
                </header>
            </CardHeader>
            <CardContent>
                <section className=" flex flex-col gap-2 text-sm mb-5">
                    <div dangerouslySetInnerHTML={{ __html: item?.followDescription }}></div>
                    {/*     <div className="flex items-center">
                        <div className=" text-gray-500">策略周期天</div>
                        <div className="flex-1 text-right">{item?.followTradeDay}</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500">限购金额</div>
                        <div className="flex-1 text-right">{formatMoney(item?.minFollowAmt)} - {formatMoney(item?.maxFollowAmt)}</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500">策略收益率</div>
                        <div className="flex-1 text-right">{item?.yieldRate}%</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500">结算方式</div>
                        <div className="flex-1 text-right">到期返本返回息</div>
                    </div> */}
                    {/*     <div className="flex items-center">
                        <div className=" text-gray-500">知名导师</div>
                        <div className="flex-1 text-right">{item?.mentorName}</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500">负责公司</div>
                        <div className="flex-1 text-right">{item?.companyName}</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500">专业经验</div>
                        <div className="flex-1 text-right">{item?.yearsOfExperience}年</div>
                    </div> */}
                </section>
                <Button full >申请托管</Button>
                {/*     <div className="mb-5">
                    <div dangerouslySetInnerHTML={{ __html: item?.followDescription }}></div>
                </div> */}
            </CardContent>





        </Card>
    );
}
