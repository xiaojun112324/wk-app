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
import FollowCard from "./components/FundCard";
import { ApiFund } from "@/apis/fund";
import FundHistoryCard from "./components/FundHistoryCard";



const FundHistory = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState('0')
    const {
        data: fundList,
        total,
        page,
        pageSize,
        hasMore,
        isEmpty,
        error,
        loading,
        initLoading,
        run,
        setPage,
        refresh: refreshStore
    } = usePaginatedQuery({
        fetcher: ApiFund.getOrderFinance,
        incremental: true,
        params: { financeType: '0' }

    });
    const onTypeChange = (value: string) => {
        setType(value)
        run({ newParams: { financeType: value }, newPagination: { page: 1 } })
    }

    const onLoadMore = () => {
        setPage(page + 1)
    }

    const onToDetail = (item: any) => {
        console.log(item)
        const searchParams = new URLSearchParams(item).toString();
        navigate(`/fund/order/detail?${searchParams}`)
    }

    return <main className=" min-h-screen px-5">
        <AppNav title="基金记录" />
        <section className="py-4">
            <Switch
                value={type}
                onChange={onTypeChange}
                options={[
                    { label: '进行中', value: '0', },
                    { label: '已退回', value: '1', },
                ]} />

        </section>


        <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onLoadMore} loading={loading} initLoading={initLoading}  >
            {
                fundList?.map((item: any) => <FundHistoryCard className="mb-2" item={item} key={item.id} onClick={onToDetail} />)
            }

        </InfiniteScroll>


    </main>
}

export default FundHistory;
