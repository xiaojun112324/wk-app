import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams, useSearchParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import BigNumber from 'bignumber.js';
import { Badge } from "@/components/ui/badge";

function Interest({ startAmount, dailyInterestRate }: any) {
    const interest = new BigNumber(startAmount)
        .multipliedBy(dailyInterestRate)
        .dividedBy(100);

    return (
        <span>
            {interest.toFixed(2)} ({dailyInterestRate}%)
        </span>
    );
}

const FundOrderDetail = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const financeName = searchParams.get("financeName");
    const startAmount = searchParams.get("startAmount");
    const currency = searchParams.get("currency");
    const financeStatus: any = searchParams.get("financeStatus");
    const financePeriod = searchParams.get("financePeriod");
    const createTime = searchParams.get("createTime");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const interestAmount = searchParams.get("interestAmount");
    const dailyInterestRate = searchParams.get("dailyInterestRate");


    return <main className=" min-h-screen px-5 pt-5">
        <AppNav title="订单详情" />


        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{financeName}</CardTitle>
                {/*      <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                </CardAction> */}
            </CardHeader>
            <CardContent>
                <section className=" text-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">认购金额</div>
                        <div>{startAmount}{currency}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">状态</div>
                        <div>{financeStatus == 1 ? <Badge>已完成</Badge> : <Badge>进行中</Badge>}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">截止日期</div>
                        <div>{financePeriod}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">开始日期</div>
                        <div>{startTime}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">结束日期</div>
                        <div>{endTime}</div>
                    </div>
                    {/*     <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">派息日期</div>
                        <div>{endTime}</div>
                    </div> */}
                    <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">收益率</div>
                        <div><Interest startAmount={startAmount} dailyInterestRate={dailyInterestRate} /></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className=" text-muted-foreground">总收益</div>
                        <div>{interestAmount}{currency}</div>
                    </div>
                </section>

            </CardContent>

        </Card>


    </main>
}

export default FundOrderDetail;
