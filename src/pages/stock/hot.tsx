import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { ApiStock } from "@/apis/stockInfo";
import StockItemLong from "@/pages/stock/components/StockItemLong";
import { useState } from "react";
import StockType from "@/components/StockType";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/Button";

const StockHot = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState<any>(null)
    const { data, loading } = useQuery({
        fetcher: ApiStock.selectLongHuList,
    });
    const onDetail = (item: any) => {

        setCurrentRow(item)
        setOpen(true)

    }
    return <main className=" min-h-screen px-5 py-4 pb-10">
        <AppNav title="股票热榜" />
        <div className="flex text-sm pb-4">
            <div className="flex-1 pl-2">股票</div>
            <div className="w-26">上榜日</div>
            <div className="w-17">解读</div>
        </div>
        <LoadingOrEmpty loading={loading} data={data} className="mt-[20vh]" />
        {
            loading ? '' : data?.map((item: any, idx: number) => <StockItemLong onDetail={onDetail} item={item} key={idx} />)
        }



        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{currentRow?.stockName}</DrawerTitle>
                    <div className="flex justify-center items-center gap-1">
                        <StockType value={currentRow?.stockGid} /> {currentRow?.stockCode}
                    </div>


                </DrawerHeader>
                <div className="grid grid-cols-4 gap-4 text-center mx-1">
                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">总成金额</div>
                        <div className=" text-red-600 mt-1">{currentRow?.amount || '-'}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">换手率</div>
                        <div className=" text-red-600 mt-1">{currentRow?.turnoverRate || '-'}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">涨跌幅</div>
                        <div className=" text-red-600 mt-1">{currentRow?.pctChange || '-'}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">当日流通市值</div>
                        <div className=" text-red-600 mt-1">{currentRow?.floatValues || '-'}</div>
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">卖出额</div>
                        <div className=" text-red-600 mt-1">{currentRow?.lsell || '-'}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">买入额</div>
                        <div className=" text-red-600 mt-1">{currentRow?.lbuy || '-'}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">成交额</div>
                        <div className=" text-red-600 mt-1">{currentRow?.lamount || '-'}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center  text-sm">
                        <div className=" text-gray-500 text-xs">净买入额</div>
                        <div className=" text-red-600 mt-1">{currentRow?.netAmount || '-'}</div>
                    </div>
                </div>
                <section className=" border-2 border-amber-300 rounded-lg relative mt-10 mx-5">
                    <div className="flex justify-center"><div className="px-8  bg-amber-300 rounded-b-lg text-sm pb-1">上榜理由</div></div>
                    <div className=" text-gray-600 text-sm text-center py-5">{currentRow?.reason}</div>
                </section>

                <DrawerFooter>


                    <DrawerClose asChild>
                        <Button full>关闭</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    </main>
}

export default StockHot;
