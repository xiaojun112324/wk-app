import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { GLOBAL_FARMS } from "./data";

const fmtPrice = (val: string) => (val ? `${val} ¥ / 度` : "¥ / 度");

export default function GlobalFarmDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const farm = useMemo(() => GLOBAL_FARMS.find((item) => item.id === id), [id]);

  if (!farm) {
    return (
      <main className="pb-8 px-3 text-sm fade-stagger">
        <AppNav title="矿场详情" />
        <section className="glass-card p-4 mt-4">
          <div className="text-[#5f7ba3] text-sm">未找到该矿场信息</div>
          <button
            type="button"
            className="mt-3 px-3 py-2 rounded-lg finance-btn-primary"
            onClick={() => navigate("/global-farms")}
          >
            返回全球矿场
          </button>
        </section>
      </main>
    );
  }

  const paragraphs = farm.description.split("\n\n").filter(Boolean);

  return (
    <main className="pb-8 px-3 text-sm fade-stagger">
      <AppNav title={farm.name} />

      <section className="glass-card p-4 rounded-2xl mt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 flex-1 text-[18px] font-extrabold finance-title">{farm.name}</h2>
          <div className="shrink-0 whitespace-nowrap px-2 py-1 rounded-lg text-[11px] bg-[#e8f2ff] text-[#1f5fb8]">{farm.powerType}</div>
        </div>
        <div className="mt-2 text-xs text-[#6a7f9f]">{farm.location}</div>

        <div className="mt-4 grid grid-cols-1 gap-2 text-[13px] text-[#2f4f79]">
          <div className="rounded-xl bg-[#f4f9ff] px-3 py-2">丰水期参考电价：{fmtPrice(farm.wetSeasonPrice)}</div>
          <div className="rounded-xl bg-[#f4f9ff] px-3 py-2">枯水期参考电价：{fmtPrice(farm.drySeasonPrice)}</div>
          <div className="rounded-xl bg-[#f4f9ff] px-3 py-2">全年电价：{fmtPrice(farm.yearPrice)}</div>
        </div>
      </section>

      <section className="glass-card mt-4 p-4 rounded-2xl">
        <h3 className="font-extrabold finance-title mb-3">矿场介绍</h3>
        <div className="space-y-3 text-[14px] leading-7 text-[#355782]">
          {paragraphs.map((text, idx) => (
            <p key={idx} className="rounded-xl bg-[#f8fbff] px-3 py-2">
              {text}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
