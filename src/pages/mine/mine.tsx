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
        <div className="text-sm pb-8">
            <section className="px-4 py-4 border-b">
                <div className="text-lg font-semibold">我的</div>
                <div className="text-xs text-gray-500 mt-1">{me?.username || userInfo?.username || "-"}</div>
                <div className="text-xs text-gray-500">{me?.email || "-"}</div>
                <div className="text-xs text-gray-500">邀请码: {me?.inviteCode || "-"}</div>
            </section>

            <section className="px-4 py-4 border-b">
                <div className="font-medium mb-2">钱包</div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div>余额(CNY): {wallet?.balanceCny ?? 0}</div>
                    <div>冻结(CNY): {wallet?.freezeCny ?? 0}</div>
                    <div>总充值(CNY): {wallet?.totalRechargeCny ?? 0}</div>
                    <div>总提现(CNY): {wallet?.totalWithdrawCny ?? 0}</div>
                </div>
            </section>

            <section className="px-4 py-4 grid grid-cols-2 gap-3 text-xs">
                <Link className="border rounded px-3 py-2" to="/deposit">提交充值</Link>
                <Link className="border rounded px-3 py-2" to="/withdraw">提交提现</Link>
                <Link className="border rounded px-3 py-2" to="/transactions">资金记录</Link>
                <Link className="border rounded px-3 py-2" to="/position">矿机订单</Link>
            </section>
        </div>
    );
}
