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
import { Modal } from "antd";
import { ApiStock } from "@/apis/stockInfo";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import clsx from "clsx";
import BigNumber from "bignumber.js";
import { usePolling } from "@/hooks/usePolling";
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/Button";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { apiFollow } from "@/apis/follow";


const Invite = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [positionType, setPositionType] = useState('0')
    const [stockType, setStockType] = useState('1')
    const [isOpenDetail, setIsOpenDetail] = useState(false)
    const [currentRow, setCurrentRow] = useState<any>(null)
    const [date, setDate] = useState<Date | undefined>(
        new Date(2025, 5, 12)
    )
    const { data: levelData, loading: levelLoading } = useQuery({
        fetcher: apiFollow.getUserLevelInfo,

    });
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
    const onCopy = () => {



        const inviteCode = `${window.location.origin}/register?inviteCode=${levelData?.parentInviteCode}`;
        copyToClipboard(inviteCode).then(() => {
            toast.success('邀请链接已复制到剪贴板')
        })

    }


    return <main className=" w-full max-w-xl mx-auto ">
        <AppNav title="邀请好友" />
        <div className=" relative">
            <section className=" relative">
                <img src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/invite-bg-1.png" />
                <div className=" absolute bottom-0 left-0 w-full h-[15vh] " onClick={onCopy}></div>
            </section>
            <section className=" relative">
                <img src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/invite-bg-2.png" />
                <div className=" absolute top-0 left-0 w-full h-full"></div>
            </section>
            <section className=" relative">
                <img src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/invite-bg-3.png" />
                <div className=" absolute top-0 left-0 w-full h-full pt-5">
                    <div className=" flex items-center justify-between px-[10%]">
                        <div className="text-center">
                            <div className=" text-2xl font-semibold text-white">{levelData?.allInviteCount || 0}</div>
                            <div className=" text-gray-200 text-sm mt-2">共邀请好友</div>
                        </div>
                        <div className="text-center">
                            <div className=" text-2xl font-semibold text-white">{levelData?.inviteCount || 0}</div>
                            <div className=" text-gray-200 text-sm mt-2"> 有效人数</div>
                        </div>
                        <div className="text-center">
                            <div className=" text-2xl font-semibold text-white">{levelData?.inviteTotalProfit || 0}</div>
                            <div className=" text-gray-200 text-sm mt-2">获得奖励（元）</div>
                        </div>
                    </div>
                    <Link to="/center" className=" h-[10vh] block   mt-[5vh] w-full"></Link>
                </div>
            </section>
            {/*         <section className=" absolute top-0 left-0 w-full h-full z-[1]">
                <div className="mt-[82%] h-[120px] bg-red-300"></div>
                <div className="mt-[65%]  flex items-center justify-between px-[10%]">
                    <div className="text-center">
                        <div className=" text-2xl font-semibold text-white">2</div>
                        <div className=" text-gray-200 text-sm mt-2">共邀请好友</div>
                    </div>
                    <div className="text-center">
                        <div className=" text-2xl font-semibold text-white">2</div>
                        <div className=" text-gray-200 text-sm mt-2"> 有效人数</div>
                    </div>
                    <div className="text-center">
                        <div className=" text-2xl font-semibold text-white">2</div>
                        <div className=" text-gray-200 text-sm mt-2">获得奖励（元）</div>
                    </div>
                </div>
                <div className=" mt-[4vh] bg-red-100 h-[80px]">

                </div>
            </section> */}


        </div>









    </main>
}

export default Invite;
