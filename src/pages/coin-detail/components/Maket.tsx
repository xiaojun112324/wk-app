import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { useMemo, useState } from "react";
import TabsScroll from "@/components/TabsScroll";
import { MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { ApiStock } from "@/apis/stockInfo";
import InfiniteScroll from "@/components/InfiniteScroll";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { Button } from "@/components/Button";
import StockCusItem from "./StockCusItem";
import StockItem from "./StockItem";
import { Modal } from "antd";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import StockType from "@/components/StockType";
import { usePolling } from "@/hooks/usePolling";
import ZshuSwiper from "./ZshuSwiper";
import { MaketBar } from "./MaketBar";
import { MaketBlock } from "./MaketBlock";
import { Skeleton } from "@/components/ui/skeleton";




const Maket = () => {
    const nav = useNavigate();
    const [tab, setTab] = useState(1);
    const { data: stockMaketData, loading: stockMaketDataLoading } = useQuery({
        fetcher: ApiStock.selectMarketInfo,
        params: {},
    });
    const { data: hotStockData, loading: hotStockLoading } = useQuery({
        fetcher: ApiStock.selectHotStockList,
        params: {},
    });

    const { data: blockStockData, loading: blockStockLoading } = useQuery({
        fetcher: ApiStock.selectHotPlate,
        params: {},
    });








    const quoteList = useMemo(() => {
        if (stockMaketData?.index_quote?.length > 0) {
            return stockMaketData?.index_quote
        }
        return []
    }, [stockMaketData])

    const maketLineList = useMemo(() => {
        if (stockMaketData?.up_down_dis) {
            /*      return stockMaketData?.up_down_dis.map((item:any)=>{
                     return {
     
                     }
                 }) */
            const dataMap = stockMaketData?.up_down_dis;
            return [
                { month: "涨停", desktop: dataMap.up_num, fill: "red", textColor: 'red' },
                /*    { month: ">10%", desktop: dataMap.up_10, fill: "red" }, */
                { month: ">8%", desktop: dataMap.up_8, fill: "red" },
                { month: "6-8%", desktop: dataMap.up_6, fill: "red" },
                { month: "4-6%", desktop: dataMap.up_4, fill: "red" },
                { month: "2-4%", desktop: dataMap.up_2, fill: "red" },

                { month: "2-4%", desktop: dataMap.down_2, fill: "green" },
                { month: "4-6%", desktop: dataMap.down_4, fill: "green" },
                { month: "6-8%", desktop: dataMap.down_6, fill: "green" },
                { month: ">8%", desktop: dataMap.down_8, fill: "green" },
                /*      { month: ">10%", desktop: dataMap.down_10, fill: "green" }, */
                { month: "跌停", desktop: dataMap.down_num, fill: "green", textColor: 'green' },
            ]
        }
        return []
    }, [stockMaketData])

    const holderData = useMemo(() => {
        if (stockMaketData?.up_down_dis) {
            /*      return stockMaketData?.up_down_dis.map((item:any)=>{
                     return {
     
                     }
                 }) */
            const dataMap = stockMaketData?.up_down_dis;
            return {
                up: dataMap.rise_num, flat: dataMap.flat_num, down: dataMap.fall_num
            }
        }
        return []
    }, [stockMaketData])

    const { data: stockList, loading: stockLoading } = useQuery({
        fetcher: News.getStock,
        params: { pageNum: 1, pageSize: 3, showType: 2 },
    });

    const {
        data: originData,
        total,
        initLoading,
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
        fetcher: ApiStock.getStock,
        incremental: true,
    });
    const {
        data: updata,
        run: $updata

    } = usePaginatedQuery({
        fetcher: ApiStock.getStock,
        isRestData: false,
        immediate: false,
    });

    /*     usePolling(async () => {
            const key = tab;
            const fetcher = ApiStock.getStock;
            await $updata({ newParams: { stockType: 'in', showType: key }, overrideFetcher: fetcher, newPagination: { page: 1, pageSize: pageSize * page } });
        }, { delay: 2000 }); */


    const tabs = [

        { key: 1, label: '沪深A股' },


        /*      { key: 4, label: '科创板' }, */
        { key: 5, label: '创业版' },
  /*       { key: 3, label: '港股' }, */

    ];


    const onStockChange = (key: any) => {
        if (loading) {
            return
        }
        setTab(key)
        const fetcher = key === 0 ? ApiStock.getOptionStock : ApiStock.getStock;

        run({ newParams: { stockType: 'in', showType: key }, newPagination: { page: 1, pageSize }, overrideFetcher: fetcher });

    }


    const data = useMemo(() => {
        if (!originData) return [];
        // 创建一个 Map 方便快速查找
        if (!updata) {
            return originData;
        }
        const updateMap = new Map(updata.map(item => [item.code, item]));

        return originData.map(item => {
            // 如果 updata 中有同 id 的项，则使用更新后的值，否则保留原值
            return updateMap.has(item.code) ? { ...item, ...updateMap.get(item.code) } : item;
        });

    }, [updata, originData])
    const onGetData = async () => {
        console.log('loadmore')
        setPage(page + 1)
    }

    const onLink = (item: any) => {
        nav(`/stockk/${item.code}`)

    }

    return <main className="pb-10">

        <section className="px-4">
            {stockLoading ? <section className="flex gap-3"> <div className="flex flex-col space-y-3 flex-1">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-[125px] w-full rounded-xl" />

            </div><div className="flex flex-col space-y-3 flex-1">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-[125px] w-full rounded-xl" />

                </div></section> : <ZshuSwiper list={stockList?.list} />}

        </section>
        <section className="py-5">
            {stockMaketDataLoading ?
                <div className="flex gap-3"> <div className="flex flex-col space-y-3 flex-1">

                    <Skeleton className="h-[205px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div></div>
                : <MaketBar quoteList={quoteList} maketLineList={maketLineList} holderData={holderData} loading={stockMaketDataLoading} />}

        </section>
        <section>
            <MaketBlock title="行业板块" list={blockStockData?.industry} />
        </section>
        <section className=" mt-5">
            <MaketBlock title="概念板块" list={blockStockData?.concept} />
        </section>
        <div className="px-3 py-2">
            <TabsScroll tabs={tabs}
                value={tab}
                onChange={onStockChange}
            />
        </div>
        <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onGetData} loading={loading} /* initLoading={initLoading} */  >
            {
                data?.length > 0 ? <div className="px-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground  rounded-lg px-2 py-3">
                        <div className=" w-26 text-left">名称代码</div>
                        <div className=" flex-1 text-center">价格</div>
                        <div className=" flex-1  text-center">涨跌额</div>
                        <div className=" flex-1 text-center">涨跌幅</div>
                    </div>
                    {
                        data.map((item: any) => <StockItem item={item} key={item.code} onClick={onLink} />)
                    }



                </div> : ''
            }

        </InfiniteScroll>







    </main>
}

export default Maket;
