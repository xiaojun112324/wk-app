import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { useState } from "react";
import { Switch } from "@/components/Switch";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { apiFollow } from "@/apis/follow";
import InfiniteScroll from "@/components/InfiniteScroll";
import FollowCard from "./components/FollowCard";
import { useUserContext } from "@/contexts/user/userContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Msg from "./components/msg";
import { toast } from "sonner";



const Operator = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState('')
    const [isOpenMsg, setIsOpenMsg] = useState(false)

    const {
        data: followList,
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
        params: {
            status: 1,
            currencyId: ''
        }
    });
    const { data: levelData, loading: levelLoading } = useQuery({
        fetcher: apiFollow.getUserLevelInfo,

    });
    const onTypeChange = (value: string) => {
        setType(value)
        run({ newParams: { currencyId: value, status: 1 }, newPagination: { page: 1 } })
    }

    const onLoadMore = () => {
        setPage(page + 1)
    }
    const onFollow = (item: any, idx: number) => {
        if (idx == 0) {
            navigate(`/follow/order/${item?.id}`)
        } else {
            toast.warning('暂未开放')

        }
        return
        const myLevel = levelData?.vipLevel || 0
        if (myLevel >= item.level) {
            navigate(`/follow/order/${item?.id}`)
        } else {
            toast.warning('未授权')

        }
    }
    return <main className=" min-h-screen">
        <AppNav title="量化策略库" />

        <section className="py-3 px-5 ">
            <Link to="/follow/search" className=" rounded-full flex items-center py-2 px-2 flex-1">
                <MagnifyingGlassIcon className=" size-5" /><div className="flex-1 text-xs text-gray-400  border-0 pl-2 placeholder:text-xs outline-0">请输入量化策略名称</div>
            </Link>
        </section>
        {/*    <img src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/follow-banner.png" className="w-full" /> */}
        {/*   <AppNav title="跟单" right={<Link to="/follow/history" className=" text-xs">托管记录</Link>} /> */}
        {/*    <Switch
            value={type}
            onChange={onTypeChange}
            options={[
                { label: '全部', value: '', },
                { label: '某国', value: '0', },
                { label: 'USD', value: '2', },
            ]} /> */}


        <section className="px-5 pb-20 ">
            <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onLoadMore} loading={loading} initLoading={initLoading} >
                {
                    followList?.map((item: any, idx: number) => <FollowCard item={item} key={item.id} onFollow={() => onFollow(item, idx)} className="mb-2" />)
                }

            </InfiniteScroll>
        </section>

        <div className="ios-safe-bottom">
            <div className=" fixed bottom-0 left-0 w-full  px-5 py-4  " onClick={() => setIsOpenMsg(true)}>
                <div className="ios-safe-bottom flex ">
                    <div className="flex-1 text-green-600">托管如何运作？</div>
                    <div className=" text-muted-foreground text-sm border border-gray-200 rounded-lg px-4 py-1">显示</div>

                </div>

            </div>
        </div>
        <Msg open={isOpenMsg} onOpenChange={setIsOpenMsg} />

    </main>
}

export default Operator;
