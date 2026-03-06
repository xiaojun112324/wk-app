import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { ApiStock } from "@/apis/stockInfo";
import StockItemZhang from "@/pages/stock/components/StockItemZhang";


const StockZhang = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data, loading } = useQuery({
        fetcher: ApiStock.selectUpPoolList,
    });
    return <main className=" min-h-screen px-5 pb-10">
        <AppNav title="每日涨停" />

        <LoadingOrEmpty loading={loading} data={data} className="mt-[20vh]" />
        <div className="h-5"/>

        {data?.map((item: any, idx: number) => <StockItemZhang item={item} key={idx} />)}





    </main>
}

export default StockZhang;
