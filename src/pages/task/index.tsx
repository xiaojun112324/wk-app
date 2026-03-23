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



const Task = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [positionType, setPositionType] = useState('0')
    const [stockType, setStockType] = useState('1')
    const [isOpenDetail, setIsOpenDetail] = useState(false)
    const [currentRow, setCurrentRow] = useState<any>(null)
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


    return <main className=" bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/tack-page-bg.png')] bg-no-repeat bg-center bg-cover">
        <AppNav title="任务专区" className="!bg-transparent text-white" />
        <div className="px-5">
            <img src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/task-banner.png" className=" rounded-xl w-full" />
        </div>

        <section className=" rounded-t-2xl  mt-5 px-5 ">
            <section className="sticky top-0 left-0 ios-safe-offset-top w-full">
                <div className="flex items-center justify-between  py-2 px-5 mb-2 ">
                    <Switch
                        value={positionType}
                        onChange={onTypeChange}
                        options={[
                            { label: '升级任务', value: '0', },
                            { label: '邀请任务', value: '1', },
                        ]} />


                </div>
            </section>
            <InfiniteScroll hasMore={false} empty={false} loadMore={onGetData} loading={loading}  >
                {
                    [1,2,3].map((stockItem: any, idx: number) =>
                        <section className="mb-3 border-b border-gray-100 pb-4" key={stockItem.id}>
                            <div className="flex">
                                <div className="flex-1">
                                    <div>成为初级合伙人V1 <span className=" inline-block bg-orange-200 text-xs px-2 py-0.5 text-orange-800 rounded">单次</span></div>
                                    <div className="my-1"><small>¥</small >288</div>
                                    <div className=" text-muted-foreground text-xs">完成即可领取</div>
                                </div>
                                <Link to="/center" className="flex flex-col justify-end">
                                    <div className=" text-xs bg-red-500 text-white rounded-lg px-2 pt-1 pb-5 -mb-5">0级策略师 / 1级策略师</div>
                                    <div className=" -mr-1.5 inline-block bg-no-repeat bg-[length:100%_100%] px-4 pt-2 pb-4 text-center min-w-30 text-orange-800 text-sm  bg-center  bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-btn.png')]">去完成</div>
                                </Link>
                            </div>
                            <div className=" bg-gray-100 flex gap-1 px-2 py-1 rounded mt-2">
                                <span className="inline-block size-3 bg-no-repeat bg-contain bg-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/zan.png')]" />
                                <div className="flex-1 text-xs text-muted-foreground">可获得：288元现金</div>
                            </div>



                        </section>)
                }

            </InfiniteScroll>
        </section>







        <Detail open={isOpenDetail} onClose={setIsOpenDetail} stockItem={currentRow} />
    </main>
}

export default Task;
