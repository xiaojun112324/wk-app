import { useMemo, useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";
import { apiDashboard } from "@/apis/dashboard";
import { apiOrder } from "@/apis/order";
import { formatDate } from "@/lib/format-time";
import { toast } from "sonner";

const getMachineOrderStatusText = (status: any) => {
  const s = Number(status);
  if (s === 1) return "持有中";
  if (s === 2) return "已卖出";
  if (s === 3) return "已取消";
  if (s === 0) return "待生效";
  return "未知状态";
};

const getMachineOrderStatusClass = (status: any) => {
  const s = Number(status);
  if (s === 1) return "bg-[#eaf7ef] text-[#0f9f64] border-[#b9e7ca]";
  if (s === 2) return "bg-[#eef4ff] text-[#1d5fd0] border-[#c8d9ff]";
  if (s === 3) return "bg-[#fff1f3] text-[#cf3f56] border-[#ffc9d0]";
  return "bg-[#f4f7fb] text-[#5d7ca8] border-[#d7e2f1]";
};

const toIntPositive = (val: any) => {
  const n = Number(val || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.floor(Math.abs(n));
};

const num = (v: any) => {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n : 0;
};

const valueClass = (v: any) => (num(v) > 0 ? "text-[#cf3f56] font-semibold" : "text-[#2d4d78]");

const StockQuotes = () => {
  const [orderTab, setOrderTab] = useState<"all" | "holding" | "ended">("all");

  const { data: workerStats } = useQuery({ fetcher: apiDashboard.workerStats });
  const { data: overview } = useQuery({ fetcher: apiDashboard.revenueOverview });
  const { data: orders, refresh } = useQuery({ fetcher: apiOrder.listMachineOrders });

  const { mutate: doSell, loading: sellLoading } = useMutation({
    fetcher: (payload: any) => apiOrder.sellMachineOrder(payload.id, {}),
    onSuccess: () => {
      toast.success("卖出成功");
      refresh();
    },
  });

  const filteredOrders = useMemo(() => {
    const list = orders || [];
    if (orderTab === "holding") {
      return list.filter((i: any) => Number(i.status) === 1);
    }
    if (orderTab === "ended") {
      return list.filter((i: any) => Number(i.status) === 2 || Number(i.status) === 3);
    }
    return list;
  }, [orders, orderTab]);

  return (
    <main className="pb-10 text-sm px-3 fade-stagger">
      <section className="glass-card p-4 mt-3">
        <div className="text-base font-extrabold finance-title mb-3">矿机面板</div>
        <div className="finance-kv">
          <div>总矿机: {overview?.totalWorkers ?? workerStats?.total ?? 0}</div>
          <div>在线/离线: {overview?.onlineWorkers ?? workerStats?.online ?? 0} / {overview?.offlineWorkers ?? workerStats?.offline ?? 0}</div>
          <div>24h 平均算力: {overview?.avgHashrate24h ?? 0} {overview?.hashrateUnit || "PH/s"}</div>
          <div>昨日收益: <span className={valueClass(overview?.yesterdayRevenueCoin)}>{overview?.yesterdayRevenueCoin ?? 0} {overview?.coinSymbol || "BTC"}</span></div>
          <div>今日挖矿: <span className={valueClass(overview?.todayMinedCoin)}>{overview?.todayMinedCoin ?? 0} {overview?.coinSymbol || "BTC"}</span></div>
          <div>总收益: <span className={valueClass(overview?.totalRevenueCoin)}>{overview?.totalRevenueCoin ?? 0} {overview?.coinSymbol || "BTC"}</span></div>
        </div>
      </section>

      <section className="glass-card p-4 mt-3">
        <div className="text-base font-extrabold finance-title mb-2">矿机订单列表</div>

        <div className="flex gap-2 mb-3">
          <button
            className={`px-3 py-1.5 rounded-lg border text-xs ${orderTab === "all" ? "finance-btn-primary" : "finance-btn-ghost"}`}
            onClick={() => setOrderTab("all")}
          >
            全部
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg border text-xs ${orderTab === "holding" ? "finance-btn-primary" : "finance-btn-ghost"}`}
            onClick={() => setOrderTab("holding")}
          >
            持有中
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg border text-xs ${orderTab === "ended" ? "finance-btn-primary" : "finance-btn-ghost"}`}
            onClick={() => setOrderTab("ended")}
          >
            已结束
          </button>
        </div>

        {filteredOrders.length === 0 && <div className="text-xs text-[#7086a8]">暂无订单</div>}
        <div className="space-y-2">
          {filteredOrders.map((item: any) => (
            <div key={item.id} className="finance-list-row">
              <div className="flex justify-between mb-2">
                <div className="font-semibold text-[#173a69]">{item.machineName || "-"} ({item.coinSymbol || "-"})</div>
                <div className={`finance-chip border ${getMachineOrderStatusClass(item.status)}`}>
                  {getMachineOrderStatusText(item.status)}
                </div>
              </div>
              <div className="finance-kv">
                <div>订单ID: {item.id}</div>
                <div>数量: {toIntPositive(item.quantity)}</div>
                <div>总投资: {item.totalInvest} USDT</div>
                <div>算力: {toIntPositive(Number(item.totalHashrateTH || 0) / 1000)} PH/s</div>
                <div>今日收益(BTC): <span className={valueClass(item.todayRevenueCoin)}>{item.todayRevenueCoin}</span></div>
                <div>总收益(BTC): <span className={valueClass(item.totalRevenueCoin)}>{item.totalRevenueCoin}</span></div>
                <div className="col-span-2">买入时间: {formatDate(item.createTime)}</div>
                {Number(item.status) === 1 && <div className="col-span-2">锁定到期时间: {formatDate(item.lockUntil)}</div>}
              </div>
              {Number(item.status) === 1 && (
                <div className="flex gap-2 mt-3">
                  <button
                    className="finance-btn-primary px-3 py-1.5 rounded-xl"
                    disabled={sellLoading}
                    onClick={() => doSell({ id: item.id })}
                  >
                    卖出
                  </button>
                </div>
              )}
              {(Number(item.status) === 2 || Number(item.status) === 3) && (
                <div className="mt-2 text-[#7b90b3]">
                  卖出时间: {formatDate(item.sellTime)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default StockQuotes;

