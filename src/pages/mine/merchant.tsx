import { Pagination } from "@/components/Pagination/Pagination";
import { useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePagination";
import { apiCollect } from "@/apis/collect";
import { Spin } from "antd";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { useTranslation } from "react-i18next";
import { useRefreshOnLanguageChange } from "@/hooks/useRefreshOnLanguageChange";

export default function MineMerchant() {
    const { t } = useTranslation();
    const {
        data: storeData,
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
            collectType: 1,
        }
    });
    useRefreshOnLanguageChange(() => {
        refresh();
    });
    return (
        <>
            <h1 className="text-gray-900 font-semibold text-lg pb-5">
                {t("mineMerchant.followedShops")} ({total})
            </h1>
            <LoadingOrEmpty loading={loading} data={storeData} />

            <div className="flex flex-wrap justify-start gap-4">
                {storeData?.map((store, index) => (
                    <div
                        key={index}
                        className="w-full sm:flex-shrink-0 sm:w-[390px]"
                    >
                   {/*      <MerchantCard
                            avatar={store?.storeLogo}
                            name={store?.storeName}
                            rating={Number(store?.storeScore || 0)}
                            sold={store?.salesCount}
                            views={store?.viewsNum}
                            rate={store?.storeScore}
                            isFollowed={true}
                            id={store.id}
                        /> */}
                    </div>
                ))}
            </div>

            {total > 0 ? <div className="mt-10 sm:mt-20 flex justify-center w-full text-gray-900">
                <Pagination
                    pageNum={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={(p) => setPage(p)}
                />
            </div> : ''}
        </>
    )
}
