import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";
import { ApiPub } from "@/apis/public";
import { apiOrder } from "@/apis/order";
import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";

const fmtCny = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  return Number.isNaN(n) ? `￥${v}` : `￥${n.toFixed(4)}`;
};

const CoinBuyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const coinId = Number(id);
  const [pCount, setPCount] = useState("1");

  const { data: coin, loading } = useQuery({
    fetcher: () => ApiPub.coinDetail({ id: coinId }),
    deps: [coinId],
  });

  const { mutate: doBuy, loading: buying } = useMutation({
    fetcher: (payload: any) => apiOrder.buyByP(payload),
    onSuccess: () => {
      toast.success("购买成功");
      navigate("/position");
    },
  });

  const canSubmit = useMemo(() => {
    const n = Number(pCount);
    return !!coin?.symbol && Number.isFinite(n) && n > 0;
  }, [coin?.symbol, pCount]);

  return (
    <main className="pb-10 px-3 text-sm fade-stagger">
      <AppNav title="购买详情" />

      <section className="glass-card p-4 mt-3">
        {loading ? (
          <div className="text-[#6a7f9f] text-xs">加载中...</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold finance-title">{coin?.symbol || "-"}</div>
                <div className="text-xs text-[#6a7f9f]">{coin?.name || "-"}</div>
              </div>
              <img src={coin?.logo} className="w-10 h-10 rounded-full" />
            </div>
            <div className="mt-3 text-[#16305a] font-bold">当前币价: {fmtCny(coin?.priceCny)}</div>
            <div className="text-xs text-[#6a7f9f] mt-1">每P收益: {fmtCny(coin?.dailyRevenuePerP)}</div>
          </>
        )}
      </section>

      <section className="glass-card mt-3 p-4">
        <div className="font-bold finance-title mb-3">按 P 购买</div>
        <input
          className="border border-[#cddfff] bg-[#f7fbff] rounded-xl px-3 py-2 w-full outline-none"
          placeholder="请输入购买数量 (P)"
          value={pCount}
          onChange={(e) => setPCount(e.target.value)}
        />
        <div className="text-xs text-[#6a7f9f] mt-2">下单金额按系统配置的每P单价（USD）与实时汇率折算。</div>

        <button
          className="finance-btn-primary w-full py-2.5 rounded-xl mt-4"
          disabled={!canSubmit || buying}
          onClick={() => {
            const n = Number(pCount);
            if (!n || n <= 0) {
              toast.warning("请输入大于 0 的 P 数量");
              return;
            }
            doBuy({ coinSymbol: coin?.symbol, pCount: n });
          }}
        >
          立即购买
        </button>
      </section>
    </main>
  );
};

export default CoinBuyDetail;
