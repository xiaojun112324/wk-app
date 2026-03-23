import { useMemo } from "react";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { usePolling } from "@/hooks/usePolling";
import { ApiPub } from "@/apis/public";
import { FinanceListSkeleton } from "@/components/finance-skeleton";

const toNum = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const fmtNum = (v: any, d = 8) => {
  const n = toNum(v);
  return n.toFixed(d).replace(/\.?0+$/, "");
};

const fmtCny = (v: any, d = 2) => `¥${fmtNum(v, d)}`;

const fmtPct = (v: any) => {
  const n = toNum(v);
  const s = n >= 0 ? "+" : "";
  return `${s}${fmtNum(n, 4)}%`;
};

const fmtMarketCap = (v: any) => {
  const n = toNum(v);
  if (n >= 100000000) return `¥${fmtNum(n / 100000000, 2)}亿`;
  return `¥${fmtNum(n, 0)}`;
};

const parseHashrateToPh = (val: any) => {
  const raw = String(val || "").trim().toUpperCase();
  if (!raw) return 0;
  const m = raw.match(/([0-9]+(?:\.[0-9]+)?)\s*([KMGTPE]?H)\/S/);
  if (!m) return 0;

  const num = Number(m[1]);
  const unit = m[2];
  if (!Number.isFinite(num)) return 0;

  if (unit === "EH") return num * 1000;
  if (unit === "PH") return num;
  if (unit === "TH") return num / 1000;
  if (unit === "GH") return num / 1000000;
  if (unit === "MH") return num / 1000000000;
  if (unit === "KH") return num / 1000000000000;
  if (unit === "H") return num / 1000000000000000;
  return 0;
};

const calcPow24hOutputCny = (item: any) => {
  const priceCny = toNum(item?.priceCny);
  const dailyPerP = toNum(item?.dailyRevenuePerP || toNum(item?.dailyRevenuePerT) * 1000);
  const networkPh = parseHashrateToPh(item?.networkHashrate || item?.poolHashrate);
  return priceCny * dailyPerP * networkPh;
};

export default function PowRankPage() {
  const { data, refresh, initLoading } = useQuery({
    fetcher: ApiPub.powRank,
    params: {},
  });

  usePolling(async () => {
    await refresh();
  }, { delay: 3000, enabled: true, immediateOnActivate: false });

  const rankList = useMemo(
    () =>
      (data || [])
        .map((item: any) => ({
          ...item,
          pow24hOutputCny: calcPow24hOutputCny(item),
        }))
        .sort((a: any, b: any) => toNum(b.pow24hOutputCny) - toNum(a.pow24hOutputCny)),
    [data]
  );

  return (
    <main className="text-sm pb-8 px-3 fade-stagger">
      <AppNav title="PoW排行" />
      <section className="glass-card px-3 py-3 mt-4">
        <div className="font-bold finance-title">PoW排行</div>
        <div className="text-[12px] text-[#5f7ba3] mt-1">按全网 PoW 24小时产出排行（人民币）</div>
        <div className="mt-3 mb-1 px-2 text-[11px] text-[#7b8faa] grid grid-cols-[1fr_90px_120px] gap-2">
          <div>币种 / 算法</div>
          <div className="text-right">币价 / 涨幅</div>
          <div className="text-right">流通市值 / PoW24h产出</div>
        </div>

        {initLoading ? (
          <div className="mt-3">
            <FinanceListSkeleton rows={4} />
          </div>
        ) : rankList.length ? (
          rankList.map((item: any, index: number) => {
            return (
              <div key={item.id ?? item.symbol} className="finance-list-row">
                <div className="grid grid-cols-[1fr_90px_120px] gap-2 items-center">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 text-[12px] font-bold text-[#5f7ba3] text-center shrink-0">{index + 1}</div>
                    <img
                      src={item?.logo || "https://dummyimage.com/88x88/e6eefc/3e5f8f.png&text=COIN"}
                      alt={item?.symbol || "coin"}
                      className="w-10 h-10 rounded-full ring-2 ring-[#d8e6ff] shrink-0 object-cover"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[#163966] truncate">{item?.symbol || item?.name || "-"}</div>
                      <div className="text-[12px] text-[#5f7ba3] truncate">{item?.algorithm || "-"}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-semibold text-[#0f3c7f]">{fmtCny(item?.priceCny)}</div>
                    <div className={`text-[12px] ${toNum(item?.priceChange24h) >= 0 ? "text-[#0f9f64]" : "text-[#cf3f56]"}`}>{fmtPct(item?.priceChange24h)}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-semibold text-[#173a67]">{fmtMarketCap(item?.marketCap)}</div>
                    <div className="text-[12px] text-[#5f7ba3]">{fmtCny(item?.pow24hOutputCny)}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-6 text-center text-[#5f7ba3]">暂无数据</div>
        )}
      </section>
    </main>
  );
}
