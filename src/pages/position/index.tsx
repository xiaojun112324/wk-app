import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";
import { apiOrder } from "@/apis/order";
import AppNav from "@/components/AppNav";
import { toast } from "sonner";
import { useState } from "react";

const Position = () => {
    const [machineId, setMachineId] = useState("");
    const [quantity, setQuantity] = useState("1");

    const { data, refresh, loading } = useQuery({
        fetcher: apiOrder.listMachineOrders,
    });

    const { mutate: doCreate, loading: createLoading } = useMutation({
        fetcher: (payload: any) => apiOrder.createMachineOrder(payload),
        onSuccess: () => {
            toast.success("下单成功");
            refresh();
        },
    });

    const { mutate: doSell, loading: sellLoading } = useMutation({
        fetcher: (payload: any) => apiOrder.sellMachineOrder(payload.id, {}),
        onSuccess: () => {
            toast.success("卖出成功");
            refresh();
        },
    });

    const { mutate: doCancel, loading: cancelLoading } = useMutation({
        fetcher: (payload: any) => apiOrder.cancelMachineOrder(payload.id, {}),
        onSuccess: () => {
            toast.success("取消成功");
            refresh();
        },
    });

    const list = data || [];

    return (
        <main className="min-h-[calc(100vh-70px)] px-3 pb-8 fade-stagger">
            <AppNav title="矿机订单" />

            <section className="glass-card p-3 mt-3 text-xs">
                <div className="font-bold finance-title mb-2">创建订单</div>
                <div className="flex gap-2">
                    <input
                        className="border border-[#cddfff] bg-[#f7fbff] rounded-xl px-3 py-2 flex-1 outline-none"
                        placeholder="machineId"
                        value={machineId}
                        onChange={(e) => setMachineId(e.target.value)}
                    />
                    <input
                        className="border border-[#cddfff] bg-[#f7fbff] rounded-xl px-3 py-2 w-20 outline-none"
                        placeholder="数量"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <button
                        className="finance-btn-primary px-3 py-2 rounded-xl"
                        disabled={createLoading}
                        onClick={() => {
                            const mId = Number(machineId);
                            const qty = Number(quantity);
                            if (!mId || !qty) {
                                toast.warning("请输入 machineId 和数量");
                                return;
                            }
                            doCreate({ machineId: mId, quantity: qty });
                        }}
                    >
                        下单
                    </button>
                </div>
            </section>

            {loading && <div className="text-xs text-[#7086a8] mt-3">加载中...</div>}
            {!loading && list.length === 0 && <div className="text-xs text-[#7086a8] mt-3">暂无订单</div>}

            <section className="space-y-3 mt-3">
                {list.map((item: any) => (
                    <div key={item.id} className="glass-card p-3 text-xs">
                        <div className="flex justify-between mb-2">
                            <div className="font-bold text-[#173a69]">{item.machineName} ({item.coinSymbol})</div>
                            <div className="finance-chip">状态: {item.status}</div>
                        </div>
                        <div className="finance-kv">
                            <div>订单ID: {item.id}</div>
                            <div>数量: {item.quantity}</div>
                            <div>总投资: {item.totalInvest}</div>
                            <div>总算力TH: {item.totalHashrateTH}</div>
                            <div>今日收益币: {item.todayRevenueCoin}</div>
                            <div>总收益币: {item.totalRevenueCoin}</div>
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
                                <button
                                    className="finance-btn-ghost px-3 py-1.5 rounded-xl"
                                    disabled={cancelLoading}
                                    onClick={() => doCancel({ id: item.id })}
                                >
                                    取消
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Position;

