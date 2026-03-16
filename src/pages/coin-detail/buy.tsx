import { useEffect, useMemo, useState } from "react";
import { Modal, Select } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";
import { ApiPub } from "@/apis/public";
import { apiOrder } from "@/apis/order";
import { apiUser } from "@/apis/user";
import { useQuery } from "@/hooks/useQuery";
import { usePolling } from "@/hooks/usePolling";
import { useMutation } from "@/hooks/useMutation";
import { calcDailyRevenueCnyPerDisplayUnit } from "@/lib/hashrate-revenue";

const fmtCny = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return `￥${v}`;
  return `￥${n.toFixed(8).replace(/\.?0+$/, "")}`;
};

const fmtU = (v: any, digits = 4) => {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n.toFixed(digits) : "0.0000";
};

const fmtNum = (v: any, digits = 8) => {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(digits).replace(/\.?0+$/, "");
};

const CoinBuyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const coinId = Number(id);
  const [pCount, setPCount] = useState("1");
  const [profitAddress, setProfitAddress] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [coinHeader, setCoinHeader] = useState({ symbol: "", name: "", logo: "" });
  const [livePriceCny, setLivePriceCny] = useState<any>(null);
  const [liveUnitRevenueCny, setLiveUnitRevenueCny] = useState<any>(null);

  const { data: coin, initLoading: coinInitLoading, refresh: refreshCoin } = useQuery({
    fetcher: () => ApiPub.coinDetail({ id: coinId }),
    deps: [coinId],
  });
  usePolling(async () => {
    await refreshCoin();
  }, { delay: 3000, enabled: !!coinId, immediateOnActivate: false });

  const { data: buyConfig } = useQuery({
    fetcher: ApiPub.machineBuyConfig,
    params: {},
  });

  const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount, params: {} });
  const { data: addressRows, res: addressRes, initLoading: addressInitLoading, loading: addressLoading } = useQuery({ fetcher: apiUser.getReceiveAddressList });

  const pickBalance = (candidates: string[]) => {
    for (const key of candidates) {
      const value = wallet?.[key];
      if (value !== null && value !== undefined && value !== "") return Number(value);
    }
    return 0;
  };

  const usdtBalance = pickBalance(["usdtBalance", "balanceUsdt", "usdt", "usdtAmount"]);
  const usdcBalance = pickBalance(["usdcBalance", "balanceUsdc", "usdc", "usdcAmount"]);

  const pNum = useMemo(() => {
    const n = Number(pCount);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return n;
  }, [pCount]);

  const pricePerPUsd = useMemo(() => Number(buyConfig?.pricePerPUsd || 0), [buyConfig]);
  const unitRevenue = useMemo(
    () => calcDailyRevenueCnyPerDisplayUnit(coin?.dailyRevenuePerP, coin?.networkHashrate, coin?.priceCny),
    [coin?.dailyRevenuePerP, coin?.networkHashrate, coin?.priceCny]
  );
  const isBtc = useMemo(() => String(coin?.symbol || "").toUpperCase() === "BTC", [coin?.symbol]);

  const totalAmountUsd = useMemo(() => {
    if (!pNum || !pricePerPUsd) return 0;
    return Number((pNum * pricePerPUsd).toFixed(8));
  }, [pNum, pricePerPUsd]);

  const dailyRevenueApprox = useMemo(() => {
    if (!pNum || !unitRevenue.revenueCny) return 0;
    return Number((pNum * unitRevenue.revenueCny).toFixed(8));
  }, [pNum, unitRevenue.revenueCny]);

  const payByUsdt = useMemo(() => {
    if (!totalAmountUsd) return 0;
    return Number(Math.min(usdtBalance, totalAmountUsd).toFixed(8));
  }, [usdtBalance, totalAmountUsd]);

  const payByUsdc = useMemo(() => {
    if (!totalAmountUsd) return 0;
    return Number(Math.max(totalAmountUsd - payByUsdt, 0).toFixed(8));
  }, [totalAmountUsd, payByUsdt]);

  const totalAvailable = useMemo(() => Number((usdtBalance + usdcBalance).toFixed(8)), [usdtBalance, usdcBalance]);
  const insufficient = useMemo(() => totalAmountUsd > totalAvailable, [totalAmountUsd, totalAvailable]);

  const addressOptions = useMemo(
    () =>
      (addressRows || [])
        .filter((x: any) => String(x.network || "").toUpperCase() === "BTC")
        .map((x: any) => ({
          label: `${x.remark ? `[${x.remark}] ` : ""}${x.receiveAddress}`,
          value: x.receiveAddress,
        })),
    [addressRows]
  );
  const selectedAddress = useMemo(
    () => (addressRows || []).find((x: any) => String(x.receiveAddress || "") === String(profitAddress || "")),
    [addressRows, profitAddress]
  );
  const addressLoadedOk = !addressInitLoading && !addressLoading && Number((addressRes as any)?.code) === 200;
  const noAddress = addressLoadedOk && addressOptions.length === 0;
  const payMethodText = useMemo(() => {
    const usdt = Number(payByUsdt || 0);
    const usdc = Number(payByUsdc || 0);
    if (usdt > 0 && usdc > 0) {
      return `${fmtU(usdt)}USDT + ${fmtU(usdc)}USDC`;
    }
    if (usdt > 0) {
      return `${fmtU(usdt)}USDT`;
    }
    if (usdc > 0) {
      return `${fmtU(usdc)}USDC`;
    }
    return "-";
  }, [payByUsdt, payByUsdc]);

  useEffect(() => {
    setCoinHeader({ symbol: "", name: "", logo: "" });
    setLivePriceCny(null);
    setLiveUnitRevenueCny(null);
  }, [coinId]);

  useEffect(() => {
    setCoinHeader((prev) => ({
      symbol: coin?.symbol || prev.symbol,
      name: coin?.name || prev.name,
      logo: coin?.logo || prev.logo,
    }));
  }, [coin?.symbol, coin?.name, coin?.logo]);

  useEffect(() => {
    if (coin?.priceCny !== null && coin?.priceCny !== undefined && coin?.priceCny !== "") {
      setLivePriceCny(coin.priceCny);
    }
  }, [coin?.priceCny]);

  useEffect(() => {
    if (unitRevenue.revenueCny !== null && unitRevenue.revenueCny !== undefined && unitRevenue.revenueCny !== "") {
      setLiveUnitRevenueCny(unitRevenue.revenueCny);
    }
  }, [unitRevenue.revenueCny]);

  useEffect(() => {
    if (!profitAddress && addressOptions.length > 0) {
      setProfitAddress(String(addressOptions[0].value || ""));
    }
  }, [addressOptions, profitAddress]);

  const { mutate: doBuy, loading: buying } = useMutation({
    fetcher: (payload: any) => apiOrder.buyByP(payload),
    onSuccess: () => {
      setConfirmOpen(false);
      toast.success("购买成功");
      navigate("/stock-quotes");
    },
  });

  return (
    <main className="pb-10 px-3 text-sm fade-stagger">
      <AppNav title="购买详情" />

      <section className="glass-card p-4 mt-3">
        {coinInitLoading ? (
          <div className="text-[#6a7f9f] text-xs">加载中...</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold finance-title">{coinHeader.symbol || "-"}</div>
                <div className="text-xs text-[#6a7f9f]">{coinHeader.name || "-"}</div>
              </div>
              {coinHeader.logo ? <img src={coinHeader.logo} className="w-10 h-10 rounded-full" /> : null}
            </div>
            <div className="mt-3 text-[#16305a] font-bold">当前币价: {fmtCny(livePriceCny)}</div>
            <div className="text-xs text-[#6a7f9f] mt-1">每{unitRevenue.unit}预计日收益: {fmtCny(liveUnitRevenueCny)}</div>
          </>
        )}
      </section>

      <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">按 P 购买</div>
        <input
          type="number"
          inputMode="decimal"
          step="0.0001"
          min="0"
          className="border border-[#cddfff] bg-[#f7fbff] rounded-xl px-3 py-2 w-full outline-none"
          placeholder="请输入购买数量 (P)"
          value={pCount}
          onChange={(e) => setPCount(e.target.value.replace(",", "."))}
        />

        {noAddress ? (
          <div className="mt-3 rounded-lg border border-[#ffd6db] bg-[#fff2f4] px-3 py-2 text-xs text-[#c0354f]">
            请先绑定BTC网络收款地址后购买算力。
            <Link className="ml-1 text-[#1a57aa] font-semibold" to="/receive-address">去绑定收款地址</Link>
          </div>
        ) : null}

        <div className="mt-3">
          <div className="text-xs text-[#5f7ba3] mb-1">收益到账地址</div>
          <Select
            className="w-full"
            value={profitAddress || undefined}
            onChange={(v) => setProfitAddress(String(v || ""))}
            options={addressOptions}
            placeholder={!addressLoadedOk ? "收款地址加载中..." : "请选择已绑定BTC收款地址"}
            loading={!addressLoadedOk}
          />
        </div>

        <div className="mt-3 text-[11px] text-[#5f7ba3] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <span className="whitespace-nowrap">1P单价: {fmtU(pricePerPUsd)} U</span>
            <span className="whitespace-nowrap text-right">数量: {fmtNum(pNum, 8)} P</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="whitespace-nowrap font-semibold text-[#1b437f]">总金额: {fmtU(totalAmountUsd)} U</span>
            <span className="whitespace-nowrap text-right">预计日收益: {fmtCny(dailyRevenueApprox)}</span>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-[#f5f9ff] border border-[#d8e5fb] p-3 text-xs text-[#355782] space-y-2">
          <div>USDT 可用: {fmtU(usdtBalance)}</div>
          <div>USDC 可用: {fmtU(usdcBalance)}</div>
          <div className="pt-1 border-t border-[#d8e5fb]">
            <div>应付总额: {fmtU(totalAmountUsd)} U</div>
            <div className="mt-1">支付货币：{payMethodText}</div>
          </div>
          {insufficient ? <div className="text-[#cf3f56]">余额不足，无法完成购买</div> : null}
        </div>

        <div className="pt-3 mt-5">
          <button
            className="finance-btn-primary w-full py-2.5 rounded-xl"
            disabled={buying}
            onClick={() => {
              if (!isBtc) {
                toast.warning("暂未开通此矿池");
                return;
              }
              if (!addressLoadedOk) {
                toast.warning("收款地址加载中，请稍后");
                return;
              }
              if (noAddress) {
                toast.warning("请先绑定BTC网络收款地址后购买算力");
                return;
              }
              if (!profitAddress) {
                toast.warning("请选择收益到账地址");
                return;
              }
              if (!pNum) {
                toast.warning("请输入大于 0 的 P 数量");
                return;
              }
              if (!pricePerPUsd) {
                toast.warning("1P 单价未配置，请联系管理员");
                return;
              }
              if (insufficient) {
                toast.warning("USDT + USDC 余额不足");
                return;
              }
              setConfirmOpen(true);
            }}
          >
            立即购买
          </button>
        </div>
      </section>

      <Modal
        title="确认购买信息"
        centered
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={() => {
          doBuy({
            coinSymbol: coin?.symbol,
            pCount: Number(pNum.toFixed(8)),
            totalAmountUsd,
            usdtPay: payByUsdt,
            usdcPay: payByUsdc,
            receiveAddress: profitAddress,
          });
        }}
        okText="确认购买"
        cancelText="取消"
        confirmLoading={buying}
      >
        <div className="text-sm">
          <div className="rounded-xl border border-[#d8e5fb] bg-[#f7fbff] p-3">
            <div className="grid grid-cols-[96px_1fr] items-start gap-y-2 gap-x-2 text-[#2a476f]">
              <div className="text-[#6d85a8]">合约</div>
              <div className="font-medium text-[#173a67]">BTC P合同(BTC)</div>
              <div className="text-[#6d85a8]">总购买算力</div>
              <div className="font-medium text-[#173a67]">{fmtNum(pNum, 8)} PH/s</div>
              <div className="text-[#6d85a8]">总金额</div>
              <div className="font-semibold text-[#173a67]">{fmtU(totalAmountUsd)} U</div>
              <div className="text-[#6d85a8]">预计日收益</div>
              <div className="font-medium text-[#173a67]">{fmtCny(dailyRevenueApprox)}</div>
              <div className="text-[#6d85a8]">支付方式</div>
              <div className="font-medium text-[#173a67]">{payMethodText}</div>
              <div className="text-[#6d85a8]">收益到账地址</div>
              <div className="break-all font-medium text-[#173a67]">
                {selectedAddress?.remark ? `[${selectedAddress.remark}] ` : ""}
                {profitAddress || "-"}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default CoinBuyDetail;

