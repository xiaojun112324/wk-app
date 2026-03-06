import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { ApiStock } from "@/apis/stockInfo";
import StockItemTing from "@/pages/stock/components/StockItemTing";
import DataState from "@/components/DataState";


const StockTing = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data, loading, initLoading } = useQuery({
        fetcher: ApiStock.selectStopList,
    });
    return <main className=" min-h-screen px-5 pb-10">
        <AppNav title="每日停盘" />

        <DataState loading={loading} data={data} className="mt-[20vh]" >
            <div className="flex gap-1 text-sm py-4 text-gray-700">
                <div className="flex-1">股票</div>
                <div className="  w-32  text-center">停牌日期</div>
                <div className=" w-32 text-center">复牌日期</div>
            </div>

            {data?.map((item: any, idx: number) => <StockItemTing item={item} key={idx} />)}

        </DataState>
        {/*     {data ? <>
         
        </> : ''} */}







    </main>
}

export default StockTing;
