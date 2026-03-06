import { useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import { apiDashboard } from "@/apis/dashboard";
import { ApiPub } from "@/apis/public";

const StockQuotes = () => {
    const { data: workerStats } = useQuery({ fetcher: apiDashboard.workerStats });
    const { data: overview } = useQuery({ fetcher: apiDashboard.revenueOverview });
    const { data: chart } = useQuery({ fetcher: () => apiDashboard.hashrateChart("24h") });
    const { data: poolStats } = useQuery({ fetcher: ApiPub.poolStats, params: {} });

    const firstCoin = useMemo(() => (poolStats && poolStats.length ? poolStats[0] : null), [poolStats]);

    return (
        <main className="pb-10 text-sm px-4">
            <section className="rounded-xl border p-4 mt-3">
                <div className="text-base font-semibold mb-3">矿机面板</div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div>总矿机: {overview?.totalWorkers ?? workerStats?.total ?? 0}</div>
                    <div>在线/离线: {overview?.onlineWorkers ?? workerStats?.online ?? 0} / {overview?.offlineWorkers ?? workerStats?.offline ?? 0}</div>
                    <div>24h 平均算力: {overview?.avgHashrate24h ?? 0} {overview?.hashrateUnit || "TH/s"}</div>
                    <div>昨日收益: {overview?.yesterdayRevenueCoin ?? 0} {overview?.coinSymbol || "BTC"}</div>
                    <div>今日挖矿: {overview?.todayMinedCoin ?? 0} {overview?.coinSymbol || "BTC"}</div>
                    <div>总收益: {overview?.totalRevenueCoin ?? 0} {overview?.coinSymbol || "BTC"}</div>
                </div>
            </section>

            <section className="rounded-xl border p-4 mt-3">
                <div className="text-base font-semibold mb-2">算力走势图</div>
                <div className="text-xs text-gray-500 mb-2">24h 点位数: {Array.isArray(chart) ? chart.length : 0}</div>
                <div className="max-h-40 overflow-auto text-xs">
                    {(chart || []).slice(-10).map((p: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-1 border-b">
                            <span>{new Date(p.time).toLocaleString()}</span>
                            <span>{Number(p.hashrate || 0).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-xl border p-4 mt-3">
                <div className="text-base font-semibold mb-2">全网信息</div>
                <div className="text-xs space-y-2">
                    <div className="flex justify-between"><span>币种</span><span>{firstCoin?.symbol || "-"}</span></div>
                    <div className="flex justify-between"><span>全网算力</span><span>{firstCoin?.networkHashrate || "-"}</span></div>
                    <div className="flex justify-between"><span>矿池算力</span><span>{firstCoin?.poolHashrate || "-"}</span></div>
                    <div className="flex justify-between"><span>每P日收益</span><span>{firstCoin?.dailyRevenuePerP ?? "-"}</span></div>
                    <div className="flex justify-between"><span>价格(CNY)</span><span>{firstCoin?.priceCny ?? "-"}</span></div>
                </div>
            </section>
        </main>
    );
};

export default StockQuotes;
