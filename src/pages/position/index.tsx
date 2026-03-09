import { useMemo, useState } from "react";
import { Modal, Select } from "antd";
import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";
import { apiOrder } from "@/apis/order";
import { apiUser } from "@/apis/user";
import AppNav from "@/components/AppNav";
import { formatDate } from "@/lib/format-time";
import { toast } from "sonner";

const fmt = (v: any, d = 8) => {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(d).replace(/\.?0+$/, "");
};

const getMachineOrderStatusText = (status: any) => {
  const s = Number(status);
  if (s === 1) return "持有中";
  if (s === 2) return "已回收";
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
  const { data, refresh, loading } = useQuery({ fetcher: apiOrder.listMachineOrders });
  const { data: addressRows } = useQuery({ fetcher: apiUser.getReceiveAddressList });
  const { data: revenueSummary, refresh: refreshRevenueSummary } = useQuery({ fetcher: apiOrder.revenueSummary });

  const [extractingOrder, setExtractingOrder] = useState<any>(null);
  const [extractAddress, setExtractAddress] = useState<string>("");
  const [extractAllOpen, setExtractAllOpen] = useState(false);
  const [extractAllAddress, setExtractAllAddress] = useState<string>("");

  const addressOptions = useMemo(
    () =>
      (addressRows || []).map((x: any) => ({
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

  const list = data || [];
  const allRows = revenueSummary?.orders || [];
  const totalWithdrawable = Number(revenueSummary?.totalWithdrawableBtc || 0);

  const openExtractModal = (item: any) => {
    const canWithdraw = Number(item?.withdrawableRevenueCoin || 0) > 0;
    if (!canWithdraw) {
      toast.warning("无可提取收益");
      return;
    }
    const fallback = item?.receiveAddress || addressOptions?.[0]?.value || "";
    setExtractingOrder(item);
    setExtractAddress(fallback);
  };

  return (
    <main className="min-h-[calc(100vh-70px)] px-3 pb-8 fade-stagger">
      <AppNav title="算力面板" />

      {loading && <div className="text-xs text-[#7086a8] mt-3">加载中...</div>}
      {!loading && list.length === 0 && <div className="text-xs text-[#7086a8] mt-3">暂无订单</div>}

      <section className="space-y-3 mt-3">
        <div className="glass-card p-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              总可提取收益(BTC):
              <span className={totalWithdrawable > 0 ? "text-[#cf3f56] font-semibold ml-1" : "ml-1"}>
                {fmt(totalWithdrawable, 8)}
              </span>
            </div>
            <button
              className={`${totalWithdrawable > 0 ? "finance-btn-primary" : "bg-[#d9e3f3] text-[#8aa0c4]"} px-3 py-1.5 rounded-xl`}
              onClick={() => {
                if (totalWithdrawable <= 0) {
                  toast.warning("无可提取收益");
                  return;
                }
                if (!addressOptions.length) {
                  toast.warning("请先绑定收款地址后提取收益");
                  return;
                }
                setExtractAllAddress(revenueSummary?.defaultAddress || addressOptions?.[0]?.value || "");
                setExtractAllOpen(true);
              }}
            >
              一键提取
            </button>
          </div>
        </div>

        {list.map((item: any) => {
          const canWithdraw = Number(item.withdrawableRevenueCoin || 0) > 0;
          return (
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
                <div>总投资(USDT): {fmt(item.totalInvest, 2)}</div>
                <div>总算力(PH/s): {fmt(Number(item.totalHashrateTH || 0) / 1000, 4)}</div>
                <div>今日收益(BTC): <span className={Number(item.todayRevenueCoin || 0) > 0 ? "text-[#cf3f56] font-semibold" : ""}>{fmt(item.todayRevenueCoin, 8)}</span></div>
                <div>总收益(BTC): <span className={Number(item.totalRevenueCoin || 0) > 0 ? "text-[#cf3f56] font-semibold" : ""}>{fmt(item.totalRevenueCoin, 8)}</span></div>
                <div className="col-span-2">当前可提取收益(BTC): <span className={canWithdraw ? "text-[#cf3f56] font-semibold" : ""}>{fmt(item.withdrawableRevenueCoin, 8)}</span></div>
                <div className="col-span-2">买入时间: {formatDate(item.createTime)}</div>
                {item.receiveAddress ? <div className="col-span-2 break-all">绑定收款地址: {item.receiveAddress}</div> : null}
              </div>

              {Number(item.status) === 1 ? (
                <div className="flex gap-2 mt-3">
                  <button
                    className="finance-btn-primary px-3 py-1.5 rounded-xl"
                    disabled={sellLoading}
                    onClick={() => doSell({ id: item.id })}
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

              {(Number(item.status) === 2 || Number(item.status) === 3) && item.sellTime ? (
                <div className="mt-2 text-[#7b90b3]">卖出时间: {formatDate(item.sellTime)}</div>
              ) : null}
            </div>
          );
        })}
      </section>

      <Modal
        title="确认提取收益"
        open={!!extractingOrder}
        onCancel={() => setExtractingOrder(null)}
        onOk={() => {
          if (!extractingOrder) return;
          if (!extractAddress) {
            toast.warning("请先选择收款地址");
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
            <div>当前矿机绑定提取地址为：</div>
            <div className="break-all text-[#1a57aa]">{extractingOrder.receiveAddress || "未绑定"}</div>
            <div className="pt-1">
              <div className="text-xs text-[#6a7f9f] mb-1">修改地址（可选）</div>
              <Select
                className="w-full"
                placeholder="请选择已绑定收款地址"
                options={addressOptions}
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
            placeholder="请选择已绑定收款地址"
            options={addressOptions}
            value={extractAllAddress || undefined}
            onChange={(v) => setExtractAllAddress(v)}
          />
        </div>
      </Modal>
    </main>
  );
};

export default Position;
