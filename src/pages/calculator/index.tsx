import { useMemo, useState } from "react";
import { Select } from "antd";
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

const UNIT_STEP: Record<string, string> = {
  EH: "PH",
  PH: "TH",
  TH: "GH",
  GH: "MH",
  MH: "KH",
  KH: "H",
  H: "H",
};

const P_FACTOR: Record<string, number> = {
  EH: 1000,
  PH: 1,
  TH: 0.001,
  GH: 0.000001,
  MH: 0.000000001,
  KH: 0.000000000001,
  H: 0.000000000000001,
};

const parseHashrateUnit = (val: any) => {
  const raw = String(val || "").toUpperCase();
  const m = raw.match(/([KMGTPE]?H)\/S/);
  return m?.[1] || "PH";
};

const Calculator = () => {
  const { data: poolStats } = useQuery({ fetcher: ApiPub.poolStats, params: {} });

  const options = useMemo(
    () => (poolStats || []).map((c: any) => ({ label: `${c.symbol} (${c.name || ""})`, value: c.symbol })),
    [poolStats]
  );

  const defaultSymbol = options[0]?.value || "BTC";
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [hashInput, setHashInput] = useState("1");

  const currentCoin = useMemo(
    () => (poolStats || []).find((c: any) => c.symbol === symbol) || (poolStats || [])[0] || null,
    [poolStats, symbol]
  );

  const hashNum = useMemo(() => {
    const n = Number(hashInput);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return n;
  }, [hashInput]);

  const inputUnit = useMemo(() => {
    const netUnit = parseHashrateUnit(currentCoin?.networkHashrate);
    return UNIT_STEP[netUnit] || "PH";
  }, [currentCoin?.networkHashrate]);

  const inputToPFactor = useMemo(() => P_FACTOR[inputUnit] || 1, [inputUnit]);

  const priceCny = Number(currentCoin?.priceCny || 0);
  const dailyCoinPerP = Number(currentCoin?.dailyRevenuePerP || 0);
  const dailyCoinPerInputUnit = useMemo(
    () => Number((dailyCoinPerP * inputToPFactor).toFixed(12)),
    [dailyCoinPerP, inputToPFactor]
  );
  const perUnitRevenueCny = useMemo(
    () => Number((priceCny * dailyCoinPerInputUnit).toFixed(8)),
    [priceCny, dailyCoinPerInputUnit]
  );
  const dailyCoin = useMemo(() => Number((hashNum * dailyCoinPerInputUnit).toFixed(12)), [hashNum, dailyCoinPerInputUnit]);
  const dailyRevenueCny = useMemo(() => Number((dailyCoin * priceCny).toFixed(8)), [dailyCoin, priceCny]);

  return (
    <main className="min-h-screen px-3 pb-8 fade-stagger text-sm">
      <AppNav title="收益计算器" />

      <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">参数输入</div>

        <div className="text-xs text-[#5f7ba3] mb-1">币种</div>
        <Select
          value={symbol}
          onChange={setSymbol}
          className="w-full"
          options={options}
          placeholder="请选择币种"
        />

        <div className="text-xs text-[#5f7ba3] mt-3 mb-1">算力 ({inputUnit}/s)</div>
        <input
          type="number"
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          className="w-full border border-[#cddfff] bg-[#f7fbff] rounded-xl px-3 py-2 outline-none"
          placeholder={`请输入算力，例如 1 ${inputUnit}/s`}
        />
      </section>

      <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">计算结果</div>
        <div className="finance-kv text-[11px]">
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">当前币价</span><span className="whitespace-nowrap">{fmtCny(priceCny, 2)}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">每{inputUnit}日产币</span><span className="whitespace-nowrap">{fmt(dailyCoinPerInputUnit, 12)} {currentCoin?.symbol || symbol}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">每{inputUnit}日收益</span><span className="whitespace-nowrap">{fmtCny(perUnitRevenueCny)}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">输入算力</span><span className="whitespace-nowrap">{fmt(hashNum, 4)} {inputUnit}/s</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">预计日产币</span><span className="whitespace-nowrap">{fmt(dailyCoin, 12)} {currentCoin?.symbol || symbol}</span></div>
          <div className="flex justify-between items-center gap-2"><span className="whitespace-nowrap">预计日收益</span><span className="whitespace-nowrap">{fmtCny(dailyRevenueCny)}</span></div>
        </div>

        <div className="mt-3 rounded-xl bg-[#f5f9ff] border border-[#d8e5fb] p-3 text-xs text-[#355782]">
          计算公式：每日收益(CNY) = 币价(CNY) × 每日币收益(每{inputUnit}) × 算力({inputUnit}/s)
        </div>
      </section>
    </main>
  );
};

export default Calculator;
