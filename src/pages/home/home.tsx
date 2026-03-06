import { useMemo, useState } from "react"
import { apiOther } from "@/apis/other";
import { News } from "@/apis/news";
import { useQuery } from "@/hooks/useQuery";
import { Link, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useRefreshOnLanguageChange } from "@/hooks/useRefreshOnLanguageChange";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import BroadcastMarquee from "@/components/BroadcastMarquee";
import TabsScroll from "@/components/TabsScroll";
import { formatDate } from "@/lib/format-time";
import { usePaginatedQuery } from "@/hooks/usePagination";
import InfiniteScroll from "@/components/InfiniteScroll";
export const homeService = `今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告，今日公告`;
import MessageDialog from "./components/MessageDialog";
import { Skeleton } from "@/components/ui/skeleton"
import { useUnactivate } from "react-activation";
import StockSwiper from "@/components/StockSwiper";
import { ApiStock } from "@/apis/stockInfo";
import StockItem from "@/components/Stock/StockItem";
import DataState from "@/components/DataState";
import { navListData } from "./navListData";
import { getPriceColor } from "@/lib/getPriceColor";
import PanSwiper from "./components/PanSwiper";
import { useUserContext } from "@/contexts/user/userContext";
import { ApiPub } from "@/apis/public";
import MiningItem from "./components/MiningItem";
import RankItem from "./components/RankItem"


export default function Home() {
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpenMessage, setIsOpenMessage] = useState(false)


    const [tab, setTab] = useState(1);
    const tabs = [
        { key: 1, label: '全部' },
        { key: 2, label: '专业矿机' },
        { key: 3, label: 'GPU矿机(币种收益)' },
        { key: 4, label: 'GPU矿机(显卡收益)' },

    ];
    const { data: poolData, loading: poolDataLoading } = useQuery({
        fetcher: ApiPub.poolStats,
        params: {},
    });




    /*   const {
          data: hotStocks,
          loading: hotStockLoading
      } = usePaginatedQuery({
          fetcher: ApiStock.getStock,
          params: {
              showType: 1,
              stockType: 'in'
  
          },
      }); */



    const onTabChange = (key: any) => {
        setTab(key)
    }
    const onCoinDetail=(item:any)=>{
        navigate(`/coin-detail/${item.id}`)
    }




    return (
        <div className="text-sm">
            <section className="flex justify-between items-center px-4 py-4">
                <span className="text-lg font-medium text-foreground">CServer</span>
                <div></div>
            </section> 
            <section className="px-4 mb-5">
                <div className=" shadow-xl rounded-xl h-30 "></div>
            </section>


            <section className="grid grid-cols-5 grid-rows-1 gap-2 pb-4">
                {navListData.map((item: any) => <Link to={item.path} className="flex flex-col justify-center">
                    <div className="size-13 bg-center bg-contain mx-auto" style={{ backgroundImage: `url(${item.icon})` }}></div>
                    <div className=" text-xs mt-0.5 text-muted-foreground text-center">{item.title}</div>
                </Link>)}
            </section>
            <div className="h-1 bg-gray-100"></div>

            <section className="px-4 pt-4">
                <div>矿池统计</div>
                {poolData?.map((item: any) => <MiningItem miningItem={item} key={item.id} onClick={onCoinDetail} />)}
            </section>



            {/*     <div className=" bg-amber-500/10 mt-4" onClick={onMessage}>
                <BroadcastMarquee messages={[homeService]} speed={60} />
            </div> */}





            {/*   {swiperStockLoading ? <Skeleton className="h-25 w-full" /> : <>{swiperStock?.length > 0 ? <StockSwiper list={swiperStock} /> : ''}</>} */}

            {/*   <section>
                <DataState loading={loading} data={hotStocks} >
                    {hotStocks.map((item: any) => <StockItem stockItem={item} key={item.code} />)}
                </DataState>


            </section> */}





            <section className="  mt-3 px-3">
                <TabsScroll
                    tabs={tabs}
                    value={tab}
                    onChange={onTabChange}
                />
            </section>
            <section className="px-4">

                {poolData?.map((item: any) => <RankItem item={item} key={item.id} />)}
            </section>
            {/*      <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onGetData} loading={loading} error={error}  >
                {
                    newsList?.length > 0 ? <div className="px-5">
                        {newsList?.map((item: any) => <Link key={item.id} to={`/news/detail/${item.id}`} className=" border-b-[1px] block border-gray-600 pt-3">
                            <div className=" font-semibold text-sm ellipsis-2">{item.title}</div>
                            <div className="py-3 text-sm text-gray-400">{formatDate(item.showTime)}</div>
                        </Link>)}

                    </div> : ''
                }

            </InfiniteScroll> */}
            <MessageDialog open={isOpenMessage} onOpenChange={setIsOpenMessage} description={homeService} title="通知" />


        </div>
    );
}
