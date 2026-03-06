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
import FollowCard from "./components/IpoCard";



const FollowHistory = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState('')
    const {
        data: followList,
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
        fetcher: apiFollow.getHistoryList,
        incremental: true,

    });
 
    const onLoadMore = () => {
        setPage(page + 1)
    }

    return <main className=" min-h-screen px-5">
        <AppNav title="托管记录" />



        <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onLoadMore} loading={loading}  >
            {
                followList?.map((item: any) => <div />)
            }

        </InfiniteScroll>


    </main>
}

export default FollowHistory;
