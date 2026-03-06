import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import { formatDate } from "@/lib/format-time";
import { ApiDzong } from "@/apis/dzong";
import DataState from "@/components/DataState";
import DzongItem from "./components/DzongItem";
import Buy from "./components/Buy";
import { useState } from "react";
import { Form, Input, Space } from "antd";


const Dzong = () => {
    const { t } = useTranslation();

    const [isOpenBuy, setIsOpenBuy] = useState(false)
    const [currentRow, setCurrentRow] = useState<any>(null)

    const { data, loading } = useQuery({
        fetcher: ApiDzong.getList,
    });
    const onBuy = (item: any) => {
        console.log(item)
        setCurrentRow(item)
        setIsOpenBuy(true)

    }
    return <main className=" min-h-screen px-5">
        <AppNav title="大宗交易" />

        <DataState loading={loading} data={data}  >
            <div className={`flex items-center gap-1 `}>
                <div className="flex-1">名称</div>
                <div className="w-26 text-center">市场归属</div>
                <div className="w-26 text-center">买入价格</div>
                <div className="w-26 text-right">当前价格</div>
            </div>

            {data?.map((item: any) => <DzongItem item={item} key={item?.id} onClick={onBuy} />)}
        </DataState>



        <Buy open={isOpenBuy} onOpenChange={setIsOpenBuy} item={currentRow} />
    </main>
}

export default Dzong;
