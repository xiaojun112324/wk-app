import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  ChevronRight,
  Headset,
  KeyRound,
  LockKeyhole,
  MapPin,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
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
  const {
    data: fundPwdStatus,
    initLoading: fundPwdInitLoading,
    loading: fundPwdLoading,
  } = useQuery({ fetcher: apiUser.getWithdrawPasswordStatus });
  const {
    data: addressRows,
    res: addressRes,
    initLoading: addressInitLoading,
    loading: addressLoading,
  } = useQuery({ fetcher: apiUser.getReceiveAddressList });

  const userId = me?.id ?? userInfo?.userId ?? "-";
  const inviteCode = me?.inviteCode || "-";
  const email = me?.email || "-";
  const fundPwdReady = !fundPwdInitLoading && !fundPwdLoading;
  const hasFundPassword = !!fundPwdStatus?.hasWithdrawPassword;
  const addressReady = !addressInitLoading && !addressLoading && Number((addressRes as any)?.code) === 200;
  const hasReceiveAddress = Array.isArray(addressRows) && addressRows.length > 0;

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
      <section className="mt-3 rounded-2xl border border-[#d8e7ff] bg-gradient-to-br from-[#f3f8ff] via-[#edf5ff] to-[#e6f0ff] px-4 py-3 shadow-[0_10px_24px_rgba(33,91,168,0.12)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[18px] font-extrabold text-[#163a68] leading-none">我的</div>
            <div className="text-[12px] text-[#5f7faa] mt-1">账户信息、安全设置与常用功能</div>
          </div>
          <div className="size-10 shrink-0 rounded-xl bg-white/85 border border-[#cfe0fb] flex items-center justify-center">
            <UserRound size={18} className="text-[#255cae]" />
          </div>
        </div>
      </section>
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

        <div className="mt-3 rounded-xl border border-[#d8e5fb] bg-[#f7fbff] px-3 py-2.5 space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[#6c85aa] shrink-0">邮箱</span>
            <span className="text-[#2a4a78] font-medium text-right break-all">{email}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[#6c85aa] shrink-0">用户ID</span>
            <div className="flex items-center gap-2">
              <span className="text-[#2a4a78] font-medium">{userId}</span>
              {String(userId) !== "-" ? (
                <button
                  type="button"
                  onClick={() => onCopy(userId, "用户ID")}
                  className="px-2 py-0.5 rounded-md border border-[#c8d8f1] text-[#1f5fb8] bg-white"
                >
                  复制
                </button>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[#6c85aa] shrink-0">邀请码</span>
            <div className="flex items-center gap-2">
              <span className="text-[#2a4a78] font-medium">{inviteCode}</span>
              {inviteCode !== "-" ? (
                <button
                  type="button"
                  onClick={() => onCopy(inviteCode, "邀请码")}
                  className="px-2 py-0.5 rounded-md border border-[#c8d8f1] text-[#1f5fb8] bg-white"
                >
                  复制
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-3 space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <Link className="finance-btn-primary rounded-xl px-3 py-3 text-center font-semibold flex items-center justify-center gap-1.5" to="/deposit">
            <ArrowDownUp size={15} />
            <span>充值</span>
          </Link>
          <Link className="finance-btn-primary rounded-xl px-3 py-3 text-center font-semibold flex items-center justify-center gap-1.5" to="/withdraw">
            <ArrowDownUp size={15} />
            <span>提现</span>
          </Link>
        </div>

        <div className="glass-card rounded-xl divide-y divide-[#e2ebfb]">
          <Link className="px-3 py-3 flex items-center justify-between text-[#24364f]" to="/transactions">
            <div className="flex items-center gap-2 font-semibold">
              <ReceiptText size={16} />
              <span>资金记录</span>
            </div>
            <ChevronRight size={16} className="text-[#8ea0b8]" />
          </Link>
          <Link className="px-3 py-3 flex items-center justify-between text-[#24364f]" to="/support">
            <div className="flex items-center gap-2 font-semibold">
              <Headset size={16} />
              <span>联系客服</span>
            </div>
            <ChevronRight size={16} className="text-[#8ea0b8]" />
          </Link>
        </div>

        <div className="glass-card rounded-xl divide-y divide-[#e2ebfb]">
          <Link className="px-3 py-3 flex items-center justify-between text-[#24364f]" to="/setting/login-password">
            <div className="flex items-center gap-2 font-semibold">
              <KeyRound size={16} />
              <span>登录密码</span>
            </div>
            <ChevronRight size={16} className="text-[#8ea0b8]" />
          </Link>
          <Link className="px-3 py-3 flex items-center justify-between text-[#24364f]" to="/setting/pay-password">
            <div className="flex items-center gap-2 font-semibold">
              <LockKeyhole size={16} />
              <span>资金密码</span>
            </div>
            <div className="flex items-center gap-1.5">
              {fundPwdReady && !hasFundPassword ? <AlertCircle size={16} className="text-[#f59e0b]" /> : null}
              <ChevronRight size={16} className="text-[#8ea0b8]" />
            </div>
          </Link>
          <Link className="px-3 py-3 flex items-center justify-between text-[#24364f]" to="/receive-address">
            <div className="flex items-center gap-2 font-semibold">
              <MapPin size={16} />
              <span>收款地址绑定</span>
            </div>
            <div className="flex items-center gap-1.5">
              {addressReady && !hasReceiveAddress ? <AlertCircle size={16} className="text-[#f59e0b]" /> : null}
              <ChevronRight size={16} className="text-[#8ea0b8]" />
            </div>
          </Link>
          <Link className="px-3 py-3 flex items-center justify-between text-[#24364f]" to="/security-check">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck size={16} />
              <span>环境安全检测</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-[#16a34a]" />
              <ChevronRight size={16} className="text-[#8ea0b8]" />
            </div>
          </Link>
        </div>

        <div className="h-px bg-[#dbe5f6] my-0.5" />
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


