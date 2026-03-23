import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Globe2, Calculator, ShoppingCart, Headset } from "lucide-react";
import { useQuery } from "@/hooks/useQuery";
import { usePolling } from "@/hooks/usePolling";
import { ApiPub } from "@/apis/public";
import { apiOther } from "@/apis/other";
import { FinanceBannerSkeleton, FinanceListSkeleton, FinanceNavGridSkeleton } from "@/components/finance-skeleton";
import MiningItem from "./components/MiningItem";
import { navListData } from "./navListData";

const navIconMap: Record<string, any> = {
  rank: Trophy,
  farm: Globe2,
  calculator: Calculator,
  favorite: ShoppingCart,
  support: Headset,
};

export default function Home() {
  const navigate = useNavigate();

  const { data: poolData, refresh: refreshPool, initLoading: poolInitLoading } = useQuery({
    fetcher: ApiPub.poolStats,
    params: {},
  });

  const { data: bannerData, initLoading: bannerInitLoading } = useQuery({
    fetcher: () => apiOther.getBannerList(),
    params: {},
  });

  usePolling(async () => {
    await refreshPool();
  }, { delay: 3000, enabled: true, immediateOnActivate: false });

  const list = useMemo(() => poolData || [], [poolData]);
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
      <div className="pt-3 mb-2">
        <div className="text-[18px] font-extrabold tracking-[0.2px] text-[#143b75]">CServer</div>
      </div>

      {bannerInitLoading ? (
        <FinanceBannerSkeleton />
      ) : topBannerUrl ? (
        <section className="glass-card p-1 overflow-hidden bg-[#eef5ff]">
          {topBannerJump ? (
            <a href={topBannerJump} target="_blank" rel="noreferrer">
              <img
                src={topBannerUrl}
                alt="banner"
                className="w-full h-[140px] sm:h-[156px] object-cover block rounded-xl"
                style={{ objectPosition: "center 35%" }}
              />
            </a>
          ) : (
            <img
              src={topBannerUrl}
              alt="banner"
              className="w-full h-[140px] sm:h-[156px] object-cover block rounded-xl"
              style={{ objectPosition: "center 35%" }}
            />
          )}
        </section>
      ) : null}

      {bannerInitLoading ? (
        <FinanceNavGridSkeleton />
      ) : (
        <section className="grid grid-cols-5 gap-2 py-4">
          {navListData.map((item: any) => {
            const IconComp = navIconMap[item.iconKey] || Calculator;
            return (
              <Link to={item.path} key={`${item.path}-${item.title}`} className="glass-card flex flex-col justify-center py-2 px-1">
                <div className="size-10 mx-auto rounded-xl bg-gradient-to-br from-[#e9f2ff] to-[#d8e9ff] border border-[#c9dcff] flex items-center justify-center">
                  <IconComp size={20} strokeWidth={2.2} className="text-[#2459a8]" />
                </div>
                <div className="text-[11px] mt-1 text-[#4a6794] text-center leading-4">{item.title}</div>
              </Link>
            );
          })}
        </section>
      )}

      {poolInitLoading ? (
        <FinanceListSkeleton rows={4} />
      ) : (
        <section className="glass-card px-3 py-2">
          <div className="font-bold finance-title">{"\u77ff\u6c60\u7edf\u8ba1"}</div>
          {list.map((item: any) => (
            <MiningItem miningItem={item} key={item.id} onClick={onCoinDetail} />
          ))}
        </section>
      )}
    </div>
  );
}
