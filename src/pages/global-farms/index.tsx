import { useNavigate } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { GLOBAL_FARMS } from "./data";

const fmtPrice = (val: string) => (val ? `${val} ¥ / 度` : "¥ / 度");

export default function GlobalFarmsPage() {
  const navigate = useNavigate();

  return (
    <main className="pb-8 px-3 text-sm fade-stagger">
      <AppNav title="全球矿场" />

      <section className="space-y-3 mt-4">
        {GLOBAL_FARMS.map((farm) => (
          <article key={farm.id} className="glass-card p-4 rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-extrabold finance-title">{farm.name}</h3>
                <p className="text-xs text-[#6a7f9f] mt-1">{farm.summary}</p>
              </div>
              <div className="shrink-0 whitespace-nowrap px-2 py-1 rounded-lg text-[11px] bg-[#e8f2ff] text-[#1f5fb8]">{farm.powerType}</div>
            </div>

            <div className="mt-3 text-[13px] text-[#2f4f79] space-y-1.5">
              <div className="min-w-0 flex-1">丰水期参考电价：{fmtPrice(farm.wetSeasonPrice)}</div>
              <div className="min-w-0 flex-1">枯水期参考电价：{fmtPrice(farm.drySeasonPrice)}</div>
              <div className="min-w-0 flex-1">全年电价：{fmtPrice(farm.yearPrice)}</div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-[#5f7ba3]">{farm.location}</div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full text-xs border border-[#b8cff5] text-[#1f5fb8] bg-[#f4f9ff]"
                onClick={() => navigate(`/global-farms/${farm.id}`)}
              >
                查看详情
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

