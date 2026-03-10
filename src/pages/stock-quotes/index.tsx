import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { Modal, Select } from "antd";
import { toast } from "sonner";
import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";
import { apiDashboard } from "@/apis/dashboard";
import { apiOrder } from "@/apis/order";
import { apiUser } from "@/apis/user";
import { formatDate } from "@/lib/format-time";

const getStatusText = (status: any) => {
  const s = Number(status);
  if (s === 1) return "持有中";
  if (s === 2) return "已回收";
  if (s === 3) return "已取消";
  if (s === 0) return "待生效";
  return "未知状态";
};

const getStatusClass = (status: any) => {
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

const fmt = (v: any, d = 8) => {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(d).replace(/\.?0+$/, "");
};

const valueClass = (v: any) => (num(v) > 0 ? "text-[#cf3f56] font-semibold" : "text-[#2d4d78]");
const RECOVER_LOCK_DAYS = 180;
const FULL_REFUND_DAYS = 365;

const calcRemainingRecoverDays = (createTime: any) => {
  if (!createTime) return 0;
  const createAt = new Date(createTime);
  if (Number.isNaN(createAt.getTime())) return 0;
  const now = Date.now();
  const unlockAt = createAt.getTime() + RECOVER_LOCK_DAYS * 24 * 60 * 60 * 1000;
  if (now >= unlockAt) return 0;
  const diffMs = unlockAt - now;
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
};
const calcHoldDays = (createTime: any) => {
  if (!createTime) return 0;
  const createAt = new Date(createTime);
  if (Number.isNaN(createAt.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - createAt.getTime()) / (24 * 60 * 60 * 1000)));
};

const StockQuotes = () => {
  const [orderTab, setOrderTab] = useState<"all" | "holding" | "ended">("all");
  const [extractingOrder, setExtractingOrder] = useState<any>(null);
  const [extractAddress, setExtractAddress] = useState<string>("");
  const [extractAllOpen, setExtractAllOpen] = useState(false);
  const [extractAllAddress, setExtractAllAddress] = useState<string>("");

  const { data: workerStats } = useQuery({ fetcher: apiDashboard.workerStats });
  const { data: overview } = useQuery({ fetcher: apiDashboard.revenueOverview });
  const { data: orders, refresh } = useQuery({ fetcher: apiOrder.listMachineOrders });
  const { data: revenueSummary, refresh: refreshRevenueSummary } = useQuery({ fetcher: apiOrder.revenueSummary });
  const { data: addressRows } = useQuery({ fetcher: apiUser.getReceiveAddressList });

  const btcAddressOptions = useMemo(
    () =>
      (addressRows || [])
        .filter((x: any) => String(x.network || "").toUpperCase() === "BTC")
        .map((x: any) => ({
          label: `${x.remark ? `[${x.remark}] ` : ""}${x.receiveAddress}`,
          value: x.receiveAddress,
        })),
    [addressRows]
  );

  const { mutate: doSell, loading: sellLoading } = useMutation({
    fetcher: (payload: any) => apiOrder.sellMachineOrder(payload.id, {}),
    onSuccess: () => {
      toast.success("回收算力成功");
      refresh();
    },
  });

  const { mutate: doWithdrawRevenue, loading: withdrawLoading } = useMutation({
    fetcher: (payload: any) => apiOrder.withdrawOrderRevenue(payload.id, { receiveAddress: payload.receiveAddress }),
    onSuccess: () => {
      toast.success("提取申请已提交，等待后台审核");
      setExtractingOrder(null);
      setExtractAddress("");
      refresh();
      refreshRevenueSummary();
    },
  });

  const { mutate: doWithdrawAll, loading: withdrawAllLoading } = useMutation({
    fetcher: (payload: any) => apiOrder.withdrawAllRevenue(payload),
    onSuccess: () => {
      toast.success("一键提取申请已提交，等待后台审核");
      setExtractAllOpen(false);
      refresh();
      refreshRevenueSummary();
    },
  });

  const filteredOrders = useMemo(() => {
    const list = orders || [];
    if (orderTab === "holding") return list.filter((i: any) => Number(i.status) === 1);
    if (orderTab === "ended") return list.filter((i: any) => Number(i.status) === 2 || Number(i.status) === 3);
    return list;
  }, [orders, orderTab]);

  const allRows = revenueSummary?.orders || [];
  const totalWithdrawable = Number(revenueSummary?.totalWithdrawableBtc || 0);

  const openExtractModal = (item: any) => {
    const canWithdraw = Number(item?.withdrawableRevenueCoin || 0) > 0;
    if (!canWithdraw) {
      toast.warning("无可提取收益");
      return;
    }
    if (!btcAddressOptions.length) {
      toast.warning("请先绑定BTC网络收款地址后提取收益");
      return;
    }
    const fallback = item?.receiveAddress || btcAddressOptions?.[0]?.value || "";
    setExtractingOrder(item);
    setExtractAddress(fallback);
  };

  return (
    <main className="pb-10 text-sm px-3 fade-stagger">
      <section className="mt-3 rounded-2xl border border-[#d8e7ff] bg-gradient-to-br from-[#f3f8ff] via-[#edf5ff] to-[#e6f0ff] px-4 py-3 shadow-[0_10px_24px_rgba(33,91,168,0.12)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[18px] font-extrabold text-[#163a68] leading-none">算力面板</div>
            <div className="text-[12px] text-[#5f7faa] mt-1">算力状态、收益与可提取资产总览</div>
          </div>
          <div className="size-10 shrink-0 rounded-xl bg-white/85 border border-[#cfe0fb] flex items-center justify-center">
            <Activity size={18} className="text-[#255cae]" />
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-[#5f7faa]">
          <span>算力单位 {overview?.hashrateUnit || "PH/s"}</span>
          <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#d7e5fb] text-[#3e6494]">实时数据同步中</span>
        </div>
      </section>
      <section className="glass-card p-4 mt-3">
        <div className="text-base font-extrabold finance-title mb-3">算力面板</div>
        <div className="finance-kv">
          <div>运行中算力：{overview?.avgHashrate24h ?? 0} {overview?.hashrateUnit || "PH/s"}</div>
          <div>昨日收益：<span className={valueClass(overview?.yesterdayRevenueCoin)}>{overview?.yesterdayRevenueCoin ?? 0} {overview?.coinSymbol || "BTC"}</span></div>
          <div>
            总可提取收益(BTC)：
            <span className={totalWithdrawable > 0 ? "text-[#cf3f56] font-semibold ml-1" : "ml-1"}>
              {fmt(totalWithdrawable, 8)}
            </span>
          </div>
          <div>总收益：<span className={valueClass(overview?.totalRevenueCoin)}>{overview?.totalRevenueCoin ?? 0} {overview?.coinSymbol || "BTC"}</span></div>
        </div>
        <div className="mt-3">
          <button
            className={`${totalWithdrawable > 0 ? "finance-btn-primary" : "bg-[#d9e3f3] text-[#8aa0c4]"} px-3 py-1.5 rounded-xl`}
            onClick={() => {
              if (totalWithdrawable <= 0) {
                toast.warning("无可提取收益");
                return;
              }
              if (!btcAddressOptions.length) {
                toast.warning("请先绑定BTC网络收款地址后提取收益");
                return;
              }
              setExtractAllAddress(revenueSummary?.defaultAddress || btcAddressOptions?.[0]?.value || "");
              setExtractAllOpen(true);
            }}
          >
            一键提取
          </button>
        </div>
      </section>

      <section className="glass-card p-4 mt-3">
        <div className="text-base font-extrabold finance-title mb-2">算力订单列表</div>
        <div className="flex gap-2 mb-3">
          <button className={`px-3 py-1.5 rounded-lg border text-xs ${orderTab === "all" ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setOrderTab("all")}>全部</button>
          <button className={`px-3 py-1.5 rounded-lg border text-xs ${orderTab === "holding" ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setOrderTab("holding")}>持有中</button>
          <button className={`px-3 py-1.5 rounded-lg border text-xs ${orderTab === "ended" ? "finance-btn-primary" : "finance-btn-ghost"}`} onClick={() => setOrderTab("ended")}>已结束</button>
        </div>

        {filteredOrders.length === 0 && <div className="text-xs text-[#7086a8]">暂无订单</div>}
        <div className="space-y-2">
          {filteredOrders.map((item: any) => {
            const canWithdraw = Number(item.withdrawableRevenueCoin || 0) > 0;
            return (
              <div key={item.id} className="finance-list-row">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold text-[#173a69]">{item.machineName || "-"} ({item.coinSymbol || "-"})</div>
                  <div className={`finance-chip border ${getStatusClass(item.status)}`}>{getStatusText(item.status)}</div>
                </div>
                <div className="finance-kv">
                  <div>订单ID：{item.id}</div>
                  <div>数量：{toIntPositive(item.quantity)}</div>
                  <div>总投资：{item.totalInvest} USDT</div>
                  <div>算力：{toIntPositive(Number(item.totalHashrateTH || 0) / 1000)} PH/s</div>
                  <div>今日收益(BTC)：<span className={valueClass(item.todayRevenueCoin)}>{item.todayRevenueCoin}</span></div>
                  <div>总收益(BTC)：<span className={valueClass(item.totalRevenueCoin)}>{item.totalRevenueCoin}</span></div>
                  <div className="col-span-2">可提取收益(BTC)：<span className={canWithdraw ? "text-[#cf3f56] font-semibold" : ""}>{fmt(item.withdrawableRevenueCoin, 8)}</span></div>
                  <div className="col-span-2">买入时间：{formatDate(item.createTime)}</div>
                </div>
                {Number(item.status) === 1 ? (
                  <div className="flex gap-2 mt-3">
                    <button
                      className="finance-btn-primary px-3 py-1.5 rounded-xl"
                      disabled={sellLoading}
                      onClick={() => {
                        const remainingDays = calcRemainingRecoverDays(item.createTime);
                        if (remainingDays > 0) {
                          toast.warning(`还剩${remainingDays}天可回收`);
                          return;
                        }
                        const holdDays = calcHoldDays(item.createTime);
                        const totalInvest = Number(item.totalInvest || 0);
                        const feeRate = holdDays >= FULL_REFUND_DAYS ? 0 : 0.03;
                        const feeAmount = Number((totalInvest * feeRate).toFixed(8));
                        const actualAmount = Number((totalInvest - feeAmount).toFixed(8));
                        Modal.confirm({
                          title: "确认回收算力",
                          centered: true,
                          okText: "确认回收",
                          cancelText: "取消",
                          content: (
                            <div className="text-sm space-y-1">
                              <div>锁仓周期：180天</div>
                              <div>当前持有：{holdDays}天</div>
                              <div>手续费：{feeRate === 0 ? "免手续费" : "3%"}</div>
                              <div>手续费金额：{feeAmount.toFixed(8)} USDT</div>
                              <div>实际到账：{actualAmount.toFixed(8)} USDT</div>
                              {feeRate > 0 ? <div className="text-[#cf3f56]">说明：满365天回收可免手续费。</div> : null}
                            </div>
                          ),
                          onOk: () => doSell({ id: item.id }),
                        });
                      }}
                    >
                      回收算力
                    </button>
                    <button
                      className={`${canWithdraw ? "finance-btn-ghost" : "bg-[#d9e3f3] text-[#8aa0c4] border border-[#cfdaee]"} px-3 py-1.5 rounded-xl`}
                      onClick={() => openExtractModal(item)}
                    >
                      提取收益
                    </button>
                  </div>
                ) : null}
                {(Number(item.status) === 2 || Number(item.status) === 3) ? (
                  <div className="mt-2 text-[#7b90b3]">卖出时间：{formatDate(item.sellTime)}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <Modal
        title="确认提取收益"
        open={!!extractingOrder}
        onCancel={() => setExtractingOrder(null)}
        onOk={() => {
          if (!extractingOrder) return;
          if (!extractAddress) {
            toast.warning("请选择收款地址");
            return;
          }
          doWithdrawRevenue({ id: extractingOrder.id, receiveAddress: extractAddress });
        }}
        okText="确定提取"
        cancelText="取消"
        confirmLoading={withdrawLoading}
      >
        {extractingOrder ? (
          <div className="space-y-2 text-sm">
            <div>确认提取收益吗？</div>
            <div>当前算力绑定提取地址为：</div>
            <div className="break-all text-[#1a57aa]">{extractingOrder.receiveAddress || "未绑定"}</div>
            <div className="pt-1">
              <div className="text-xs text-[#6a7f9f] mb-1">修改地址（可选，仅BTC网络）</div>
              <Select
                className="w-full"
                placeholder="请选择已绑定收款地址"
                options={btcAddressOptions}
                value={extractAddress || undefined}
                onChange={(v) => setExtractAddress(v)}
              />
            </div>
            <div>可提取金额：<span className="text-[#cf3f56] font-semibold">{fmt(extractingOrder.withdrawableRevenueCoin, 8)} BTC</span></div>
          </div>
        ) : null}
      </Modal>

      <Modal
        title="确认一键提取收益"
        open={extractAllOpen}
        onCancel={() => setExtractAllOpen(false)}
        onOk={() => {
          if (!extractAllAddress) {
            toast.warning("请选择收款地址");
            return;
          }
          doWithdrawAll({
            receiveAddress: extractAllAddress,
            orderIds: (allRows || []).map((x: any) => Number(x.orderId)).filter((x: number) => Number.isFinite(x)),
          });
        }}
        okText="确定提取"
        cancelText="取消"
        confirmLoading={withdrawAllLoading}
      >
        <div className="space-y-2 text-sm">
          <div>以下订单将整合为一个提现审核单：</div>
          <div className="max-h-44 overflow-auto rounded-lg border border-[#d7e5ff] p-2 bg-[#f8fbff]">
            {(allRows || []).length === 0 ? (
              <div className="text-xs text-[#6a7f9f]">暂无可提取订单</div>
            ) : (
              (allRows || []).map((row: any) => (
                <div key={row.orderId} className="flex justify-between text-xs py-1 border-b border-[#e7efff] last:border-b-0">
                  <span>订单#{row.orderId}</span>
                  <span>{fmt(row.withdrawableRevenueCoin, 8)} BTC</span>
                </div>
              ))
            )}
          </div>
          <div>总提取金额：<span className="text-[#cf3f56] font-semibold">{fmt(totalWithdrawable, 8)} BTC</span></div>
          <Select
            className="w-full"
            placeholder="请选择BTC网络收款地址"
            options={btcAddressOptions}
            value={extractAllAddress || undefined}
            onChange={(v) => setExtractAllAddress(v)}
          />
        </div>
      </Modal>
    </main>
  );
};

export default StockQuotes;


