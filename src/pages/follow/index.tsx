import { useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import { apiUser } from "@/apis/user";
import { apiDashboard } from "@/apis/dashboard";

const fmt = (v: any, d = 8) => {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(d).replace(/\.?0+$/, "");
};

const getBillSource = (txId?: string) => {
  const val = String(txId || "").toUpperCase();
  if (val.startsWith("MACHINE_BUY_P_") || val.startsWith("MACHINE_BUY_")) return "矿机购买";
  if (val.startsWith("MACHINE_SELL_")) return "矿机回收返还";
  if (val.startsWith("MACHINE_CANCEL_")) return "矿机取消返还";
  if (val.startsWith("MACHINE_DAILY_SETTLE_")) return "矿机每日收益";
  return "账户资金变动";
};

const getBillDirection = (type: any) => (Number(type) === 1 ? "收入" : Number(type) === 2 ? "支出" : "变动");
const getMachineOrderId = (txId?: string) => {
  const val = String(txId || "").toUpperCase();
  const m = val.match(/^MACHINE_(?:BUY_P|BUY|SELL|CANCEL|DAILY_SETTLE)_(?:\d{8}_)?(\d+)$/);
  return m?.[1] || "";
};
const formatDate = (val: any) => {
  if (!val) return "-";
  return String(val).replace("T", " ").replace(/\.\d+$/, "").replace("+00:00", "");
};

const Follow = () => {
  const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount });
  const { data: financeAccount } = useQuery({ fetcher: () => apiUser.getFinanceAccount({ coin: "BTC" }) });
  const { data: billList } = useQuery({ fetcher: () => apiUser.getFinanceBillList({ coin: "BTC" }) });
  const { data: revenueOverview } = useQuery({ fetcher: apiDashboard.revenueOverview });

  const rows = useMemo(() => billList || [], [billList]);

  const rates = wallet?.exchangeRates || {};
  const coinSymbol = String(financeAccount?.coinSymbol || "").toUpperCase();
  const coinRateMap: Record<string, number> = {
    USDT: Number(rates.USDT_CNY || 0),
    USDC: Number(rates.USDC_CNY || 0),
    BTC: Number(rates.BTC_CNY || 0),
  };

  const revenueCoinFromOverview = Number(revenueOverview?.totalRevenueCoin ?? 0);
  const overviewCoin = String(revenueOverview?.coinSymbol || "BTC").toUpperCase();
  const minedRevenueCny = Number(
    financeAccount?.totalRevenueCny ??
      (Number(financeAccount?.totalRevenue || 0) > 0
        ? Number(financeAccount?.totalRevenue || 0) * Number(coinRateMap[coinSymbol] || 0)
        : revenueCoinFromOverview * Number(coinRateMap[overviewCoin] || 0))
  );

  return (
    <main className="pb-10 text-sm px-3 fade-stagger">
      <section className="glass-card p-4 mt-3">
        <div className="text-base font-extrabold finance-title mb-3">收益总览 - 钱包估值</div>
        <div className="space-y-2 text-[#1a3560]">
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">总资产估值</span>
            <span className="font-semibold text-right break-all max-w-[65%] tabular-nums">￥{fmt(wallet?.totalAssetCny, 2)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">累计收益</span>
            <span className="font-semibold text-right break-all max-w-[65%] tabular-nums">￥{fmt(minedRevenueCny, 2)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">USDT 余额</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.usdtBalance)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">USDC 余额</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.usdcBalance)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">BTC 余额</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.btcBalance)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">矿机余额(USDT)</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.machineBalanceUsdt)}</span>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-[#d5e2f7] bg-white/70 p-2 text-xs text-[#46658f]">
          <div className="mb-1">国际汇率</div>
          <div className="flex items-start justify-between gap-2"><span className="shrink-0">USDT/CNY</span><span className="text-right break-all max-w-[65%] tabular-nums">{fmt(rates.USDT_CNY, 4)}</span></div>
          <div className="flex items-start justify-between gap-2"><span className="shrink-0">USDC/CNY</span><span className="text-right break-all max-w-[65%] tabular-nums">{fmt(rates.USDC_CNY, 4)}</span></div>
          <div className="flex items-start justify-between gap-2"><span className="shrink-0">BTC/CNY</span><span className="text-right break-all max-w-[65%] tabular-nums">{fmt(rates.BTC_CNY, 2)}</span></div>
        </div>
      </section>

      <section className="mt-4 glass-card p-3">
        <div className="mt-1 rounded-xl bg-white/70 border border-[#dce8ff] p-3">
          {rows.length === 0 && <div className="text-xs text-[#7086a8]">暂无数据</div>}
          {rows.map((item: any, idx: number) => (
            <div key={item.id || idx} className="finance-list-row">
              <div className="space-y-1 text-[#1a3560] text-xs">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold">{getBillSource(item.txId)}</span>
                  <span className={`font-semibold ${Number(item.type) === 1 ? "text-[#cf3f56]" : "text-[#1a57aa]"}`}>
                    {Number(item.type) === 1 ? "+" : Number(item.type) === 2 ? "-" : ""}
                    {fmt(item.amount, 8)} {item.coinSymbol || "BTC"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2 text-[#6a80a2]">
                  <span>类型: {getBillDirection(item.type)}</span>
                  <span>时间: {formatDate(item.createTime)}</span>
                </div>
                {!!getMachineOrderId(item.txId) && <div className="text-[#6a80a2]">矿机订单ID: {getMachineOrderId(item.txId)}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Follow;
