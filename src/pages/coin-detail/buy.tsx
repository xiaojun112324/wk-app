import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";
import { ApiPub } from "@/apis/public";
import { apiOrder } from "@/apis/order";
import { apiUser } from "@/apis/user";
import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";

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

const calcPerPRevenueCny = (coin: any) => {
  const price = Number(coin?.priceCny || 0);
  const dailyCoin = Number(coin?.dailyRevenuePerP || 0);
  if (!Number.isFinite(price) || !Number.isFinite(dailyCoin)) return 0;
  return Number((price * dailyCoin).toFixed(8));
};

const CoinBuyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const coinId = Number(id);
  const [pCount, setPCount] = useState("1");

  const { data: coin, loading } = useQuery({
    fetcher: () => ApiPub.coinDetail({ id: coinId }),
    deps: [coinId],
  });

  const { data: buyConfig } = useQuery({
    fetcher: ApiPub.machineBuyConfig,
    params: {},
  });

  const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount, params: {} });

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
  const perPRevenueCny = useMemo(() => calcPerPRevenueCny(coin), [coin?.priceCny, coin?.dailyRevenuePerP]);
  const isBtc = useMemo(() => String(coin?.symbol || "").toUpperCase() === "BTC", [coin?.symbol]);

  const totalAmountUsd = useMemo(() => {
    if (!pNum || !pricePerPUsd) return 0;
    return Number((pNum * pricePerPUsd).toFixed(8));
  }, [pNum, pricePerPUsd]);

  const dailyRevenueApprox = useMemo(() => {
    if (!pNum || !perPRevenueCny) return 0;
    return Number((pNum * perPRevenueCny).toFixed(8));
  }, [pNum, perPRevenueCny]);

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

  const { mutate: doBuy, loading: buying } = useMutation({
    fetcher: (payload: any) => apiOrder.buyByP(payload),
    onSuccess: () => {
      toast.success("购买成功");
      navigate("/position");
    },
  });

  const canSubmit = useMemo(() => {
    return !!coin?.symbol && isBtc && pNum > 0 && pricePerPUsd > 0 && !insufficient;
  }, [coin?.symbol, isBtc, pNum, pricePerPUsd, insufficient]);

  return (
    <main className="pb-10 px-3 text-sm fade-stagger">
      <AppNav title="购买详情" />

      <section className="glass-card p-4 mt-3">
        {loading ? (
          <div className="text-[#6a7f9f] text-xs">加载中...</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold finance-title">{coin?.symbol || "-"}</div>
                <div className="text-xs text-[#6a7f9f]">{coin?.name || "-"}</div>
              </div>
              <img src={coin?.logo} className="w-10 h-10 rounded-full" />
            </div>
            <div className="mt-3 text-[#16305a] font-bold">当前币价: {fmtCny(coin?.priceCny)}</div>
            <div className="text-xs text-[#6a7f9f] mt-1">每P收益: {fmtCny(perPRevenueCny)}</div>
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

        <div className="mt-3 text-[11px] text-[#5f7ba3] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <span className="whitespace-nowrap">1P单价: {fmtU(pricePerPUsd)} U</span>
            <span className="whitespace-nowrap text-right">数量: {fmtNum(pNum, 8)} P</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="whitespace-nowrap font-semibold text-[#1b437f]">总金额: {fmtU(totalAmountUsd)} U</span>
            <span className="whitespace-nowrap text-right">日收益: {fmtCny(dailyRevenueApprox)}</span>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-[#f5f9ff] border border-[#d8e5fb] p-3 text-xs text-[#355782] space-y-2">
          <div>USDT 可用: {fmtU(usdtBalance)}</div>
          <div>USDC 可用: {fmtU(usdcBalance)}</div>
          <div className="pt-1 border-t border-[#d8e5fb]">
            <div>应付总额: {fmtU(totalAmountUsd)} U</div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <span className="whitespace-nowrap">USDT: {fmtU(payByUsdt)}</span>
              <span className="whitespace-nowrap text-right">USDC: {fmtU(payByUsdc)}</span>
            </div>
          </div>
          {insufficient ? <div className="text-[#cf3f56]">余额不足，无法完成购买</div> : null}
        </div>

        <div className="pt-3 mt-5">
          <button
            className="finance-btn-primary w-full py-2.5 rounded-xl"
            disabled={!canSubmit || buying}
            onClick={() => {
              if (!isBtc) {
                toast.warning("暂未开通此矿池");
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
              doBuy({
                coinSymbol: coin?.symbol,
                pCount: Number(pNum.toFixed(8)),
                totalAmountUsd,
                usdtPay: payByUsdt,
                usdcPay: payByUsdc,
              });
            }}
          >
            立即购买
          </button>
        </div>
      </section>
    </main>
  );
};

export default CoinBuyDetail;
