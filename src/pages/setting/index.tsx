import { Modal } from "antd";
import { Link } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { Button } from "@/components/Button";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useUserContext } from "@/contexts/user/userContext";

export default function Setting() {
  const userContext = useUserContext();

  const onLogOut = () => {
    Modal.confirm({
      title: "确定退出登录？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => userContext.logout(),
    });
  };

  return (
    <main className="min-h-screen px-5">
      <AppNav title="设置" />

      <section className="text-sm mt-6">
        <Link to="/setting/login-password" className="rounded-lg py-4 flex items-center justify-between border-b">
          <span>登录密码</span>
          <span className="text-accent-foreground flex items-center gap-1">
            修改
            <ChevronRightIcon className="size-4" />
          </span>
        </Link>

        <Link to="/setting/pay-password" className="rounded-lg py-4 flex items-center justify-between border-b">
          <span>提现密码</span>
          <span className="text-accent-foreground flex items-center gap-1">
            设置/修改
            <ChevronRightIcon className="size-4" />
          </span>
        </Link>
      </section>

      <div className="mt-10">
        <Button full onClick={onLogOut}>
          退出登录
        </Button>
      </div>
    </main>
  );
}
