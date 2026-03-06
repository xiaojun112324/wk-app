import { Form, Input, Select } from "antd";
import { Button } from "@/components/Button";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";

export default function Deposit() {
    const [form] = Form.useForm();

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
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => submitRecharge(values)}
                >
                    <Form.Item label="资产" name="asset" initialValue="USDT" rules={[{ required: true }]}>
                        <Select options={[{ label: "USDT", value: "USDT" }, { label: "USDC", value: "USDC" }]} />
                    </Form.Item>

                    <Form.Item label="网络" name="network" initialValue="TRC20" rules={[{ required: true }]}>
                        <Select options={[{ label: "TRC20", value: "TRC20" }, { label: "ERC20", value: "ERC20" }]} />
                    </Form.Item>

                    <Form.Item label="充值金额(CNY)" name="amountCny" rules={[{ required: true, message: "请输入金额" }]}>
                        <Input type="number" placeholder="请输入充值金额" />
                    </Form.Item>

                    <Form.Item label="凭证图片地址" name="voucherImage" rules={[{ required: true, message: "请输入凭证地址" }]}>
                        <Input placeholder="例如 /upload/recharge-proof-001.png" />
                    </Form.Item>

                    <Button type="submit" className="w-full finance-btn-primary" loading={loading}>提交充值</Button>
                </Form>
            </div>
        </section>
    );
}

