import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import InfiniteScroll from "@/components/InfiniteScroll";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { ApiStock } from "@/apis/stockInfo";
import { ApiMsg } from "@/apis/msg";


const MsgList = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    const {
        data,
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
        fetcher: ApiMsg.getList,
        incremental: true,
    });

    const onGetData = async () => {
        console.log('loadmore')
        setPage(page + 1)
    }
    return <main className=" min-h-screen px-5">
        <AppNav title="站内消息" />

        <section className="pt-5 pb-10">
            <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onGetData} loading={loading} initLoading={initLoading} >
                {
                    data?.map((item: any) => <div key={item.id} className=" rounded-lg py-4 mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-medium text-sm">{item.tittle}</div>
                            <div className="text-xs text-gray-400">{formatDate(item.addTime)}</div>
                        </div>
                        <div className="text-xs text-accent-foreground  whitespace-pre-wrap">{item.deSummary}</div>
                    </div>)
                }

            </InfiniteScroll>
        </section>



    </main>
}

export default MsgList;
