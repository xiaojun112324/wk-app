import { Pagination } from "antd";
import { useEffect, useMemo, useState } from "react";
import { WalletCards } from "lucide-react";
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
  if (val.startsWith("MACHINE_BUY_P_") || val.startsWith("MACHINE_BUY_")) return "算力购买";
  if (val.startsWith("MACHINE_SELL_")) return "算力回收返还";
  if (val.startsWith("MACHINE_CANCEL_")) return "算力取消返还";
  if (val.startsWith("MACHINE_DAILY_SETTLE_")) return "算力每日收益";
  if (val.startsWith("WITHDRAW_")) return "提现";
  if (val.startsWith("RECHARGE_")) return "充值";
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
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount });
  const { data: financeAccount } = useQuery({ fetcher: () => apiUser.getFinanceAccount({}) });
  const { data: billList, run: runBillList, loading: billLoading } = useQuery({
    fetcher: (params?: any) => apiUser.getFinanceBillList(params || {}),
    params: { pageNum: 1, pageSize },
  });
  const { data: revenueOverview } = useQuery({ fetcher: apiDashboard.revenueOverview });

  const parsed = useMemo(() => {
    if (Array.isArray(billList)) {
      return { rows: billList, total: billList.length, isServerPage: false };
    }
    const records = (billList as any)?.records || (billList as any)?.list || [];
    if (Array.isArray(records)) {
      return { rows: records, total: Number((billList as any)?.total ?? records.length), isServerPage: true };
    }
    return { rows: [], total: 0, isServerPage: false };
  }, [billList]);

  const rows = useMemo(
    () => (parsed.isServerPage ? parsed.rows : parsed.rows.slice((page - 1) * pageSize, page * pageSize)),
    [parsed, page]
  );

  useEffect(() => {
    if (parsed.isServerPage) {
      runBillList({ pageNum: page, pageSize });
    }
  }, [page, parsed.isServerPage, runBillList]);

  const rates = wallet?.exchangeRates || {};
  const stableRateCny = Number(rates.USDT_CNY || rates.USDC_CNY || 0);
  const coinSymbol = String(financeAccount?.coinSymbol || "").toUpperCase();
  const coinRateMap: Record<string, number> = {
    USDT: Number(rates.USDT_CNY || 0),
    USDC: Number(rates.USDC_CNY || 0),
    BTC: Number(rates.BTC_CNY || 0),
  };

  const revenueCoinFromOverview = Number(revenueOverview?.totalRevenueCoin ?? 0);
  const overviewCoin = String(revenueOverview?.coinSymbol || "BTC").toUpperCase();
  const totalRevenueBtc = Number(revenueOverview?.totalRevenueCoin ?? financeAccount?.totalRevenue ?? 0);
  const btcToCnyRate = Number(rates.BTC_CNY || coinRateMap.BTC || 0);
  const minedRevenueCny = Number(
    totalRevenueBtc > 0
      ? totalRevenueBtc * btcToCnyRate
      : wallet?.totalRevenueCny ??
          financeAccount?.totalRevenueCny ??
          (Number(financeAccount?.totalRevenue || 0) > 0
            ? Number(financeAccount?.totalRevenue || 0) * Number(coinRateMap[coinSymbol] || 0)
            : revenueCoinFromOverview * Number(coinRateMap[overviewCoin] || 0))
  );

  return (
    <main className="pb-10 text-sm px-3 fade-stagger">
      <section className="mt-3 rounded-2xl border border-[#d8e7ff] bg-gradient-to-br from-[#f3f8ff] via-[#edf5ff] to-[#e6f0ff] px-4 py-3 shadow-[0_10px_24px_rgba(33,91,168,0.12)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[18px] font-extrabold text-[#163a68] leading-none">钱包</div>
            <div className="text-[12px] text-[#5f7faa] mt-1">资产估值、累计收益与资金明细</div>
          </div>
          <div className="size-10 shrink-0 rounded-xl bg-white/85 border border-[#cfe0fb] flex items-center justify-center">
            <WalletCards size={18} className="text-[#255cae]" />
          </div>
        </div>
      </section>
      <section className="glass-card p-4 mt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-[#6f87ab] mb-1">钱包总资产估值</div>
            <div className="text-[28px] font-extrabold leading-[1.1] text-[#173a67] tabular-nums">￥{fmt(wallet?.totalAssetCny, 2)}</div>
          </div>
        </div>

        <div className="mt-3 mb-4 rounded-xl bg-[#f0f6ff] border border-[#d8e5fb] px-3 py-2.5">
          <div className="text-[11px] text-[#6f87ab]">累计收益</div>
          <div className="text-base font-extrabold text-[#cf3f56] tabular-nums mt-0.5">
            {fmt(totalRevenueBtc, 8)} BTC
          </div>
          <div className="text-[13px] text-[#4f6f98] font-semibold mt-1 tabular-nums">
            ≈ ￥{fmt(minedRevenueCny, 2)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="rounded-xl border border-[#d9e6fb] bg-white/80 px-2.5 py-2">
            <div className="text-[11px] text-[#6f87ab]">USDT</div>
            <div className="text-sm font-bold text-[#163a66] tabular-nums">{fmt(wallet?.usdtBalance, 4)}</div>
          </div>
          <div className="rounded-xl border border-[#d9e6fb] bg-white/80 px-2.5 py-2">
            <div className="text-[11px] text-[#6f87ab]">USDC</div>
            <div className="text-sm font-bold text-[#163a66] tabular-nums">{fmt(wallet?.usdcBalance, 4)}</div>
          </div>
          <div className="rounded-xl border border-[#d9e6fb] bg-white/80 px-2.5 py-2">
            <div className="text-[11px] text-[#6f87ab]">BTC</div>
            <div className="text-sm font-bold text-[#163a66] tabular-nums">{fmt(wallet?.btcBalance, 8)}</div>
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-[#d9e6fb] bg-[#f8fbff] px-3 py-2 text-xs text-[#355782] flex items-center justify-between">
          <span>算力余额(USDT)</span>
          <span className="font-semibold tabular-nums text-[#173a67]">{fmt(wallet?.machineBalanceUsdt, 4)}</span>
        </div>

        <div className="mt-3 rounded-lg border border-[#d5e2f7] bg-white/70 p-2 text-xs text-[#46658f]">
          <div className="mb-1 font-semibold">国际汇率</div>
          <div className="flex items-center justify-between"><span>USDT/USDC/CNY</span><span className="tabular-nums">{fmt(stableRateCny, 4)}</span></div>
          <div className="flex items-center justify-between"><span>BTC/CNY</span><span className="tabular-nums">{fmt(rates.BTC_CNY, 2)}</span></div>
        </div>
      </section>

      <section className="mt-4 glass-card p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-extrabold finance-title">资金明细</div>
          <div className="text-[11px] text-[#6f87ab]">第 {page} 页</div>
        </div>

        <div className="rounded-xl bg-white/70 border border-[#dce8ff] p-3">
          {billLoading && <div className="text-xs text-[#7086a8] mb-2">加载中...</div>}
          {rows.length === 0 && !billLoading && <div className="text-xs text-[#7086a8]">暂无数据</div>}

          {rows.map((item: any, idx: number) => (
            <div key={item.id || idx} className="finance-list-row">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-[#173a67] truncate">{getBillSource(item.txId)}</div>
                  <div className="text-[11px] text-[#6a80a2] mt-0.5">{formatDate(item.createTime)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold tabular-nums ${Number(item.type) === 1 ? "text-[#cf3f56]" : "text-[#1a57aa]"}`}>
                    {Number(item.type) === 1 ? "+" : Number(item.type) === 2 ? "-" : ""}
                    {fmt(item.amount, 8)} {item.coinSymbol || "-"}
                  </div>
                  <div className="text-[11px] text-[#6a80a2]">{getBillDirection(item.type)}</div>
                </div>
              </div>
              {!!getMachineOrderId(item.txId) && <div className="mt-1 text-[11px] text-[#6a80a2]">算力订单ID: {getMachineOrderId(item.txId)}</div>}
            </div>
          ))}

          {(parsed.total || 0) > pageSize && (
            <div className="mt-3 flex justify-end">
              <Pagination
                size="small"
                current={page}
                pageSize={pageSize}
                total={parsed.total}
                showSizeChanger={false}
                onChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Follow;


