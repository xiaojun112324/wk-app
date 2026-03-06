import { useEffect, useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeftIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useRefreshOnLanguageChange } from "@/hooks/useRefreshOnLanguageChange";
import { useBack } from "@/hooks/useBack";
import { ApiStock } from "@/apis/stockInfo";
import InfiniteScroll from "@/components/InfiniteScroll";
import StockType from "@/components/StockType";
import AppNav from "@/components/AppNav";
import clsx from "clsx";
import { getPriceColor } from "@/lib/getPriceColor";
import { useQuery } from "@/hooks/useQuery";
import { apiFollow } from "@/apis/follow";

export default function Search() {
 

    const goBack = useBack("/");
    const {
        data,
        total,
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
        fetcher: ApiStock.getStock,
        incremental: true,
        immediate: false

    });

    const onGetData = () => { }


    const [keyword, setKeyword] = useState("");

    const handleSearch = () => {
        if (keyword.trim() === "") return;

        run({ newParams: { stockType: 'in', keyWords: keyword }, newPagination: { page: 1, pageSize } });
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };


    return (
        <div>
            <AppNav title="股票搜索" />
            <div className="flex  px-5 items-center gap-1 ">
                <input value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown} placeholder="请输入股票名称/代码"
                    className="flex-1 border-0 outline-0 placeholder:text-sm bg-accent rounded-full py-2 px-5" />
                <span className="text-sm  text-muted-foreground  px-2 py-1 flex items-center justify-center" onClick={handleSearch}>搜索</span>
            </div>
            <InfiniteScroll hasMore={hasMore} empty={isEmpty} emptyNode={<></>} loadMore={onGetData} loading={loading}  >
                <div className=" px-5 py-4">
                    {
                        data?.length > 0 ? <>
                            <div className=" flex text-sm text-gray-400">
                                <div className="flex-1">股票</div>
                                <div className=" text-center w-30">最新</div>
                                <div className=" text-center w-30">涨幅</div>
                            </div>

                            {
                                data.map((item: any, idx: number) => <Link to={`/stockk/${item.code}`} className="   rounded py-2  items-center flex" key={item.code}>

                                    <div className="flex-1 text-sm">
                                        <div className="mb-1">{item?.name}</div>
                                        <div className=" text-gray-400"><StockType value={item?.stockGid} className="mr-1" />{item?.code}</div>
                                    </div>
                                    <div className={clsx("w-30 text-sm text-center  font-semibold", getPriceColor(item?.preclose_px))}>{item?.nowPrice || '-'}</div>
                                    <div className={clsx("w-30 text-sm text-center  font-semibold", getPriceColor(item?.preclose_px))}>{item?.preclose_px || '-'}</div>

                                </Link>)
                            }
                        </> : ''
                    }
                </div>

            </InfiniteScroll>


        </div>
    )
}
