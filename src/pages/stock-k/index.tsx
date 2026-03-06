import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { ApiStock } from "@/apis/stockInfo";
import { useEffect, useMemo, useState } from "react";
import Buy from "./components/Buy";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { Spin } from "antd";
import { useUserContext } from "@/contexts/user/userContext";
import Kchart from "./components/Kchart";
import clsx from "clsx";
const stockType = 'in'
import { Skeleton } from "@/components/ui/skeleton"
import { usePolling } from "@/hooks/usePolling";

const StockK = () => {
  const { code } = useParams<{ code: string }>();
  const [interval, SetInterval] = useState('D')
  const [isOpenBuy, setIsOpenBuy] = useState(false)
  const [isOptional, setIsOptional] = useState(false)
  const context = useUserContext();
  const { loading: userLoading, userInfo, amountInfo } = context.store;


  const { data: stockData, initLoading: stockLoading, refresh } = useQuery({
    fetcher: ApiStock.getSingleStock,
    params: { code, stockType }
  });

  usePolling(refresh, { delay: 2000 });





  const stockInfo = useMemo(() => {
    return stockData?.stock || null
  }, [stockData])
  const buyDisabled = useMemo(() => {
    return false;
    if (stockInfo?.gid == 'HK') {
      return true
    }
    return false
  }, [stockInfo])

  useEffect(() => {
    setIsOptional(stockInfo?.isOptional)
  }, [stockInfo])



  const { mutate: $del, loading: delLoading } = useMutation({
    fetcher: ApiStock.delOptional,
    onSuccess: () => {
      toast.success("已取消");
      setIsOptional(false)


    },
  });

  const { mutate: $add, loading: addLoading } = useMutation({
    fetcher: ApiStock.addOptional,
    onSuccess: () => {
      toast.success("已添加");
      setIsOptional(true)

    },
  });




  const onBuy = () => {
    if (stockLoading) {
      return;
    }
    if (buyDisabled) {
      return;
    }
    setIsOpenBuy(true)
  }
  const onDel = () => {
    if (delLoading) {
      return
    }
    $del({ code })
  }
  const onAdd = () => {
    if (addLoading) return
    $add({ code })
  }



  return (
    <main >
      <AppNav title={stockInfo?.name} />
      <section className="px-5 pb-2">
        {stockLoading ? <>
          <Skeleton className="h-7 mb-5 w-[40vw]" />
        </> : <>  <div className={clsx(
          'flex items-center gap-4 font-semibold mb-4', stockInfo?.hcrate > 0 && "text-red-600",
          stockInfo?.hcrate < 0 && "text-green-600",
          stockInfo?.hcrate == 0 && "text-gray-500")}><span className=" text-3xl ">{stockInfo?.nowPrice}</span><span>{stockInfo?.hcrate}%</span></div></>}

        <div className=" text-sm text-gray-400 flex gap-4 mb-1">
          <div className="flex-1 flex justify-between">
            <div className="">今开</div>
            {stockLoading ? <Skeleton className="h-5  flex-1" /> : <div className=" text-foreground font-semibold">{stockInfo?.open_px}</div>}


          </div>
          <div className="flex-1 flex justify-between">
            <div className="">最高</div>
            {stockLoading ? <Skeleton className="h-5  flex-1" /> : <div className=" text-foreground font-semibold">{stockInfo?.today_max}</div>}

          </div>
          <div className="flex-1 flex justify-between">
            <div className="">成交</div>
            {stockLoading ? <Skeleton className="h-5  flex-1" /> : <div className=" text-foreground font-semibold">{stockInfo?.business_amount}</div>}

          </div>
        </div>
        <div className=" text-sm text-gray-400 flex gap-4">
          <div className="flex-1 flex justify-between">
            <div className="">昨收</div>
            {stockLoading ? <Skeleton className="h-5  flex-1" /> : <div className=" text-foreground font-semibold">{stockInfo?.preclose_px}</div>}

          </div>
          <div className="flex-1 flex justify-between">
            <div className="">最低</div>
            {stockLoading ? <Skeleton className="h-5  flex-1" /> : <div className=" text-foreground font-semibold">{stockInfo?.today_min}</div>}

          </div>
          <div className="flex-1 flex justify-between">
            <div className="">金额</div>
            {stockLoading ? <Skeleton className="h-5  flex-1" /> : <div className=" text-foreground font-semibold">{stockInfo?.business_balance}</div>}

          </div>
        </div>

      </section>
      <div className=" h-2 bg-gray-900"></div>
      <Kchart stockCode={code || ''} />

      <section className=" flex fixed bottom-0 left-0 w-full">
        <div className=" text-white flex w-40 items-center justify-center bg-gray-800 h-14 gap-2">
          {stockLoading ? <Spin className=" " /> : <>
            <Spin spinning={delLoading || addLoading}></Spin>{isOptional ? <div onClick={onDel}>删除自选</div> : <div onClick={onAdd}>添加自选</div>}
          </>}

        </div>
        <div className={clsx('text-white flex flex-1 items-center justify-center bg-primary', buyDisabled ? ' opacity-60' : '')} onClick={onBuy}>买入</div>

      </section>
      <Buy open={isOpenBuy} onClose={setIsOpenBuy} stockInfo={stockInfo} />

    </main>
  );
};

export default StockK;
