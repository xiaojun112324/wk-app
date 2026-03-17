import { useCallback, useEffect, useState } from "react";
import { Checkbox, Form, Input } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CODES = [
  {
    label: "https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code1.png",
    value: "3n3d",
  },
  {
    label: "https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code2.png",
    value: "vrvt",
  },
  {
    label: "https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code3.png",
    value: "m8k2",
  },
  {
    label: "https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code4.png",
    value: "7wob",
  },
  {
    label: "https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code5.png",
    value: "xzih",
  },
];

type RegisterValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  VerificationCode: string;
  inviteCode?: string;
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("inviteCode");
  const nav = useNavigate();
  const [form] = Form.useForm<RegisterValues>();
  const [currentCode, setCurrentCode] = useState<{ label: string; value: string } | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const getRandomCode = useCallback(() => {
    const index = Math.floor(Math.random() * CODES.length);
    setCurrentCode(CODES[index]);
  }, []);

  useEffect(() => {
    getRandomCode();
  }, [getRandomCode]);

  useEffect(() => {
    if (inviteCode) {
      form.setFieldsValue({ inviteCode });
    }
  }, [inviteCode, form]);

  const { mutate: doRegister, loading } = useMutation({
    fetcher: apiUser.doRegister,
    onSuccess: () => {
      toast.success("注册成功");
      form.resetFields();
      setTimeout(() => nav("/login"), 1000);
    },
  });

  const handleSubmit = (values: RegisterValues) => {
    if (values.password !== values.confirmPassword) {
      toast.warning("两次输入的密码不一致");
      return;
    }
    if (!currentCode) {
      toast.warning("验证码错误");
      return;
    }
    if (values.VerificationCode.toLowerCase() !== currentCode.value.toLowerCase()) {
      toast.warning("验证码错误");
      return;
    }

    doRegister({
      username: values.username,
      email: values.email,
      password: values.password,
      inviteCode: values.inviteCode,
    });
  };

  const goLogin = () => {
    setIsLeaving(true);
    setTimeout(() => nav("/login"), 220);
  };

  return (
    <motion.div
      className=" min-h-full max-w-6xl mx-auto pt-3 px-5"
      initial={{ opacity: 0, y: 10 }}
      animate={isLeaving ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
    >
      <div className="mt-2">
        <Form form={form} layout="vertical" onFinish={handleSubmit} key="phoneForm">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: "请输入邮箱" }]}>
            <Input placeholder="请输入邮箱" />
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

          <Form.Item label="确认密码" name="confirmPassword" rules={[{ required: true, message: "请再次输入密码" }]}>
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item label="邀请码" name="inviteCode" rules={[{ required: false, message: "请输入邀请码" }]}>
            <Input placeholder="请输入邀请码" />
          </Form.Item>

          <Form.Item label="验证码" name="VerificationCode" rules={[{ required: true, message: "请输入验证码" }]}>
            <div className="flex items-center -mt-1">
              <Input placeholder="请输入验证码" />
              <img
                className="h-12 ml-1 rounded relative !pointer-events-auto object-cover bg-center "
                onClick={getRandomCode}
                src={currentCode?.label}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="agreement"
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
              <Link to="/agreement/privacy?from=register" className="ml-1 text-blue-500">
                《隐私协议》
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="submit" className="w-full !text-white" loading={loading}>
              注册
            </Button>
          </Form.Item>

          <div className="flex items-center mb-5 mt-3 justify-center">
            <div className="text-sm text-gray-500">
              已有账号？&nbsp;
              <Link
                to="/login"
                onClick={(e) => {
                  e.preventDefault();
                  goLogin();
                }}
                className="ml-1 text-blue-500 hover:underline"
              >
                去登录
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </motion.div>
  );
}
