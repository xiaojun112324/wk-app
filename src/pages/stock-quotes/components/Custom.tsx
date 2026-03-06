import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { useMemo, useState } from "react";
import TabsScroll from "@/components/TabsScroll";
import { MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { ApiStock } from "@/apis/stockInfo";
import InfiniteScroll from "@/components/InfiniteScroll";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { Button } from "@/components/Button";
import StockCusItem from "./StockCusItem";
import { Modal } from "antd";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import StockType from "@/components/StockType";
import { usePolling } from "@/hooks/usePolling";




const Custom = () => {
    const nav = useNavigate();

    const {
        data: originData,
        total,
        initLoading,
        page,
        pageSize,
        hasMore,
        isEmpty,
        error,
        loading,
        run,
        setPage,
        refresh: refreshStore
    } = usePaginatedQuery({
        fetcher: ApiStock.getOptionStock,
        incremental: true,
    });
    const {
        data: updata,
        run: $updata

    } = usePaginatedQuery({
        fetcher: ApiStock.getOptionStock,
        isRestData: false,
        immediate: false,
    });

    usePolling(async () => {
        const fetcher = ApiStock.getOptionStock;
        await $updata({ newParams: { stockType: 'in', showType: 0 }, overrideFetcher: fetcher, newPagination: { page: 1, pageSize: pageSize * page } });
    }, { delay: 2000 });
    const { mutate: $del, loading: delLoading } = useMutation({
        fetcher: ApiStock.delOptional,
        onSuccess: () => {
            toast.success("已取消");
            run({ newParams: { stockType: 'in', showType: 0 }, newPagination: { page: 1, pageSize } });

        },
    });

 

    const data = useMemo(() => {
        if (!originData) return [];
        // 创建一个 Map 方便快速查找
        if (!updata) {
            return originData;
        }
        const updateMap = new Map(updata.map(item => [item.code, item]));

        return originData.map(item => {
            // 如果 updata 中有同 id 的项，则使用更新后的值，否则保留原值
            return updateMap.has(item.code) ? { ...item, ...updateMap.get(item.code) } : item;
        });

    }, [updata, originData])
    const onGetData = async () => {
        console.log('loadmore')
        setPage(page + 1)
    }
    const onDeleteStock = (item: any) => {
        Modal.confirm({
            title: '确定删除？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                $del({
                    code: item?.code
                })
            },
        });
    }
    const onLink = (item: any) => {
        nav(`/stockk/${item.code}`)

    }

    return <main className="pb-10">

   
        <InfiniteScroll hasMore={hasMore} empty={isEmpty} loadMore={onGetData} loading={loading} initLoading={initLoading}  >
            {
                data?.length > 0 ? <div className="px-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground rounded-lg px-2 py-3">
                        <div className="w-26 text-left">名称代码</div>
                        <div className=" flex-1 text-center">价格</div>
                        <div className="flex-1  text-center">涨跌幅</div>
                        <div className=" flex-1  text-center">删除</div>
                    </div>
                    {
                        data?.map((item: any, idx: number) => <StockCusItem item={item} key={idx} onDelete={onDeleteStock} onClick={onLink} />)
                    }
                </div> : ''
            }

        </InfiniteScroll>
        <div className="px-5">
            <Link to="/search"> <Button full className="mt-5">添加自选</Button></Link>
        </div>




    </main>
}

export default Custom;
