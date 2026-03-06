import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { ApiPub } from "@/apis/public";
import MiningItem from "./components/MiningItem";
import RankItem from "./components/RankItem";
import { navListData } from "./navListData";

export default function Home() {
    const navigate = useNavigate();

    const { data: poolData } = useQuery({
        fetcher: ApiPub.poolStats,
        params: {},
    });

    const { data: powRankData } = useQuery({
        fetcher: ApiPub.powRank,
        params: {},
    });

    const list = useMemo(() => poolData || [], [poolData]);
    const rankList = useMemo(() => powRankData || list, [powRankData, list]);

    const onCoinDetail = (item: any) => {
        navigate(`/coin-detail/${item.id}`);
    };

    return (
        <div className="text-sm pb-6">
            <section className="flex justify-between items-center px-4 py-4">
                <span className="text-lg font-medium text-foreground">KuaiYi</span>
                <div />
            </section>

            <section className="grid grid-cols-5 gap-2 pb-4">
                {navListData.map((item: any) => (
                    <Link to={item.path} key={item.path} className="flex flex-col justify-center">
                        <div className="size-13 bg-center bg-contain mx-auto" style={{ backgroundImage: `url(${item.icon})` }} />
                        <div className="text-xs mt-0.5 text-muted-foreground text-center">{item.title}</div>
                    </Link>
                ))}
            </section>

            <div className="h-1 bg-gray-100" />

            <section className="px-4 pt-4">
                <div className="font-medium mb-1">矿池统计</div>
                {list.map((item: any) => (
                    <MiningItem miningItem={item} key={item.id} onClick={onCoinDetail} />
                ))}
            </section>

            <section className="mt-3 px-4">
                <div className="font-medium mb-1">收益排行</div>
                {rankList.map((item: any) => (
                    <RankItem item={item} key={item.id} />
                ))}
            </section>
        </div>
    );
}
