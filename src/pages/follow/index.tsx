import { useMemo, useState } from "react";
import TabsScroll from "@/components/TabsScroll";
import { useQuery } from "@/hooks/useQuery";
import { apiUser } from "@/apis/user";

const Follow = () => {
    const [tab, setTab] = useState(1);
    const tabs = [
        { key: 1, label: "收益明细" },
        { key: 2, label: "返利明细" },
    ];

    const { data: financeAccount } = useQuery({
        fetcher: () => apiUser.getFinanceAccount({ coin: "BTC" }),
    });

    const { data: billList } = useQuery({
        fetcher: () => apiUser.getFinanceBillList({ coin: "BTC" }),
    });

    const { data: inviteSummary } = useQuery({
        fetcher: apiUser.getInviteSummary,
    });

    const { data: rebateList } = useQuery({
        fetcher: apiUser.getInviteRebateList,
    });

    const rows = useMemo(() => (tab === 1 ? billList || [] : rebateList || []), [tab, billList, rebateList]);

    return (
        <main className="pb-10 text-sm px-3 fade-stagger">
            <section className="glass-card p-4 mt-3">
                <div className="text-base font-extrabold finance-title mb-3">收益总览</div>
                <div className="finance-kv">
                    <div>总收益: {financeAccount?.totalRevenue ?? 0}</div>
                    <div>总支出: {financeAccount?.totalPaid ?? 0}</div>
                    <div>账户余额: {financeAccount?.balance ?? 0}</div>
                    <div>币种: {financeAccount?.coinSymbol || "BTC"}</div>
                </div>
            </section>

            <section className="glass-card p-4 mt-3">
                <div className="text-base font-extrabold finance-title mb-2">邀请返利</div>
                <div className="finance-kv">
                    <div>总邀请人数: {inviteSummary?.totalInviteCount ?? 0}</div>
                    <div>一级/二级: {inviteSummary?.level1Count ?? 0} / {inviteSummary?.level2Count ?? 0}</div>
                    <div>一级比例: {inviteSummary?.level1Rate ?? 0}</div>
                    <div>二级比例: {inviteSummary?.level2Rate ?? 0}</div>
                    <div>总返利(CNY): {inviteSummary?.totalRebateCny ?? 0}</div>
                    <div>下级总充值(CNY): {inviteSummary?.totalSourceRechargeCny ?? 0}</div>
                </div>
            </section>

            <section className="mt-4 glass-card p-3">
                <TabsScroll tabs={tabs} value={tab} onChange={(key) => setTab(Number(key))} />
                <div className="mt-3 rounded-xl bg-white/70 border border-[#dce8ff] p-3">
                    {rows.length === 0 && <div className="text-xs text-[#7086a8]">暂无数据</div>}
                    {rows.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="finance-list-row">
                            {tab === 1 ? (
                                <div className="flex justify-between">
                                    <span>{item.coinSymbol || "BTC"} / type {item.type}</span>
                                    <span className="font-semibold text-[#10418e]">{item.amount}</span>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex justify-between"><span>来源用户</span><span>{item.sourceUsername || item.sourceUserId}</span></div>
                                    <div className="flex justify-between"><span>返利金额(CNY)</span><span>{item.rebateAmountCny}</span></div>
                                    <div className="flex justify-between"><span>层级/比例</span><span>L{item.level} / {item.rebateRate}</span></div>
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

