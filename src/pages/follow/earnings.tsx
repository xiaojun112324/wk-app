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
import { formatMoney } from "@/lib/formatMoney";



const Earnings = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState('')
    const { data: levelData, loading: levelLoading } = useQuery({
        fetcher: apiFollow.getUserLevelInfo,

    });


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
    const onTypeChange = (value: string) => {
        setType(value)
        run({ newParams: { currencyId: value, status: 1 }, newPagination: { page: 1 } })
    }
    const onLoadMore = () => {
        setPage(page + 1)
    }
    const onFollow = (item: any) => {
        navigate(`/follow/order/${item?.id}`)
    }
    return <main className="">
        <AppNav title="量化分红" />


        {/*   <AppNav title="跟单" right={<Link to="/follow/history" className=" text-xs">托管记录</Link>} /> */}
        {/*    <Switch
            value={type}
            onChange={onTypeChange}
            options={[
                { label: '全部', value: '', },
                { label: '某国', value: '0', },
                { label: 'USD', value: '2', },
            ]} /> */}


        <section className="px-5 pt-5">
            <div className=" bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/money-card.png')] bg-no-repeat bg-cover  px-5 py-8 rounded-xl">
                <div className="text-sm text-gray-800">累计分红</div>
                <div className="text-2xl mt-2 text-gray-800"> {formatMoney(levelData?.inviteTotalProfit || 0)}</div>
            </div>
            {/*    <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onLoadMore} loading={loading} initLoading={initLoading} >
                {
                    followList?.map((item: any) => <FollowCard item={item} key={item.id} onFollow={onFollow} className="mb-2" />)
                }

            </InfiniteScroll> */}
        </section>


    </main>
}

export default Earnings;
