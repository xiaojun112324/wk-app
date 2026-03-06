import { useMemo } from "react"

import ShopSwiper from "@/components/ShopSwiper/ShopSwiper";
import { Button } from "@/components/ui/button";
import { AccountPanel } from "./components/AccountPanel";
import { apiCollect } from "@/apis/collect";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { Pagination } from "@/components/Pagination/Pagination";
import { Spin } from "antd";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { useTranslation } from "react-i18next";
import { useRefreshOnLanguageChange } from "@/hooks/useRefreshOnLanguageChange";

export default function FavoriteProducts() {
    const { t } = useTranslation();
    const {
        data: goodsData,
        total,
        page,
        pageSize,
        loading,
        run,
        setPage,
        setPageSize,
        refresh
    } = usePaginatedQuery({
        fetcher: (params) => apiCollect.getCollectList(params),
        params: {
            collectType: 0,
        }
    });
    useRefreshOnLanguageChange(() => {
        refresh();
    });

    return <div className="">

        <h1 className=" text-lg font-semibold text-gray-900 mb-5 ">{t("favoriteProducts.collectedGoods")}({total})</h1>
        <LoadingOrEmpty loading={loading} data={goodsData} />
        {loading ? '' : <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 
                sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {goodsData.map((product, index) => <div key={index} {...product} />)}
        </div>}



        {total > 0 ? <div className="mt-10 sm:mt-20 flex justify-center w-full text-gray-900">
            <Pagination
                pageNum={page}
                pageSize={pageSize}
                total={total}
                onPageChange={(p) => setPage(p)}
            />
        </div> : ''}

    </div>
}
