import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { useQuery } from "@/hooks/useQuery";
import { apiUser } from "@/apis/user";
import { useUserContext } from "@/contexts/user/userContext";
import { copyToClipboard } from "@/lib/copyToClipboard";

export default function Mine() {
  const userContext = useUserContext();
  const { userInfo } = userContext.store;

  const { data: me } = useQuery({ fetcher: apiUser.selectUserBase, params: {} });

  const userId = me?.id ?? userInfo?.userId ?? "-";
  const inviteCode = me?.inviteCode || "-";
  const email = me?.email || "-";

  const onCopy = async (value: string | number, label: string) => {
    const text = String(value || "").trim();
    if (!text || text === "-") return;
    try {
      await copyToClipboard(text);
      toast.success(`${label}已复制`);
    } catch {
      toast.error(`${label}复制失败`);
    }
  };

  const onLogout = () => {
    Modal.confirm({
      title: "确定退出登录？",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await apiUser.logoutUser({});
        } catch {
          // JWT 无状态场景下，本地登出依然生效
        } finally {
          userContext.logout();
        }
      },
    });
  };

  return (
    <div className="text-sm pb-8 px-3 fade-stagger">
      <section className="glass-card px-4 py-4 mt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-lg font-extrabold finance-title">个人信息</div>
            <div className="text-xs text-[#5d7ca8] mt-1 truncate">{me?.username || userInfo?.username || "-"}</div>
          </div>
          <div className="shrink-0 rounded-xl px-3 py-2 bg-gradient-to-r from-[#17b464] to-[#4ddc8a] text-white shadow-[0_8px_18px_rgba(22,163,74,0.28)] flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="animate-pulse" />
            <span className="text-[11px] font-semibold whitespace-nowrap">账户安全保护中</span>
          </div>
        </div>

        <div className="text-xs text-[#5d7ca8] mt-2">邮箱：{email}</div>

        <div className="text-xs text-[#3d5f90] mt-2 flex items-center gap-2">
          <span>ID：{userId}</span>
          {String(userId) !== "-" ? (
            <button
              type="button"
              onClick={() => onCopy(userId, "用户ID")}
              className="px-2 py-0.5 rounded-md border border-[#c8d8f1] text-[#1f5fb8] bg-[#f4f9ff]"
            >
              复制
            </button>
          ) : null}
        </div>

        <div className="text-xs text-[#3d5f90] mt-2 flex items-center gap-2">
          <span>邀请码：{inviteCode}</span>
          {inviteCode !== "-" ? (
            <button
              type="button"
              onClick={() => onCopy(inviteCode, "邀请码")}
              className="px-2 py-0.5 rounded-md border border-[#c8d8f1] text-[#1f5fb8] bg-[#f4f9ff]"
            >
              复制
            </button>
          ) : null}
        </div>
      </section>

      <section className="mt-3 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <Link className="finance-btn-primary rounded-xl px-3 py-3 text-center font-semibold" to="/deposit">充值</Link>
          <Link className="finance-btn-primary rounded-xl px-3 py-3 text-center font-semibold" to="/withdraw">提现</Link>
        </div>
        <Link className="glass-card rounded-xl px-3 py-3 text-center font-semibold text-[#1c4d9d] block" to="/transactions">资金记录</Link>
        <Link className="glass-card rounded-xl px-3 py-3 text-center font-semibold text-[#1c4d9d] block" to="/setting/login-password">修改登录密码</Link>
        <Link className="glass-card rounded-xl px-3 py-3 text-center font-semibold text-[#1c4d9d] block" to="/setting/pay-password">修改提现密码</Link>
        <Link className="glass-card rounded-xl px-3 py-3 text-center font-semibold text-[#1c4d9d] block" to="/support">联系客服</Link>
        <div className="h-px bg-[#dbe5f6] my-1" />
        <button
          type="button"
          onClick={onLogout}
          className="finance-btn-primary rounded-xl px-3 py-3 text-center font-semibold text-white block w-full"
        >
          退出登录
        </button>
      </section>
    </div>
  );
}
