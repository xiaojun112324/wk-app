import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { ApiStock } from "@/apis/stockInfo";
import Tabs from "@/components/Tabs";
import { useState } from "react";
import TabsScroll from "@/components/TabsScroll";
import StockItemShi from "@/pages/stock/components/StockItemShi";

const StockShi = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    const [tab, setTab] = useState(1);
    const tabs = [
        { key: 1, label: '沪市排行' },
        { key: 3, label: '深市排行' },

    ];
    const { data, loading, run } = useQuery({
        fetcher: ApiStock.selectUp10List,
        params: { marketType: tab }
    });

    const onStockChange = (tab: any) => {
        setTab(tab)
        run({
            marketType: tab
        })

    }
    return <main className=" min-h-screen pb-10">
        <AppNav title="十大成交股" />
        <div className="px-3 pb-3">
            <TabsScroll tabs={tabs}
                value={tab}
                onChange={onStockChange}
            />
        </div>
        <div className="px-5">
            <div className="flex text-sm text-gray-600 gap-1 px-2 pb-3">
                <div className="w-26">股票</div>
                <div className="flex-1 text-center">收盘价</div>
                <div className="flex-1 text-center">涨跌额</div>
                <div className="flex-1 text-right">排名</div>
            </div>

            <LoadingOrEmpty loading={loading} data={data} className="mt-[20vh]" />
            {loading ? '' : <>
                {data?.map((item: any, idx: number) => <StockItemShi item={item} key={idx} />)}
            </>}

        </div>






    </main>
}

export default StockShi;
