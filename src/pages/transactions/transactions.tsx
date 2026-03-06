import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import TabsScroll from "@/components/TabsScroll";
import { useState } from "react";
import { apiCash } from "@/apis/cash";
import { usePaginatedQuery } from "@/hooks/usePagination";
import InfiniteScroll from "@/components/InfiniteScroll";
import TradeConfirmCard from "./components/TradeConfirmCard";
import DepositItem from "./components/DepositItem";
import DrawItem from "./components/DrawItem";


const Transactions = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const {
        data,
        total,
        initLoading,
        page,
        pageSize,
        loading,
        run,
        hasMore,
        isEmpty,
        setPage,
        refresh: refreshStore
    } = usePaginatedQuery({
        fetcher: apiCash.fundOrderList,
    });
    const [tab, setTab] = useState(1);
    const tabs = [
        { key: 1, label: '资金明细', api: apiCash.fundOrderList },
        /*   { key: 3, label: '保证金追加' }, */
        { key: 4, label: '充值记录', api: apiCash.rechargeList },
        { key: 5, label: '提现记录', api: apiCash.withdrawList },
        /*    { key: 6, label: '转换记录' }, */

    ];

    const onGetData = () => {
        setPage(page + 1)
    }
    const onTypeChange = (key: any) => {

        setTab(key)
        const fetcher = tabs.find((item: any) => item.key == key)?.api;

        run({ newParams: {}, newPagination: { page: 1, pageSize }, overrideFetcher: fetcher });
    }
    return <main className=" min-h-screen px-5">
        <AppNav title="资金流水" />
        <TabsScroll tabs={tabs}
            value={tab}
            onChange={onTypeChange}
        />
        <div className="h-5" />

        <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onGetData} loading={loading} initLoading={initLoading}  >

            {
                data?.length > 0 ?
                    <>

                        {
                            tab == 1 ? <>
                                {
                                    data.map((item: any, idx: number) => <TradeConfirmCard className="mb-2" key={item.id} data={item} />)
                                }</> : ''
                        }
                        {
                            tab == 4 ? <>
                                {
                                    data.map((item: any, idx: number) => <DepositItem className="mb-2" key={item.id} item={item} />)
                                }</> : ''
                        }
                        {
                            tab == 5 ? <>
                                {
                                    data.map((item: any, idx: number) => <DrawItem className="mb-2" key={item.id} item={item} />)
                                }</> : ''
                        }
                    </> : ''
            }

        </InfiniteScroll>





    </main>
}

export default Transactions;
