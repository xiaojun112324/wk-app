import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { usePolling } from "@/hooks/usePolling";
import { ApiPub } from "@/apis/public";
import { ApiFavorite } from "@/apis/favorite";
import { getToken } from "@/lib/token";
import { FinanceCardSkeleton } from "@/components/finance-skeleton";
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

const fmtMaybe = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
};

const fmtNum = (v: any, digits = 2) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toFixed(digits).replace(/\.?0+$/, "");
};

const fmtCoinAmount = (v: any, digits = 8) => {
  if (v === null || v === undefined || v === "") return "-";
  const raw = String(v).trim();
  const m = raw.match(/^([0-9]+(?:\.[0-9]+)?)\s*([A-Za-z0-9]+)?$/);
  if (!m) return raw;
  const num = Number(m[1]);
  if (!Number.isFinite(num)) return raw;
  const amount = num.toFixed(digits).replace(/\.?0+$/, "");
  return m[2] ? `${amount} ${m[2]}` : amount;
};

const CoinDetail = () => {

  const { id } = useParams();
  const coinId = Number(id);
  const hasToken = !!getToken();
  const [days, setDays] = useState<7 | 30 | 180 | 365>(30);
  const [favorite, setFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const { data: coin, initLoading: coinInitLoading, refresh: refreshCoin } = useQuery({
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
    if (!symbol || !hasToken) {
      setFavorite(false);
      return;
    }
    ApiFavorite.check(symbol)
      .then((res: any) => {
        setFavorite(!!res?.data?.favorite);
      })
      .catch(() => {});
  }, [coin?.symbol, hasToken]);

  const toggleFavorite = async () => {
    const symbol = coin?.symbol;
    if (!symbol || favLoading) return;
    if (!hasToken) {
      toast.warning("\u8bf7\u5148\u767b\u5f55");
      return;
    }
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
        {coinInitLoading ? (
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

      <section className="mt-3 grid grid-cols-4 gap-2">
        <button className={`w-full px-3 py-1.5 rounded-lg border text-xs ${days === 7 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(7)}>
          7天走势
        </button>
        <button className={`w-full px-3 py-1.5 rounded-lg border text-xs ${days === 30 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(30)}>
          30天走势
        </button>
        <button className={`w-full px-3 py-1.5 rounded-lg border text-xs ${days === 180 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(180)}>
          6月走势
        </button>
        <button className={`w-full px-3 py-1.5 rounded-lg border text-xs ${days === 365 ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setDays(365)}>
          1年走势
        </button>
      </section>

      {chartLoading ? <div className="text-[#6a7f9f] text-xs mt-3">走势图加载中...</div> : <Chart data={chartData} />}

      {coinInitLoading ? <FinanceCardSkeleton lines={8} /> : <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">关键指标</div>
        <div className="finance-kv">
          <div className="flex justify-between"><span>全网算力</span><span>{coin?.networkHashrate || "-"}</span></div>
          <div className="flex justify-between"><span>矿池算力</span><span>{coin?.poolHashrate || "-"}</span></div>
          <div className="flex justify-between"><span>每{unitRevenue.unit}预计日收益</span><span>{fmtCny(unitRevenue.revenueCny)}</span></div>
          <div className="flex justify-between"><span>算法</span><span>{coin?.algorithm || "-"}</span></div>
          <div className="flex justify-between"><span>24h最高</span><span>{fmtCny(coin?.high24h)}</span></div>
          <div className="flex justify-between"><span>24h最低</span><span>{fmtCny(coin?.low24h)}</span></div>
          <div className="flex justify-between"><span>流通市值</span><span>{coin?.marketCap ?? "-"}</span></div>
          <div className="flex justify-between"><span>24h成交量</span><span>{fmtNum(coin?.totalVolume, 2)}</span></div>
        </div>
      </section>}

      {coinInitLoading ? <FinanceCardSkeleton lines={6} /> : <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">挖矿数据</div>
        <div className="finance-kv">
          <div className="flex justify-between"><span>当前区块</span><span>{fmtMaybe(coin?.currentBlockHeight)}</span></div>
          <div className="flex justify-between"><span>当前挖矿难度</span><span>{fmtMaybe(coin?.networkDifficulty)}</span></div>
          <div className="flex justify-between"><span>区块奖励</span><span>{fmtMaybe(coin?.blockReward)}</span></div>
          <div className="flex justify-between"><span>出块时间</span><span>{fmtMaybe(coin?.blockTime)}</span></div>
          <div className="flex justify-between"><span>理论日产出币</span><span>{fmtCoinAmount(coin?.estimatedDailyOutputCoin, 4)}</span></div>
          <div className="flex justify-between"><span>费率</span><span>{fmtMaybe(coin?.feeRate)}</span></div>
        </div>
      </section>}

    </main>
  );
};

export default CoinDetail;
