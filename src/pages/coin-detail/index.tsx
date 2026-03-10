import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { usePolling } from "@/hooks/usePolling";
import { ApiPub } from "@/apis/public";
import { ApiFavorite } from "@/apis/favorite";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { Chart } from "./components/Chart";
import { calcDailyRevenueCnyPerDisplayUnit } from "@/lib/hashrate-revenue";

const fmtCny = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  return Number.isNaN(n) ? `￥${v}` : `￥${n.toFixed(4)}`;
};

const fmtUsdt = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  return Number.isNaN(n) ? `$${v}` : `$${n.toFixed(4)}`;
};

const fmtPct = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
};

const CoinDetail = () => {

  const { id } = useParams();
  const coinId = Number(id);
  const [days, setDays] = useState<7 | 30 | 180 | 365>(7);
  const [favorite, setFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const { data: coin, loading: coinLoading, refresh: refreshCoin } = useQuery({
    fetcher: () => ApiPub.coinDetail({ id: coinId }),
    deps: [coinId],
  });
  usePolling(async () => {
    await refreshCoin();
  }, { delay: 3000, enabled: !!coinId, immediateOnActivate: false });

  const { data: chartRows, loading: chartLoading } = useQuery({
    fetcher: () => ApiPub.coinChart({ id: coinId, days }),
    deps: [coinId, days],
  });

  const chartData = useMemo(
    () =>
      (chartRows || []).map((i: any) => ({
        time: Number(i.time),
        priceCny: Number(i.priceCny ?? 0),
        changePct: Number(i.changePct ?? 0),
      })),
    [chartRows]
  );

  const riseDownClass = Number(coin?.priceChange24h ?? 0) >= 0 ? "text-[#0f9f64]" : "text-[#cf3f56]";
  const unitRevenue = useMemo(
    () => calcDailyRevenueCnyPerDisplayUnit(coin?.dailyRevenuePerP, coin?.networkHashrate, coin?.priceCny),
    [coin?.dailyRevenuePerP, coin?.networkHashrate, coin?.priceCny]
  );
  const priceUsdt = useMemo(() => {
    const direct = Number(coin?.priceUsd);
    if (Number.isFinite(direct) && direct > 0) return direct;
    const cny = Number(coin?.priceCny || 0);
    if (!Number.isFinite(cny) || cny <= 0) return 0;
    return Number((cny / 7.2).toFixed(8));
  }, [coin?.priceUsd, coin?.priceCny]);

  useEffect(() => {
    const symbol = coin?.symbol;
    if (!symbol) return;
    ApiFavorite.check(symbol)
      .then((res: any) => {
        setFavorite(!!res?.data?.favorite);
      })
      .catch(() => {});
  }, [coin?.symbol]);

  const toggleFavorite = async () => {
    const symbol = coin?.symbol;
    if (!symbol || favLoading) return;
    setFavLoading(true);
    try {
      if (favorite) {
        const res: any = await ApiFavorite.remove(symbol);
        setFavorite(!!res?.data?.favorite);
      } else {
        const res: any = await ApiFavorite.add(symbol);
        setFavorite(!!res?.data?.favorite);
      }
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <main className="pb-10 px-3 text-sm fade-stagger">
      <AppNav
        title={coin?.symbol ? `${coin.symbol} 详情` : "币种详情"}
        right={
          <button onClick={toggleFavorite} disabled={favLoading} className="p-1" title={favorite ? "取消自选" : "加入自选"}>
            {favorite ? <StarSolid className="w-5 h-5 text-[#f4b400]" /> : <StarOutline className="w-5 h-5 text-[#6f88ac]" />}
          </button>
        }
      />

      <section className="glass-card p-4 mt-3">
        {coinLoading ? (
          <div className="text-[#6a7f9f] text-xs">加载中...</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold finance-title">{coin?.symbol || "-"}</div>
                <div className="text-xs text-[#6a7f9f]">{coin?.name || "-"}</div>
              </div>
              <img src={coin?.logo} className="w-10 h-10 rounded-full" />
            </div>

            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#16305a]">{fmtCny(coin?.priceCny)}</div>
              <div className="text-sm text-[#486b98] mt-1">{fmtUsdt(priceUsdt)}</div>
              <div className={`text-xs mt-1 ${riseDownClass}`}>24h涨跌: {fmtPct(coin?.priceChange24h)}</div>
            </div>
          </>
        )}
      </section>

      <section className="mt-3 flex gap-2">
        <button className={`px-3 py-1.5 rounded-lg border text-xs ${days === 7 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(7)}>
          7天走势
        </button>
        <button className={`px-3 py-1.5 rounded-lg border text-xs ${days === 30 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(30)}>
          30天走势
        </button>
        <button className={`px-3 py-1.5 rounded-lg border text-xs ${days === 180 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(180)}>
          6月走势
        </button>
        <button className={`px-3 py-1.5 rounded-lg border text-xs ${days === 365 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(365)}>
          1年走势
        </button>
      </section>

      {chartLoading ? <div className="text-[#6a7f9f] text-xs mt-3">走势图加载中...</div> : <Chart data={chartData} />}

      <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">关键指标</div>
        <div className="finance-kv">
          <div className="flex justify-between"><span>全网算力</span><span>{coin?.networkHashrate || "-"}</span></div>
          <div className="flex justify-between"><span>算力</span><span>{coin?.poolHashrate || "-"}</span></div>
          <div className="flex justify-between"><span>每{unitRevenue.unit}预计日收益</span><span>{fmtCny(unitRevenue.revenueCny)}</span></div>
          <div className="flex justify-between"><span>算法</span><span>{coin?.algorithm || "-"}</span></div>
          <div className="flex justify-between"><span>24h最高</span><span>{fmtCny(coin?.high24h)}</span></div>
          <div className="flex justify-between"><span>24h最低</span><span>{fmtCny(coin?.low24h)}</span></div>
          <div className="flex justify-between"><span>流通市值</span><span>{coin?.marketCap ?? "-"}</span></div>
          <div className="flex justify-between"><span>24h成交量</span><span>{coin?.totalVolume ?? "-"}</span></div>
        </div>
      </section>

    </main>
  );
};

export default CoinDetail;
