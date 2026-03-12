import { useState } from "react";
import { Form, Input, Checkbox } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/user/userContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { setToken } from "@/lib/token";

type LoginFormValues = {
  account: string;
  password: string;
  privacyAccepted?: boolean;
};

export default function Login() {
  const [formEmail] = Form.useForm<LoginFormValues>();
  const nav = useNavigate();
  const { search } = useLocation();
  const userContext = useUserContext();
  const { refresh } = userContext;
  const [isTap, setIsTap] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { mutate: doLogin, loading } = useMutation({
    fetcher: apiUser.doLogin,
    onSuccess: (res) => {
      toast.success("登录成功");
      setToken(res?.token || res?.accessToken || null);
      const params = new URLSearchParams(search);
      const orgUrl = params.get("orgUrl");
      refresh();
      setTimeout(() => {
        if (orgUrl) {
          window.location.replace(orgUrl);
        } else {
          window.location.replace("/");
        }
      }, 1200);
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    if (!isTap) {
      toast.warning("请先完成安全验证");
      return;
    }
    doLogin({
      account: values.account,
      password: values.password,
    });
  };

  const goRegister = () => {
    setIsLeaving(true);
    setTimeout(() => nav("/register"), 220);
  };

  return (
    <motion.div
      className=" min-h-full max-w-6xl mx-auto "
      initial={{ opacity: 0, y: 10 }}
      animate={isLeaving ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
    >
      <section className=" pb-10 ">
        <div className=" px-5 pt-15  font-semibold text-2xl ">
          <div>Hi</div>
          <div>欢迎来到 CServer</div>
        </div>
      </section>
      <div className="-mt-10 px-5 rounded-2xl pt-10">
        <Form form={formEmail} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item label="邮箱/账号" name="account" rules={[{ required: true, message: "请输入邮箱/账号" }]}>
            <Input placeholder="请输入邮箱/账号" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { pattern: /^[\S]{6,12}$/, message: "密码需为 6-12 位，且不能包含空格" },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item label="安全验证">
            <AnimatePresence mode="wait">
              {!isTap ? (
                <motion.div
                  key="verify"
                  onClick={() => setIsTap(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  className="relative cursor-pointer overflow-hidden px-3 py-2.5 rounded-sm text-sm flex items-center justify-center gap-2 border border-[#b8cff5] bg-[#f7fbff]"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <ShieldCheck className="w-4 h-4 text-gray-600 relative z-10" />
                  <span className="relative z-10">点击安全验证</span>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative overflow-hidden px-3 py-2.5 rounded-sm text-sm flex items-center justify-center gap-2 bg-green-50 text-green-600"
                >
                  <motion.div
                    className="absolute w-full h-32 rounded-full bg-green-400/20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.div
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative z-10"
                  >
                    安全验证成功
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </Form.Item>

          <Form.Item
            name="privacyAccepted"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error("请阅读并同意《隐私协议》")),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意
              <Link to="/agreement/privacy?from=login" className="ml-1 text-blue-500">
                《隐私协议》
              </Link>
            </Checkbox>
          </Form.Item>

          <Button type="submit" className="w-full !text-white" loading={loading} size="lg">
            登录
          </Button>

          <div className="flex items-center mb-5 mt-3 justify-center">
            <div className="text-sm text-gray-500">
              还没有账号？&nbsp;
              <button type="button" onClick={goRegister} className="text-blue-500">
                快捷注册
              </button>
            </div>
          </div>
        </Form>
      </div>
    </motion.div>
  );
}
