import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { Switch } from "@/components/Switch";
import { useMemo, useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { ApiPosition } from "@/apis/position";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import InfiniteScroll from "@/components/InfiniteScroll";
import StockType from "@/components/StockType";
import Detail from "./components/detail";
import { Modal } from "antd";
import { ApiStock } from "@/apis/stockInfo";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import clsx from "clsx";
import BigNumber from "bignumber.js";
import { usePolling } from "@/hooks/usePolling";
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/Button";


const Red = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [positionType, setPositionType] = useState('0')
    const [stockType, setStockType] = useState('1')
    const [isOpenDetail, setIsOpenDetail] = useState(false)
    const [currentRow, setCurrentRow] = useState<any>(null)
    const [date, setDate] = useState<Date | undefined>(
        new Date(2025, 5, 12)
    )
    const {
        data,
        total,
        page,
        pageSize,
        hasMore,
        isEmpty,
        loading,
        run,
        setPage,
        refresh
    } = usePaginatedQuery({
        fetcher: ApiPosition.positionList,

        params: {
            state: 0,
            ipo: 0
        },
        incremental: true,
    });
    const {
        data: updata,
        run: $updata

    } = usePaginatedQuery({
        fetcher: ApiPosition.positionList,
        isRestData: false,
        immediate: false,
    });

    //sell
    const { mutate: $sell, loading: sellLoading } = useMutation({
        fetcher: ApiStock.sell,
        onSuccess: () => {
            toast.success("操作成功");
        },
    });
    const onDetail = (row: any) => {
        setCurrentRow(row)
        setIsOpenDetail(true)
    }
    const onGetData = () => { }
    const onTypeChange = (key: any) => {
        setPositionType(key)
        run({ newParams: { state: key, ipo: 0 }, newPagination: { page: 1, pageSize } });


    }


    return <main className="  min-h-[calc(100vh-61px)] ">
        <AppNav title="红包" />
        <img className="w-full max-w-2xl mx-auto block" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/red-banner.jpg" />
        {/*     <div className="p-4">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg  w-full"
                buttonVariant="ghost"
            />
        </div> */}


        {/*       <section className="sticky top-0 left-0 w-full">
            <div className="flex items-center justify-between  py-2 px-5 mb-2 ">
                <Switch
                    value={positionType}
                    onChange={onTypeChange}
                    options={[
                        { label: '升级任务', value: '0', },
                        { label: '邀请任务', value: '1', },
                    ]} />


            </div>
        </section> */}
        <section className="px-5 pt-5">
            <InfiniteScroll hasMore={hasMore} empty={false} loadMore={onGetData} loading={loading}  >
                {
                    [1, 2, 3]?.length > 0 ? <>

                        {
                            [1, 2, 3].map((stockItem: any, idx: number) =>
                                <section className="   rounded mb-3 flex items-center" key={stockItem.id}>
                                    <div className=" text-red-600 font-semibold">+103.00</div>
                                    <div className=" text-xs text-muted-foreground flex-1 text-center">2025-12-15 19:14:24</div>
                                    <div className="text-muted-foreground text-xs   inline-block">
                                        已领取

                                    </div>




                                </section>)
                        }
                    </> : ''
                }

            </InfiniteScroll>
        </section>







        <Detail open={isOpenDetail} onClose={setIsOpenDetail} stockItem={currentRow} />
    </main>
}

export default Red;
