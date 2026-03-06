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
import FundCard from "./components/FundCard"
import { ApiIpo } from "@/apis/ipo";
import Buy from "./components/Buy";
import { ApiFund } from "@/apis/fund";
import { formatMoney } from "@/lib/formatMoney";



const Fund = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState('')
    const [isOpenBuy, setIsOpenBuy] = useState(false)
    const [currentRow, setCurrentRow] = useState<any>(null)

    const { data: userAccount, loading: userAccountLoading } = useQuery({
        fetcher: ApiFund.getUserAmount,
    });

    const {
        data: fundList,
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
        fetcher: ApiFund.getList,
        incremental: true,

    });
    const [firstFund, ...restFunds] = fundList ?? [];




    const onLoadMore = () => {
        setPage(page + 1)
    }
    const onOpenBuy = (item: any) => {
        const searchParams = new URLSearchParams(item).toString();
        navigate(`/fund/buy?${searchParams}`)
        /*      setIsOpenBuy(true) */
        /*       setCurrentRow(item) */
    }
    return <main className=" min-h-[calc(100vh-70px)]  px-5 bg-no-repeat bg-contain bg-[center_top] bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/fund-bg.png')]">
        {/*        <AppNav title="基金" /> */}
        <header className="py-4 flex items-center gap-2">
            <img className="h-5" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/fund-title.png" /><span className=" text-sm text-[#834816]">闲钱理财 灵活存取</span>
        </header>
        <div className="flex justify-between pb-5 text-[#834816]">
            <div>基金总资产：<strong>{formatMoney(userAccount?.totalAssets)}</strong></div>
            <div >冻结资金：<strong>{formatMoney(userAccount?.freezeAssets)}</strong></div>
        </div>
        <section v-if="firstFund" className=" mb-4 bg-gradient-to-b from-white/40 to-white rounded-xl py-5" onClick={() => onOpenBuy(firstFund)}>
            <div className=" text-center text-xl font-semibold mb-2">{firstFund?.financeName}</div>
            <div className="flex items-end justify-around text-center mb-2">
                <div>
                    <div className=" text-2xl text-red-600">{firstFund?.dailyInterestRate}%</div>
                    <div className=" text-xs text-muted-foreground">日收益率</div>
                </div>
                <div>
                    <div className="text-sm mb-1 text-red-600">{firstFund?.financePeriod}天｜{firstFund?.startAmount}元起</div>
                    <div className=" text-xs text-muted-foreground">每日返息，到期返本</div>
                </div>
            </div>
            <div
                className="px-10 text-center max-w-[70%] mx-auto
    py-2
    rounded-full
    text-white
    bg-gradient-to-b
    from-[#FFB56A]
    to-[#E8893F]
    shadow-md
    active:scale-95
    transition
  ">
                去看看
            </div>


        </section>
        <section className="  rounded-lg px-4 py-5">
            <h1 className="mb-4 flex items-center gap-1"><span className="size-5 bg-center bg-contain bg-no-repeat block bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icon-jingxuan.png')]" />精选产品</h1>
            <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onLoadMore} loading={loading} initLoading={initLoading}>
                {
                    restFunds?.map((item: any) => <FundCard item={item} key={item.id} onClick={onOpenBuy} className="mb-5" />)
                }

            </InfiniteScroll>

        </section>


        <Buy open={isOpenBuy} onOpenChange={setIsOpenBuy} item={currentRow} />


    </main>
}

export default Fund;
