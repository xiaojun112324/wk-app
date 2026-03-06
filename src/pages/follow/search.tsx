import { useEffect, useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeftIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useRefreshOnLanguageChange } from "@/hooks/useRefreshOnLanguageChange";
import { useBack } from "@/hooks/useBack";
import { ApiStock } from "@/apis/stockInfo";
import InfiniteScroll from "@/components/InfiniteScroll";
import StockType from "@/components/StockType";
import AppNav from "@/components/AppNav";
import { apiFollow } from "@/apis/follow";
import FollowCard from "./components/FollowCard";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@/hooks/useQuery";
import { toast } from "sonner";

export default function FollowSearch() {
    const navigate = useNavigate();
    const { data: levelData, loading: levelLoading } = useQuery({
        fetcher: apiFollow.getUserLevelInfo,

    });

    const goBack = useBack("/");
    const {
        data,
        initLoading,
        total,
        page,
        pageSize,
        hasMore,
        isEmpty,
        error,
        loading,
        run,
        setPage,
        refresh: refreshStore
    } = usePaginatedQuery({
        fetcher: apiFollow.getList,
        incremental: true,
        immediate: false,
        params: {
            status: 1,
            currencyId: '',
            keyWords: ''
        }
    });

    const onGetData = () => { }


    const [keyword, setKeyword] = useState("");

    const handleSearch = () => {
        if (keyword.trim() === "") return;

        run({
            newParams: {
                status: 1,
                currencyId: '',
                keyWords: keyword
            }, newPagination: { page: 1, pageSize }
        });
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };
    const onFollow = (item: any) => {
  
        const myLevel = levelData?.vipLevel || 0
        if (myLevel >= item.level) {
            navigate(`/follow/order/${item?.id}`)
        } else {
            toast.warning('未授权')

        }
    }

    return (
        <div className="pb-10">
            <AppNav title="查询量化策略库" right={<Link to="/follow/history" className=" text-xs">我的托管</Link>} />
            <div className="flex  py-2 px-5 items-center">

                <div className=" flex-1">
                    <div className="  flex  gap-1 ">
                        <input value={keyword}

                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyDown} placeholder="请输入量化策略名称" className="flex-1 border-0 outline-0 placeholder:text-sm rounded-full bg-accent pl-4 py-2" />
                        <span className=" text-sm text-white rounded  px-2 py-1 flex items-center justify-center" onClick={handleSearch}>搜索</span>
                    </div>
                </div>
            </div>

            <InfiniteScroll hasMore={hasMore} empty={isEmpty} emptyNode={<div className="pt-10">
                <img className="w-25 mx-auto mb-5 " src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/follow-nav/ai-man.png" />
                <div className=" text-center bg-muted mx-5 rounded-lg py-10 text-sm text-muted-foreground">
                    <div>暂无量化策略库的信息</div>
                    <div className="mt-5">查询后自动展示</div>
                </div>
            </div>} loadMore={onGetData} loading={loading} initLoading={initLoading} >
                <div className=" px-5 py-4">
                    {
                        data?.length > 0 ? <>
                            {data?.map((item: any) => <FollowCard item={item} key={item.id} onFollow={onFollow} className="mb-2" />)}
                        </> : ''
                    }
                </div>

            </InfiniteScroll>
            <div className="flex w-full max-w-2xl flex-col gap-6 px-5 mt-5">
                <Tabs defaultValue="tab-1">
                    <TabsList className=" w-full">
                        <TabsTrigger value="tab-1">每日托管</TabsTrigger>
                        <TabsTrigger value="tab-2">波段托管</TabsTrigger>
                        <TabsTrigger value="tab-3">长线托管</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab-1">
                        <Card>
                            <CardHeader>
                                {/*     <CardTitle>Account</CardTitle> */}
                                <CardDescription>
                                    申请“每日托管”交易成功后，次日统一由量化策略库严格按照交易策略指令进行卖出。卖出之后，需要再次进行“每日托管”申请，未进行申请，次日没有收益。超短线“托管”收益稳定。
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    </TabsContent>
                    <TabsContent value="tab-2">
                        <Card>
                            <CardHeader>
                                {/*      <CardTitle>Password</CardTitle> */}
                                <CardDescription>
                                    波段托管”资金受量化等级限制，量化等级越高，个人收益越高，且分红更低，统一性强，便于操盘，选择“托管”周期内无需任何操作，且本金与盈利系统自动跟随量化模型指令进行交易，直至所选周期终止之日结束。超强策略布局，实现高额收益。
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    </TabsContent>
                    <TabsContent value="tab-3">
                        <Card>
                            <CardHeader>
                                {/*     <CardTitle>Password</CardTitle> */}
                                <CardDescription>
                                    长线托管”与机构独立操盘，托管权限受量化等级和量化基金账户的活跃度约束，量化等级较高或每日托管连续半年以上将自动解锁，个人收益更高，分红更低，统一性强，便于操盘，选择“托管”周期内无需任何操作，且本金与盈利系统自动复利跟随量化模型指令进行交易，直至所选周期终止之日结束。超强策略布局，实现高额收益。
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    </TabsContent>
                </Tabs>
            </div>


        </div>
    )
}
