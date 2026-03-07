import { Form, Input, Select } from "antd";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import UploadImg from "@/components/UploadImg";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";

export default function Deposit() {
  const [form] = Form.useForm();
  const asset = Form.useWatch("asset", form) || "USDT";
  const { data: wallet } = useQuery({ fetcher: apiUser.getWalletAccount });

  useEffect(() => {
    if (asset === "USDC") {
      form.setFieldValue("network", "ERC20");
    } else if (!form.getFieldValue("network")) {
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

  const { mutate: submitRecharge, loading } = useMutation({
    fetcher: apiUser.recharge,
    onSuccess: () => {
      toast.success("提交成功");
      form.resetFields();
    },
  });

  return (
    <section className="px-3 pb-8 fade-stagger">
      <AppNav title="提交充值" />
      <div className="glass-card px-4 py-4 mt-3">
        <Form form={form} layout="vertical" onFinish={(values) => submitRecharge(values)}>
          <Form.Item label="资产" name="asset" initialValue="USDT" rules={[{ required: true }]}>
            <Select options={[{ label: "USDT", value: "USDT" }, { label: "USDC", value: "USDC" }]} />
          </Form.Item>
          <div className="text-xs text-[#5d7ca8] -mt-2 mb-3">当前可用余额：{currentBalance} {asset}</div>

          <Form.Item label="网络" name="network" initialValue="TRC20" rules={[{ required: true }]}>
            <Select
              options={
                asset === "USDC"
                  ? [{ label: "ERC20", value: "ERC20" }]
                  : [
                      { label: "TRC20", value: "TRC20" },
                      { label: "ERC20", value: "ERC20" },
                    ]
              }
            />
          </Form.Item>

          <Form.Item label="充值数量" name="amount" rules={[{ required: true, message: "请输入数量" }]}>
            <Input type="number" placeholder="请输入充值数量" />
          </Form.Item>

          <Form.Item label="充值凭证图片" name="voucherImage" rules={[{ required: true, message: "请上传充值凭证" }]}>
            <UploadImg />
          </Form.Item>

          <Button type="submit" className="w-full finance-btn-primary" loading={loading}>
            提交充值
          </Button>
        </Form>
      </div>
    </section>
  );
}
