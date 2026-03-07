import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";
import { apiOrder } from "@/apis/order";
import AppNav from "@/components/AppNav";
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

const Position = () => {
    const { data, refresh, loading } = useQuery({
        fetcher: apiOrder.listMachineOrders,
    });

    const { mutate: doSell, loading: sellLoading } = useMutation({
        fetcher: (payload: any) => apiOrder.sellMachineOrder(payload.id, {}),
        onSuccess: () => {
            toast.success("卖出成功");
            refresh();
        },
    });

    const list = data || [];

    return (
        <main className="min-h-[calc(100vh-70px)] px-3 pb-8 fade-stagger">
            <AppNav title="矿机订单" />

            {loading && <div className="text-xs text-[#7086a8] mt-3">加载中...</div>}
            {!loading && list.length === 0 && <div className="text-xs text-[#7086a8] mt-3">暂无订单</div>}

            <section className="space-y-3 mt-3">
                {list.map((item: any) => (
                    <div key={item.id} className="glass-card p-3 text-xs">
                        <div className="flex justify-between mb-2">
                            <div className="font-bold text-[#173a69]">{item.machineName} ({item.coinSymbol})</div>
                            <div className={`finance-chip border ${getMachineOrderStatusClass(item.status)}`}>
                                {getMachineOrderStatusText(item.status)}
                            </div>
                        </div>
                        <div className="finance-kv">
                            <div>订单ID: {item.id}</div>
                            <div>数量: {item.quantity}</div>
                            <div>总投资: {item.totalInvest}</div>
                            <div>总算力PH/s: {(Number(item.totalHashrateTH || 0) / 1000).toFixed(8)}</div>
                            <div>今日收益(BTC): <span className="text-[#cf3f56] font-semibold">{item.todayRevenueCoin}</span></div>
                            <div>总收益(BTC): <span className="text-[#cf3f56] font-semibold">{item.totalRevenueCoin}</span></div>
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
                            <div className="mt-2 text-[#7b90b3]">卖出时间: {formatDate(item.sellTime)}</div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Position;

