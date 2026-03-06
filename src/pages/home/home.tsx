import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { usePolling } from "@/hooks/usePolling";
import { ApiPub } from "@/apis/public";
import { apiOther } from "@/apis/other";
import MiningItem from "./components/MiningItem";
import RankItem from "./components/RankItem";
import { navListData } from "./navListData";

export default function Home() {
  const navigate = useNavigate();

  const { data: poolData, refresh: refreshPool } = useQuery({
    fetcher: ApiPub.poolStats,
    params: {},
  });

  const { data: powRankData, refresh: refreshPowRank } = useQuery({
    fetcher: ApiPub.powRank,
    params: {},
  });

  const { data: bannerData } = useQuery({
    fetcher: () => apiOther.getBannerList(),
    params: {},
  });

  usePolling(async () => {
    await Promise.all([refreshPool(), refreshPowRank()]);
  }, { delay: 3000, enabled: true, immediateOnActivate: false });

  const list = useMemo(() => poolData || [], [poolData]);
  const rankList = useMemo(() => powRankData || list, [powRankData, list]);
  const bannerList = useMemo(() => bannerData || [], [bannerData]);
  const topBanner = useMemo(() => bannerList[0], [bannerList]);
  const topBannerUrl = useMemo(
    () =>
      topBanner?.bannerUrl ||
      topBanner?.bannerImg ||
      topBanner?.image ||
      topBanner?.imageUrl ||
      topBanner?.imgUrl ||
      topBanner?.picUrl ||
      topBanner?.coverUrl ||
      "",
    [topBanner]
  );
  const topBannerJump = useMemo(
    () =>
      topBanner?.linkUrl ||
      topBanner?.jumpUrl ||
      topBanner?.url ||
      "",
    [topBanner]
  );

  const onCoinDetail = (item: any) => {
    navigate(`/coin-detail/${item.id}`);
  };

  return (
    <div className="text-sm pb-6 px-3 fade-stagger">
      {topBannerUrl ? (
        <section className="glass-card p-1 mt-3 overflow-hidden bg-[#eef5ff]">
          {topBannerJump ? (
            <a href={topBannerJump} target="_blank" rel="noreferrer">
              <img src={topBannerUrl} alt="banner" className="w-full h-auto block rounded-xl" />
            </a>
          ) : (
            <img src={topBannerUrl} alt="banner" className="w-full h-auto block rounded-xl" />
          )}
        </section>
      ) : null}

      <section className="grid grid-cols-5 gap-2 py-4">
        {navListData.map((item: any) => (
          <Link to={item.path} key={item.path} className="glass-card flex flex-col justify-center py-2 px-1">
            <div className="size-10 bg-center bg-contain mx-auto" style={{ backgroundImage: `url(${item.icon})` }} />
            <div className="text-[11px] mt-1 text-[#4a6794] text-center leading-4">{item.title}</div>
          </Link>
        ))}
      </section>

      <section className="glass-card px-3 py-2">
        <div className="font-bold finance-title">矿池统计</div>
        {list.map((item: any) => (
          <MiningItem miningItem={item} key={item.id} onClick={onCoinDetail} />
        ))}
      </section>

      <section className="glass-card px-3 py-2 mt-3">
        <div className="font-bold finance-title">收益排行</div>
        {rankList.map((item: any) => (
          <RankItem item={item} key={item.id} />
        ))}
      </section>
    </div>
  );
}
