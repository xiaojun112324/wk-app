import { useMemo, useState } from "react";
import TabsScroll from "@/components/TabsScroll";
import { useQuery } from "@/hooks/useQuery";
import { apiUser } from "@/apis/user";
import { apiDashboard } from "@/apis/dashboard";

const fmt = (v: any, d = 8) => {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(d).replace(/\.?0+$/, "");
};

const Follow = () => {
  const [tab, setTab] = useState(1);
  const tabs = [
    { key: 1, label: "\u6536\u76ca\u660e\u7ec6" },
    { key: 2, label: "\u8fd4\u5229\u660e\u7ec6" },
  ];

  const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount });
  const { data: financeAccount } = useQuery({ fetcher: () => apiUser.getFinanceAccount({ coin: "BTC" }) });
  const { data: billList } = useQuery({ fetcher: () => apiUser.getFinanceBillList({ coin: "BTC" }) });
  const { data: inviteSummary } = useQuery({ fetcher: apiUser.getInviteSummary });
  const { data: rebateList } = useQuery({ fetcher: apiUser.getInviteRebateList });
  const { data: revenueOverview } = useQuery({ fetcher: apiDashboard.revenueOverview });

  const rows = useMemo(() => (tab === 1 ? billList || [] : rebateList || []), [tab, billList, rebateList]);

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
  const totalIncomeCny = minedRevenueCny + Number(inviteSummary?.totalRebateCny ?? 0);

  return (
    <main className="pb-10 text-sm px-3 fade-stagger">
      <section className="glass-card p-4 mt-3">
        <div className="text-base font-extrabold finance-title mb-3">{"\u6536\u76ca\u603b\u89c8 - \u94b1\u5305\u4f30\u503c"}</div>
        <div className="space-y-2 text-[#1a3560]">
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">{"\u603b\u8d44\u4ea7\u4f30\u503c"}</span>
            <span className="font-semibold text-right break-all max-w-[65%] tabular-nums">{"\uffe5"}{fmt(wallet?.totalAssetCny, 2)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">{"\u7d2f\u8ba1\u6536\u76ca"}</span>
            <span className="font-semibold text-right break-all max-w-[65%] tabular-nums">{"\uffe5"}{fmt(totalIncomeCny, 2)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">{"USDT \u4f59\u989d"}</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.usdtBalance)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">{"USDC \u4f59\u989d"}</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.usdcBalance)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">{"BTC \u4f59\u989d"}</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.btcBalance)}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">{"\u77ff\u673a\u4f59\u989d(USDT)"}</span>
            <span className="text-right break-all max-w-[65%] tabular-nums">{fmt(wallet?.machineBalanceUsdt)}</span>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-[#d5e2f7] bg-white/70 p-2 text-xs text-[#46658f]">
          <div className="mb-1">{"\u56fd\u9645\u6c47\u7387"}</div>
          <div className="flex items-start justify-between gap-2"><span className="shrink-0">USDT/CNY</span><span className="text-right break-all max-w-[65%] tabular-nums">{fmt(rates.USDT_CNY, 4)}</span></div>
          <div className="flex items-start justify-between gap-2"><span className="shrink-0">USDC/CNY</span><span className="text-right break-all max-w-[65%] tabular-nums">{fmt(rates.USDC_CNY, 4)}</span></div>
          <div className="flex items-start justify-between gap-2"><span className="shrink-0">BTC/CNY</span><span className="text-right break-all max-w-[65%] tabular-nums">{fmt(rates.BTC_CNY, 2)}</span></div>
        </div>
      </section>

      <section className="glass-card p-4 mt-3">
        <div className="text-base font-extrabold finance-title mb-2">{"\u9080\u8bf7\u8fd4\u5229"}</div>
        <div className="finance-kv">
          <div>{"\u603b\u9080\u8bf7\u4eba\u6570"}: {inviteSummary?.totalInviteCount ?? 0}</div>
          <div>{"\u4e00\u7ea7/\u4e8c\u7ea7"}: {inviteSummary?.level1Count ?? 0} / {inviteSummary?.level2Count ?? 0}</div>
          <div>{"\u4e00\u7ea7\u6bd4\u4f8b"}: {inviteSummary?.level1Rate ?? 0}</div>
          <div>{"\u4e8c\u7ea7\u6bd4\u4f8b"}: {inviteSummary?.level2Rate ?? 0}</div>
          <div>{"\u603b\u8fd4\u5229(USDT)"}: {fmt(inviteSummary?.totalRebateUsdt ?? inviteSummary?.totalRebateCny ?? 0)}</div>
          <div>{"\u4e0b\u7ea7\u603b\u5145\u503c(USDT)"}: {fmt(inviteSummary?.totalSourceRechargeUsdt ?? inviteSummary?.totalSourceRechargeCny ?? 0)}</div>
        </div>
      </section>

      <section className="mt-4 glass-card p-3">
        <TabsScroll tabs={tabs} value={tab} onChange={(key) => setTab(Number(key))} />
        <div className="mt-3 rounded-xl bg-white/70 border border-[#dce8ff] p-3">
          {rows.length === 0 && <div className="text-xs text-[#7086a8]">{"\u6682\u65e0\u6570\u636e"}</div>}
          {rows.map((item: any, idx: number) => (
            <div key={item.id || idx} className="finance-list-row">
              {tab === 1 ? (
                <div className="flex justify-between">
                  <span>{item.coinSymbol || "BTC"} / type {item.type}</span>
                  <span className="font-semibold text-[#10418e]">{item.amount}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between"><span>{"\u6765\u6e90\u7528\u6237"}</span><span>{item.sourceUsername || item.sourceUserId}</span></div>
                  <div className="flex justify-between"><span>{"\u8fd4\u5229\u91d1\u989d(CNY)"}</span><span>{item.rebateAmountCny}</span></div>
                  <div className="flex justify-between"><span>{"\u5c42\u7ea7/\u6bd4\u4f8b"}</span><span>L{item.level} / {item.rebateRate}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Follow;
