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
import { EyeIcon, EyeSlashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
import TabsScroll from "@/components/TabsScroll";
import { formatMoney } from "@/lib/formatMoney";
import { useUserContext } from "@/contexts/user/userContext";



const Position = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [positionType, setPositionType] = useState('0')
    const [stockType, setStockType] = useState('1')
    const [isOpenDetail, setIsOpenDetail] = useState(false)
    const [currentRow, setCurrentRow] = useState<any>(null)
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    const [showBalance, setShowBalance] = useState(false);
    const {
        data: originData,
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
    const data = useMemo(() => {
        if (!originData) return [];
        // 创建一个 Map 方便快速查找
        if (!updata) {
            return originData;
        }
        const updateMap = new Map(updata.map(item => [item.id, item]));

        return originData.map(item => {
            // 如果 updata 中有同 id 的项，则使用更新后的值，否则保留原值
            return updateMap.has(item.id) ? { ...item, ...updateMap.get(item.id) } : item;
        });

    }, [updata, originData])
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
    const onSell = (item: any) => {
        Modal.confirm({
            title: `确定平仓？【${item.stockName}】`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                $sell({
                    positionSn: item.positionSn
                })
            },
        });
    }
    usePolling(async () => {
        await $updata({ newParams: { state: positionType, ipo: 0 }, newPagination: { page: 1, pageSize: pageSize * page } });
    }, { delay: 2000 });
    return <main className="  min-h-[calc(100vh-61px)] ">
        <AppNav title="我的持仓" />
        {/*      <div className="flex justify-between items-center bg-primary text-white px-5 py-3">
            持仓
            <Link to="/search"><MagnifyingGlassIcon className="size-5" /></Link>

        </div> */}

        <section className="bg-[url(https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/money-card.png)] bg-no-repeat bg-cover bg-center pt-6  rounded-lg mx-4 px-4">
            <div className="flex">
                <div className="flex-1">
                    <div className="text-xs   flex items-center ">
                        <span className=" text-gray-500">可用余额</span>
                        <button onClick={() => setShowBalance(!showBalance)} className="p-1 rounded  ml-1 h-6">
                            {showBalance ? <EyeIcon className="size-5 text-gray-500 relative -top-0.5" /> : <EyeSlashIcon className="size-5 text-gray-500 relative -top-0.5" />}
                        </button>
                    </div>
                    <div className="text-2xl font-bold  text-yellow-500 mb-2 h-8">
                        {showBalance ? formatMoney(amountInfo?.userCNYTotal) : "****"}
                    </div>
                </div>

            </div>


            <div className="h-[1px] bg-gray-50" />
            <div className="flex gap-2 text-xs text-center text-gray-500">
            {/*     <div className="flex-1  py-4">
                    <div className="h-5 text-muted text-sm">{showBalance ? formatMoney(0) : '****'}</div>
                    <div className="mt-1 ">股质余额</div>

                </div>
                <div className="w-[1px] bg-gray-50" />
                <div className="flex-1  py-4">
                    <div className="h-5 text-muted text-sm">{showBalance ? formatMoney(0) : '****'}</div>
                    <div className=" mt-1">持仓盈亏</div>

                </div> */}
              {/*   <div className="w-[1px] bg-gray-50" />
                <div className="flex-1  py-4">

                    <div className="h-5 text-muted text-sm">{showBalance ? formatMoney(0) : '****'}</div>
                    <div className=" mt-1">T+1提现</div>
                </div> */}
            </div>



        </section>

        <section className="sticky top-0 left-0 w-full">
            <div className="flex items-center justify-between  py-2 px-5 mb-2 ">
                {/*       <Switch
                    value={positionType}
                    onChange={onTypeChange}
                    options={[
                        { label: '当前持仓', value: '0', },
                        { label: '历史平仓', value: '1', },
                    ]} /> */}
                <TabsScroll
                    tabs={[
                        { label: '当前持仓', key: '0', },
                        { label: '历史平仓', key: '1', },
                 /*        { label: '新股持仓', key: '2', },
                        { label: '申购记录', key: '3', }, */
                    ]}
                    value={positionType}
                    onChange={onTypeChange}
                />

                {/*    <Switch
                    value={stockType}
                    onChange={setStockType}
                    options={[
                        { label: 'A股', value: '1', },
                        { label: '港股', value: '2', },
                    ]} /> */}
            </div>
        </section>
        {stockType == '1' ?
            <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onGetData} loading={loading}  >
                {
                    data?.length > 0 ? <>

                        {
                            data.map((stockItem: any, idx: number) => <section className=" bg-accent rounded mb-3" key={stockItem.id}>
                                <div className="flex justify-end"><div onClick={() => onDetail(stockItem)} className="text-xs pl-3 pr-2 py-1 bg-yellow-500 rounded-bl-2xl !text-white">交易详情</div></div>
                                <div className="px-4 pt-1 pb-4">
                                    <div className="flex items-center mb-2">
                                        <div className="flex-1 flex items-center gap-4">
                                            <div>
                                                <div className="font-semibold text-lg">{stockItem?.stockName}</div>
                                                <div className=" text-sm text-gray-500 flex items-center gap-2"><StockType value={stockItem?.stockGid} />{stockItem?.stockCode}</div>
                                            </div>
                                            <div className=" text-red-400 text-xs">融资</div>
                                            <div className={clsx(
                                                stockItem?.preclosePx > 0 && "text-red-600",
                                                stockItem?.preclosePx < 0 && "text-green-600",
                                                stockItem?.preclosePx === 0 && "text-gray-500")}>{new BigNumber(stockItem?.preclosePx ?? 0).multipliedBy(100).toString()}%</div>

                                        </div>
                                        <div className="flex items-center"><span className="text-gray-400 text-sm">现价</span> <span className="text-red-600 font-semibold text-2xl">{stockItem?.now_price}</span></div>
                                    </div>
                                    <div className="flex py-1 gap-2">
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className=" text-gray-400 text-sm">买入价格</div>
                                            <div className=" text-base">{stockItem?.buyOrderPrice}/股</div>
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className=" text-gray-400 text-sm">数量/可用</div>
                                            <div className=" text-base">{stockItem?.orderNum}</div>
                                        </div>
                                    </div>
                                    <div className="flex py-1 gap-2">
                                    {/*     <div className="flex-1 flex items-center justify-between">
                                            <div className=" text-gray-400 text-sm">杠杆倍数</div>
                                            <div className=" text-base">{stockItem?.orderLever}</div>
                                        </div> */}
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className=" text-gray-400 text-sm">保证金</div>
                                            <div className=" text-base">{stockItem?.orderPrice}</div>
                                        </div>
                                    </div>
                                    <div className="flex py-1 gap-2">
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className=" text-gray-400 text-sm">买入手续费</div>
                                            <div className=" text-base">{stockItem?.orderFee}</div>
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className=" text-gray-400 text-sm">市值</div>
                                            <div className=" text-base">{stockItem?.orderTotalPrice}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className=" text-xs text-gray-300">盈亏</span>
                                            <span className=" font-semibold text-lg"><span className={clsx(
                                                stockItem?.allProfitAndLose > 0 && "text-red-600",
                                                stockItem?.allProfitAndLose < 0 && "text-green-600",
                                                stockItem?.allProfitAndLose === 0 && "text-gray-600")}>{stockItem?.allProfitAndLose}</span></span>
                                        </div>
                                        {positionType == '0' ? <div className="inline-flex items-center  rounded-full overflow-hidden text-xs">
                                            <div className="bg-yellow-500 text-white px-4 py-1 rounded-l-lg relative" onClick={() => onSell(stockItem)}>
                                                平仓
                                                {/*    <span className="absolute -right-1 -top-1 h-[120%] w-2  transform rotate-12 origin-center"></span> */}
                                            </div>

                                            {/*    <div className="bg-yellow-500 text-white px-4 py-1 rounded-r-lg">
                                                补仓
                                            </div> */}
                                        </div> : ''}


                                    </div>


                                </div>


                            </section>)
                        }
                    </> : ''
                }

            </InfiniteScroll> : <>
                <LoadingOrEmpty className="mt-[20vh]" />
            </>}







        <Detail open={isOpenDetail} onClose={setIsOpenDetail} stockItem={currentRow} />
    </main>
}

export default Position;
