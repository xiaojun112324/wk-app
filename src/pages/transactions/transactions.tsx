import AppNav from "@/components/AppNav";
import TabsScroll from "@/components/TabsScroll";
import { useQuery } from "@/hooks/useQuery";
import { useState } from "react";
import { apiCash } from "@/apis/cash";

const Transactions = () => {
    const [tab, setTab] = useState(1);

    const { data: fundRows, refresh: refreshFund } = useQuery({
        fetcher: () => apiCash.fundOrderList({ coin: "BTC" }),
    });

    const { data: rechargeRows, refresh: refreshRecharge } = useQuery({
        fetcher: () => apiCash.rechargeList({}),
    });

    const { data: withdrawRows, refresh: refreshWithdraw } = useQuery({
        fetcher: () => apiCash.withdrawList({}),
    });

    const tabs = [
        { key: 1, label: "资金明细" },
        { key: 4, label: "充值记录" },
        { key: 5, label: "提现记录" },
    ];

    const rows = tab === 1 ? fundRows || [] : tab === 4 ? rechargeRows || [] : withdrawRows || [];

    return (
        <main className="min-h-screen px-4 pb-8">
            <AppNav title="资金流水" />
            <div className="mt-3">
                <TabsScroll tabs={tabs} value={tab} onChange={(rawKey) => {
                    const key = Number(rawKey);
                    setTab(key);
                    if (key === 1) refreshFund();
                    if (key === 4) refreshRecharge();
                    if (key === 5) refreshWithdraw();
                }} />
            </div>

            <section className="mt-3 border rounded-xl p-3 text-xs">
                {rows.length === 0 && <div className="text-gray-400">暂无数据</div>}
                {rows.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="py-2 border-b">
                        {tab === 1 && (
                            <div className="flex justify-between">
                                <span>{item.coinSymbol || "BTC"} / type {item.type}</span>
                                <span>{item.amount}</span>
                            </div>
                        )}
                        {tab === 4 && (
                            <div className="grid grid-cols-2 gap-y-1">
                                <div>资产网络: {item.asset}/{item.network}</div>
                                <div>金额(CNY): {item.amountCny}</div>
                                <div>状态: {item.status}</div>
                                <div>时间: {item.createTime || "-"}</div>
                            </div>
                        )}
                        {tab === 5 && (
                            <div className="grid grid-cols-2 gap-y-1">
                                <div>资产网络: {item.asset}/{item.network}</div>
                                <div>金额(CNY): {item.amountCny}</div>
                                <div>状态: {item.status}</div>
                                <div>时间: {item.createTime || "-"}</div>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Transactions;
