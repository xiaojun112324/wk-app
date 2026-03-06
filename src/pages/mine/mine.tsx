import { Link } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { apiUser } from "@/apis/user";
import { useUserContext } from "@/contexts/user/userContext";

export default function Mine() {
    const userContext = useUserContext();
    const { userInfo } = userContext.store;

    const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount });
    const { data: me } = useQuery({ fetcher: apiUser.selectUserBase, params: {} });

    return (
        <div className="text-sm pb-8 px-3 fade-stagger">
            <section className="glass-card px-4 py-4 mt-3">
                <div className="text-lg font-extrabold finance-title">我的</div>
                <div className="text-xs text-[#5d7ca8] mt-1">{me?.username || userInfo?.username || "-"}</div>
                <div className="text-xs text-[#5d7ca8]">{me?.email || "-"}</div>
                <div className="text-xs text-[#3d5f90] mt-1">邀请码: {me?.inviteCode || "-"}</div>
            </section>

            <section className="glass-card px-4 py-4 mt-3">
                <div className="font-bold finance-title mb-2">钱包</div>
                <div className="finance-kv">
                    <div>余额(CNY): {wallet?.balanceCny ?? 0}</div>
                    <div>冻结(CNY): {wallet?.freezeCny ?? 0}</div>
                    <div>总充值(CNY): {wallet?.totalRechargeCny ?? 0}</div>
                    <div>总提现(CNY): {wallet?.totalWithdrawCny ?? 0}</div>
                </div>
            </section>

            <section className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <Link className="finance-btn-primary rounded-xl px-3 py-2 text-center" to="/deposit">提交充值</Link>
                <Link className="finance-btn-primary rounded-xl px-3 py-2 text-center" to="/withdraw">提交提现</Link>
                <Link className="glass-card rounded-xl px-3 py-2 text-center font-semibold text-[#1c4d9d]" to="/transactions">资金记录</Link>
                <Link className="glass-card rounded-xl px-3 py-2 text-center font-semibold text-[#1c4d9d]" to="/position">矿机订单</Link>
            </section>
        </div>
    );
}

