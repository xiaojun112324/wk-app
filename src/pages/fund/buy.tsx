import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { apiFollow } from "@/apis/follow";
import { Form, Input, InputNumber, Radio, Space } from "antd";
import { Button } from "@/components/Button";
import clsx from "clsx";
import FollowItems from "./components/FollowItems";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/user/userContext";
import { useMutation } from "@/hooks/useMutation";
import { ApiFund } from "@/apis/fund";
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
import { getPriceColor } from "@/lib/getPriceColor";


const FundBuy = () => {
    const { t } = useTranslation();
    const nav = useNavigate();
    const location = useLocation();
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    const params = new URLSearchParams(location.search);
    const financeName = params.get('financeName')
    const financePeriod = params.get('financePeriod')
    const dailyInterestRate = params.get('dailyInterestRate')
    const startAmount = params.get('startAmount')
    const currency = params.get('currency')
    const endTime = params.get('endTime')
    const startTime = params.get('startTime')
    const productId = params.get('id')
    const [amount, setAmount] = useState<number | undefined>(undefined);



    const { mutate: $buy, loading: buyLoading } = useMutation({
        fetcher: ApiFund.buy,
        onSuccess: () => {
            toast.success("购买成功");
            nav('/fund/history')
        },
    });


    const onBuy = () => {
        if (!amount) {
            toast.warning('请输入购买金额')
            return

        }
 


    };


    const onAmountChange = (e: any) => {
        setAmount(e.target.value)
    }
    const onMax = () => {
      
    }
    return <main className=" min-h-screen px-5 pb-20 text-sm">
        <AppNav title="产品详情" right={<Link to="/fund/history" className=" text-xs text-muted-foreground">购买记录</Link>} />

        {/*       <LoadingOrEmpty loading={loading} data={data} className="mt-[20vh]" /> */}
        <Card className="mt-5 p-4">
            <h5 className=" font-semibold mb-1">{financeName}</h5>
            <div className="flex gap-2 items-center">

                <div>{currency}{startAmount} - ¥1000</div>
                <div className=" text-xs border border-orange-400 text-orange-400 px-1">{financePeriod}天</div>
                <div className="text-xs border border-gray-400 text-gray-400 px-1">每日返息，到期返本</div>
            </div>
            <div className="flex items-end justify-between text-center mt-5">
                <div>
                    <div className={clsx(getPriceColor(8), 'text-2xl')}>{dailyInterestRate}%</div>
                    <div className=" text-xs text-muted-foreground">日收益率</div>
                </div>
                <div>
                    <div className="text-sm mb-1 text-red-500">{currency}2 - {currency}80</div>
                    <div className=" text-xs text-muted-foreground">日收益</div>
                </div>
            </div>
        </Card>

        <Card className="mt-5 p-4">
            <div>
                <h5 className=" font-semibold mb-2 text-sm">购买金额</h5>
                <Space.Compact style={{ width: '100%' }}>
                    <Input type="number" placeholder={`${startAmount} 起`} suffix={currency} style={{ width: '100%' }} value={amount} onChange={onAmountChange} />
                    <span className=" break-keep text-sm leading-8 inline-block pl-3 text-primary" onClick={onMax}>最大</span>
                </Space.Compact>
            </div>

        </Card>
        {/*     <Card className="mt-5 p-4">
            <section className=" text-sm flex flex-col gap-2">
                <h5 className=" font-semibold mb-2 text-sm">概述</h5>
                <div className="flex items-center justify-between">
                    <div className=" text-muted-foreground">开始日期</div>
                    <div>{startTime && startTime !== 'null' ? startTime : '-'}</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className=" text-muted-foreground">结束日期</div>
                    <div>{endTime && endTime !== 'null' ? endTime : '-'}</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className=" text-muted-foreground">最后期限</div>
                    <div>{financePeriod}天</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className=" text-muted-foreground">风险降低</div>
                    <div>{dailyInterestRate}</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className=" text-muted-foreground">订阅金额</div>
                    <div></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className=" text-muted-foreground">利润金额</div>
                    <div></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className=" text-muted-foreground">总收入</div>
                    <div></div>
                </div>
            </section>
        </Card> */}

        {/*    <Card className="mt-5 p-4 text-sm">
            <section className="">
                <h5 className=" font-semibold mb-2 text-sm">规则</h5>
                <div>
                    <div></div>
                    <div>
                        <div>订阅期</div>
                        <div></div>
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <div>利润分配</div>
                        <div></div>
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <div>结束日期</div>
                        <div></div>
                    </div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <div>付款时间</div>
                        <div></div>
                    </div>
                </div>

            </section>
        </Card>
 */}







        <div className="fixed w-full bottom-0 left-0 p-5">
            <Button className="w-full" onClick={onBuy} loading={buyLoading}>立即买入</Button>
        </div>
    </main>
}

export default FundBuy;
