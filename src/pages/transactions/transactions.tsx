import { useState } from "react";
import AppNav from "@/components/AppNav";
import TabsScroll from "@/components/TabsScroll";
import { FinanceListSkeleton } from "@/components/finance-skeleton";
import { useQuery } from "@/hooks/useQuery";
import { apiCash } from "@/apis/cash";

const getBillSource = (txId?: string) => {
  const val = String(txId || "").toUpperCase();
  if (val.startsWith("MACHINE_BUY_P_") || val.startsWith("MACHINE_BUY_")) return "算力购买";
  if (val.startsWith("MACHINE_SELL_")) return "算力卖出返还";
  if (val.startsWith("MACHINE_CANCEL_")) return "算力取消返还";
  if (val.startsWith("MACHINE_DAILY_SETTLE_")) return "算力每日收益结算";
  return "-";
};

const getWithdrawStatusText = (status: any) => {
  const s = Number(status);
  if (s === 0) return "审核中";
  if (s === 1) return "已完成";
  if (s === 2) return "失败";
  return "-";
};

const Transactions = () => {
  const [tab, setTab] = useState(1);

  const { data: fundRows, refresh: refreshFund, initLoading: fundInitLoading } = useQuery({
    fetcher: () => apiCash.fundOrderList({}),
  });

  const { data: rechargeRows, refresh: refreshRecharge, initLoading: rechargeInitLoading } = useQuery({
    fetcher: () => apiCash.rechargeList({}),
  });

  const { data: withdrawRows, refresh: refreshWithdraw, initLoading: withdrawInitLoading } = useQuery({
    fetcher: () => apiCash.withdrawList({}),
  });

  const tabs = [
    { key: 1, label: "资金明细" },
    { key: 4, label: "充值记录" },
    { key: 5, label: "提现记录" },
  ];

  const rows = tab === 1 ? fundRows || [] : tab === 4 ? rechargeRows || [] : withdrawRows || [];
  const currentInitLoading = tab === 1 ? fundInitLoading : tab === 4 ? rechargeInitLoading : withdrawInitLoading;

  return (
    <main className="min-h-screen px-3 pb-8 fade-stagger">
      <AppNav title="资金流水" />
      <div className="mt-3 glass-card p-3">
        <TabsScroll
          tabs={tabs}
          value={tab}
          onChange={(rawKey) => {
            const key = Number(rawKey);
            setTab(key);
            if (key === 1) refreshFund();
            if (key === 4) refreshRecharge();
            if (key === 5) refreshWithdraw();
          }}
        />
      </div>

      <section className="mt-3 glass-card p-3 text-xs">
        {currentInitLoading ? (
          <FinanceListSkeleton rows={4} />
        ) : (
          <>
            {rows.length === 0 && <div className="text-[#7086a8]">暂无数据</div>}
            {rows.map((item: any, idx: number) => (
              <div key={item.id || idx} className="finance-list-row">
                {tab === 1 && (
                  <div className="finance-kv">
                    <div className="flex justify-between">
                      <span>{item.coinSymbol || "-"} / {item.type === 1 ? "收入" : item.type === 2 ? "支出" : "-"}</span>
                      <span className="font-semibold text-[#10418e]">{item.amount}</span>
                    </div>
                    <div>来源: {getBillSource(item.txId)}</div>
                    <div>时间: {item.createTime || "-"}</div>
                  </div>
                )}
                {tab === 4 && (
                  <div className="finance-kv">
                    <div>资产网络: {item.asset}/{item.network}</div>
                    <div>数量: {item.amount ?? item.amountCny}</div>
                    <div>状态: {item.status}</div>
                    <div>时间: {item.createTime || "-"}</div>
                  </div>
                )}
                {tab === 5 && (
                  <div className="finance-kv">
                    <div>资产网络: {item.asset}/{item.network}</div>
                    <div>数量: {item.amount ?? item.amountCny}</div>
                    <div>状态: {getWithdrawStatusText(item.status)}</div>
                    <div>时间: {item.createTime || "-"}</div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default Transactions;
