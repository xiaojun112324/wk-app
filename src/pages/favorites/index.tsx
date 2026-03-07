import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { ApiFavorite } from "@/apis/favorite";
import MiningItem from "@/pages/home/components/MiningItem";

export default function FavoritesPage() {
  const navigate = useNavigate();

  const { data, refresh } = useQuery({
    fetcher: ApiFavorite.list,
    params: {},
  });

  const list = useMemo(() => data || [], [data]);

  const onDetail = (item: any) => {
    if (!item?.id) return;
    navigate(`/coin-detail/${item.id}`);
  };

  return (
    <main className="pb-8 px-3 text-sm fade-stagger">
      <AppNav title="我的自选" />
      <section className="glass-card px-3 py-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold finance-title">自选币种</div>
          <button className="text-xs text-[#1a57aa]" onClick={() => refresh()}>刷新</button>
        </div>

        {list.length ? (
          list.map((item: any) => (
            <MiningItem key={`${item.symbol}-${item.id}`} miningItem={item} onClick={onDetail} />
          ))
        ) : (
          <div className="py-10 text-center text-[#6f89af]">暂无自选，去币种详情点击星标收藏</div>
        )}
      </section>
    </main>
  );
}

