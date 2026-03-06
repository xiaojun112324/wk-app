import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { useState } from "react";
import { Switch } from "@/components/Switch";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { apiFollow } from "@/apis/follow";
import InfiniteScroll from "@/components/InfiniteScroll";
import FollowHistoryCard from "./components/FollowHistoryCard";
import HistoryDetail from "./components/HistoryDetail";


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
import TabsScroll from "@/components/TabsScroll";

const FollowHistory = () => {
    const [openHistoryDetail, setOpenHistoryDetail] = useState(false)
    const [item, setItem] = useState<any>(null)
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState('')
    const [tab, setTab] = useState(1);
    const {
        data: followList,
        total,
        page,
        pageSize,
        initLoading,
        hasMore,
        isEmpty,
        error,
        loading,
        run,
        setPage,
        refresh: refreshStore
    } = usePaginatedQuery({
        fetcher: apiFollow.getHistoryList,
        incremental: true,

    });

    const onLoadMore = () => {
        setPage(page + 1)
    }


    const onShowDetail = (item: any) => {
        setItem(item)
        setOpenHistoryDetail(true)
    }

    return <main className="pb-10">
        <AppNav title="托管记录" />
        {/*     <section className=" px-3">
            <TabsScroll

                tabs={tabs}
                value={tab}
                onChange={onNewsChange}
            />
        </section> */}




        <div className="pt-5 px-5">
            <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onLoadMore} loading={loading} initLoading={initLoading}>
                {
                    followList?.map((item: any) => <FollowHistoryCard key={item.id} item={item} onDetail={onShowDetail} />)
                }
              {/*   {
                    followList?.map((item: any) => <Card key={item.id} className="mb-4">
                        <section className="px-4 text-sm">
                            <div className=" text-center mb-4">{item?.mentorName}</div>
                            <div className=" text-center flex items-center justify-around mb-4">
                                <div>
                                    <div className=" text-muted-foreground">量化托管周期</div>
                                    <div>{item?.runTime || '-'}</div>
                                </div>
                                <div>
                                    <div className=" text-muted-foreground" >量化托管资金</div>
                                    <div>{formatMoney(item?.startAmount)}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">

                                <div className=" flex items-center justify-between">
                                    <div className=" text-muted-foreground" >量化托管收益比例</div>
                                    <div>{item?.yieldRate}%</div>
                                </div>
                                <div className=" flex items-center justify-between">
                                    <div className=" text-muted-foreground">申请时间</div>
                                    <div>{formatDate(item?.startTime)}</div>
                                </div>
                                <div className=" flex items-center justify-between">
                                    <div className=" text-muted-foreground">到期时间</div>
                                    <div>{formatDate(item?.endTime)}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-4">
                                <div className=" flex items-center justify-between">
                                    <div className=" text-muted-foreground">初始资金</div>
                                    <div>{formatMoney(item?.startAmount)}</div>
                                </div>

                                <div className=" flex items-center justify-between">
                                    <div className=" text-muted-foreground">盈亏比例</div>
                                    <div>{item?.profitLossPercentage}%</div>
                                </div>
                                <div className=" flex items-center justify-between">
                                    <div className=" text-muted-foreground">总盈亏</div>
                                    <div>{formatMoney(item?.profitLossAmount || 0)}</div>
                                </div>
                            </div>
                        </section>
                    </Card>)
                } */}

            </InfiniteScroll>
        </div>
        <HistoryDetail open={openHistoryDetail} onClose={setOpenHistoryDetail} item={item} />


    </main>
}

export default FollowHistory;
