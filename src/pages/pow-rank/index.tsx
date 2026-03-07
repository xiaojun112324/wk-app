import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { usePolling } from "@/hooks/usePolling";
import { ApiPub } from "@/apis/public";
import RankItem from "@/pages/home/components/RankItem";

export default function PowRankPage() {
  const { data, refresh } = useQuery({
    fetcher: ApiPub.powRank,
    params: {},
  });

  usePolling(async () => {
    await refresh();
  }, { delay: 3000, enabled: true, immediateOnActivate: false });

  const rankList = useMemo(() => data || [], [data]);

  return (
    <main className="text-sm pb-8 px-3 fade-stagger">
      <AppNav title="收益排行" right={<Link to="/support" className="text-xs text-[#1a57aa]">在线客服</Link>} />
      <section className="glass-card px-3 py-3 mt-4">
        <div className="font-bold finance-title">收益排行</div>
        <div className="text-[12px] text-[#5f7ba3] mt-1">收益单位：人民币 /P，币价单位：人民币（¥）</div>
        {rankList.length ? (
          rankList.map((item: any) => <RankItem item={item} key={item.id ?? item.symbol} />)
        ) : (
          <div className="py-6 text-center text-[#5f7ba3]">暂无数据</div>
        )}
      </section>
    </main>
  );
}

