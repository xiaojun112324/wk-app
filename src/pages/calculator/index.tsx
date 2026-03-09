import { useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { ApiPub } from "@/apis/public";

const fmt = (v: any, d = 8) => {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n.toFixed(d).replace(/\.?0+$/, "") : "0";
};

const fmtCny = (v: any, d = 4) => {
  const n = Number(v || 0);
  return Number.isFinite(n) ? `￥${n.toFixed(d).replace(/\.?0+$/, "")}` : "￥0";
};

const Calculator = () => {
  const { data: poolStats } = useQuery({ fetcher: ApiPub.poolStats, params: {} });

  const options = useMemo(
    () => (poolStats || []).map((c: any) => ({ label: `${c.symbol} (${c.name || ""})`, value: c.symbol })),
    [poolStats]
  );

  const defaultSymbol = options[0]?.value || "BTC";
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [phInput, setPhInput] = useState("1");

  const currentCoin = useMemo(
    () => (poolStats || []).find((c: any) => c.symbol === symbol) || (poolStats || [])[0] || null,
    [poolStats, symbol]
  );

  const phNum = useMemo(() => {
    const n = Number(phInput);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return n;
  }, [phInput]);

  const priceCny = Number(currentCoin?.priceCny || 0);
  const dailyCoinPerP = Number(currentCoin?.dailyRevenuePerP || 0);
  const perPRevenueCny = useMemo(() => Number((priceCny * dailyCoinPerP).toFixed(8)), [priceCny, dailyCoinPerP]);
  const dailyCoin = useMemo(() => Number((phNum * dailyCoinPerP).toFixed(12)), [phNum, dailyCoinPerP]);
  const dailyRevenueCny = useMemo(() => Number((dailyCoin * priceCny).toFixed(8)), [dailyCoin, priceCny]);


  return (
    <main className="min-h-screen px-3 pb-8 fade-stagger text-sm">
      <AppNav title="收益计算器" />

      <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">参数输入</div>

        <div className="text-xs text-[#5f7ba3] mb-1">币种</div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full border border-[#cddfff] bg-[#f7fbff] rounded-xl px-3 py-2 outline-none"
        >
          {options.map((o: any) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="text-xs text-[#5f7ba3] mt-3 mb-1">算力 (PH/s)</div>
        <input
          type="number"
          value={phInput}
          onChange={(e) => setPhInput(e.target.value)}
          className="w-full border border-[#cddfff] bg-[#f7fbff] rounded-xl px-3 py-2 outline-none"
          placeholder="请输入算力，例如 1"
        />
      </section>

      <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">计算结果</div>
        <div className="finance-kv text-[11px]">
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">当前币价</span><span className="whitespace-nowrap">{fmtCny(priceCny, 2)}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">每P日产币</span><span className="whitespace-nowrap">{fmt(dailyCoinPerP, 12)} {currentCoin?.symbol || symbol}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">每P日收益</span><span className="whitespace-nowrap">{fmtCny(perPRevenueCny)}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">输入算力</span><span className="whitespace-nowrap">{fmt(phNum, 4)} PH/s</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">预计日产币</span><span className="whitespace-nowrap">{fmt(dailyCoin, 12)} {currentCoin?.symbol || symbol}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">预计日收益</span><span className="whitespace-nowrap">{fmtCny(dailyRevenueCny)}</span></div>
        </div>

        <div className="mt-3 rounded-xl bg-[#f5f9ff] border border-[#d8e5fb] p-3 text-xs text-[#355782]">
          计算公式：每日收益(CNY) = 币价(CNY) × 每日币收益(每P) × 算力(PH/s)
        </div>
      </section>
    </main>
  );
};

export default Calculator;
