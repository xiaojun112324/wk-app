import { Form, Input, Select } from "antd";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";
import { Link } from "react-router-dom";

export default function Withdraw() {
  const [form] = Form.useForm();
  const asset = Form.useWatch("asset", form) || "USDT";
  const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount });
  const { data: withdrawPwdStatus } = useQuery({ fetcher: apiUser.getWithdrawPasswordStatus });

  useEffect(() => {
    form.setFieldsValue({
      amount: undefined,
      receiveAddress: undefined,
      withdrawPassword: undefined,
    });

    if (asset === "BTC") {
      form.setFieldValue("network", "BTC");
      return;
    }
    if (asset === "USDC") {
      form.setFieldValue("network", "ERC20");
      return;
    }
    if (!form.getFieldValue("network") || form.getFieldValue("network") === "BTC") {
      form.setFieldValue("network", "TRC20");
    }
  }, [asset, form]);

  const pickBalance = (candidates: string[]) => {
    for (const key of candidates) {
      const value = wallet?.[key];
      if (value !== null && value !== undefined && value !== "") return value;
    }
    return 0;
  };

  const balanceMap: Record<string, any> = {
    USDT: pickBalance(["usdtBalance", "balanceUsdt", "usdt", "usdtAmount"]),
    USDC: pickBalance(["usdcBalance", "balanceUsdc", "usdc", "usdcAmount"]),
    BTC: pickBalance(["btcBalance", "balanceBtc", "btc", "btcAmount"]),
  };
  const currentBalance = balanceMap[asset] ?? 0;
  const fillAllAmount = () => {
    form.setFieldValue("amount", `${currentBalance ?? 0}`);
  };

  const { mutate: submitWithdraw, loading } = useMutation({
    fetcher: apiUser.withdraw,
    onSuccess: () => {
      toast.success("提交成功");
      form.resetFields();
    },
  });

  return (
    <section className="px-3 pb-8 fade-stagger">
      <AppNav title="提交提现" />
      <div className="glass-card px-4 py-4 mt-3">
        {!withdrawPwdStatus?.hasWithdrawPassword ? (
          <div className="mb-3 rounded-lg border border-[#ffd6db] bg-[#fff2f4] px-3 py-2 text-xs text-[#c0354f]">
            未设置提现密码，暂时不能提现。请先
            <Link className="ml-1 text-[#1a57aa] font-semibold" to="/setting/pay-password">去设置提现密码</Link>
          </div>
        ) : null}
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (!withdrawPwdStatus?.hasWithdrawPassword) {
              toast.warning("请先设置提现密码");
              return;
            }
            submitWithdraw(values);
          }}
        >
          <Form.Item label="资产" name="asset" initialValue="USDT" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "USDT", value: "USDT" },
                { label: "USDC", value: "USDC" },
                { label: "BTC", value: "BTC" },
              ]}
            />
          </Form.Item>
          <div className="text-xs text-[#5d7ca8] -mt-2 mb-3">当前可用余额：{currentBalance} {asset}</div>

          <Form.Item label="网络" name="network" initialValue="TRC20" rules={[{ required: true }]}>
            <Select
              options={
                asset === "BTC"
                  ? [{ label: "BTC", value: "BTC" }]
                  : asset === "USDC"
                  ? [{ label: "ERC20", value: "ERC20" }]
                  : [
                      { label: "TRC20", value: "TRC20" },
                      { label: "ERC20", value: "ERC20" },
                    ]
              }
            />
          </Form.Item>

          <Form.Item label="提现数量" name="amount" rules={[{ required: true, message: "请输入数量" }]}>
            <Input
              type="number"
              placeholder="请输入提现数量"
              suffix={
                <span
                  className="text-[#1a57aa] font-semibold cursor-pointer select-none"
                  onClick={fillAllAmount}
                >
                  全部
                </span>
              }
            />
          </Form.Item>

          <Form.Item label="收款地址" name="receiveAddress" rules={[{ required: true, message: "请输入收款地址" }]}>
            <Input placeholder="请输入收款地址" />
          </Form.Item>

          <Form.Item label="提现密码" name="withdrawPassword" rules={[{ required: true, message: "请输入提现密码" }]}>
            <Input.Password placeholder="请输入提现密码" />
          </Form.Item>

          <Button type="submit" className="w-full finance-btn-primary" loading={loading}>
            提交提现
          </Button>
        </Form>
      </div>
    </section>
  );
}
