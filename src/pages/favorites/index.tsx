import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { ApiPub } from "@/apis/public";

export default function FavoritesPage() {
  const navigate = useNavigate();

  const { data, loading, refresh } = useQuery({
    fetcher: ApiPub.poolStats,
    params: {},
  });

  const btcCoin = useMemo(() => {
    const list = data || [];
    return list.find((item: any) => String(item?.symbol || "").toUpperCase() === "BTC");
  }, [data]);

  useEffect(() => {
    if (loading) return;
    if (btcCoin?.id) {
      navigate(`/coin-detail/${btcCoin.id}/buy`, { replace: true });
      return;
    }

  }, [loading, btcCoin?.id, navigate]);

  return (
    <main className="pb-8 px-3 text-sm fade-stagger">
      <AppNav title="算力购买" />
      <section className="glass-card px-3 py-6 mt-3 text-center">
        {loading ? (
          <div className="text-[#6f89af]">正在跳转购买详情...</div>
        ) : (
          <>
            <div className="text-[#6f89af] mb-3">未找到 BTC 矿池，请稍后重试</div>
            <button className="finance-btn-primary px-4 py-2 rounded-xl" onClick={() => refresh()}>
              刷新
            </button>
          </>
        )}
      </section>
    </main>
  );
}
