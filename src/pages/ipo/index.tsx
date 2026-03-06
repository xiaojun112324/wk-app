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
import FollowCard from "./components/IpoCard";
import { ApiIpo } from "@/apis/ipo";
import Buy from "./components/Buy";



const Ipo = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState('')
    const [isOpenBuy, setIsOpenBuy] = useState(false)
    const [currentRow, setCurrentRow] = useState<any>(null)
    const {
        data: followList,
        total,
        page,
        pageSize,
        hasMore,
        isEmpty,
        initLoading,
        error,
        loading,
        run,
        setPage,
        refresh: refreshStore
    } = usePaginatedQuery({
        fetcher: ApiIpo.getList,
        incremental: true,
        params: {
            zt: 0

        }
    });

    const onLoadMore = () => {
        setPage(page + 1)
    }
    const onOpenBuy = (item: any) => {
        //
        setIsOpenBuy(true)
        setCurrentRow(item)
    }
    return <main className=" min-h-screen px-5">
        <AppNav title="新股申购" />

        <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onLoadMore} loading={loading} initLoading={initLoading}>
            {
                followList?.map((item: any) => <FollowCard item={item} key={item.id} onClick={onOpenBuy} />)
            }

        </InfiniteScroll>
        <Buy open={isOpenBuy} onOpenChange={setIsOpenBuy} item={currentRow} />


    </main>
}

export default Ipo;
